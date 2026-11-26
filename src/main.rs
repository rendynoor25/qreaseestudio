mod model;
mod topology;

use model::{apply, demo, Document, Edit, Object, Point};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    collections::HashMap,
    env, fs,
    io::{self, BufRead, BufReader, Read, Write},
    net::{IpAddr, TcpListener, TcpStream},
    path::{Path, PathBuf},
    sync::{Arc, Mutex},
    thread,
    time::{Duration, Instant},
};
use uuid::Uuid;

const MAX_BODY: usize = 262_144;
const CONNECTION_LIMIT: usize = 64;
const HTML: &str = include_str!("../web/index.html");
const CSS: &str = include_str!("../web/studio.css");
const JS: &str = include_str!("../web/studio.js");
const LINE_GEOMETRY: &str = include_str!("../web/line-geometry.js");
const CAD_EXPORT: &str = include_str!("../web/cad-export.js");
const SKP_IMPORT: &str = include_str!("../web/skp-import.js");
const LOGO: &[u8] = include_bytes!("../web/qreasee-logo.png");
const LOGO_BLACK: &[u8] = include_bytes!("../web/qreasee-logo-black.png");

struct Room {
    document: Document,
    peers: HashMap<Uuid, Peer>,
}

#[derive(Deserialize, Serialize)]
struct Cursor {
    mode: String,
    x: f64,
    y: f64,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    z: Option<f64>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    line: Option<LinePreview>,
}

#[derive(Deserialize, Serialize)]
struct LinePreview {
    a: Point,
    b: Point,
}

struct Peer {
    name: String,
    seen: Instant,
    cursor: Option<Cursor>,
}

struct Studio {
    directory: PathBuf,
    // The map lock protects room lookup only. Each room has its own lock so
    // geometry work and durable writes in one project do not block the others.
    rooms: Mutex<HashMap<Uuid, Arc<Mutex<Room>>>>,
    limits: Mutex<HashMap<IpAddr, (Instant, u32)>>,
}

#[derive(Deserialize)]
struct RequestData {
    client: Uuid,
    name: String,
    revision: Option<u64>,
    edit: Option<Edit>,
    cursor: Option<Cursor>,
}

fn main() -> io::Result<()> {
    let address = env::var("QREASEE_ADDR").unwrap_or_else(|_| "127.0.0.1:8941".into());
    let directory = PathBuf::from(env::var_os("QREASEE_DATA").unwrap_or_else(|| "data".into()));
    fs::create_dir_all(&directory)?;
    let studio = Arc::new(Studio {
        directory,
        rooms: Mutex::new(HashMap::new()),
        limits: Mutex::new(HashMap::new()),
    });
    let listener = TcpListener::bind(&address)?;
    println!("Qreasee · http://{}", listener.local_addr()?);
    let connections = Arc::new(std::sync::atomic::AtomicUsize::new(0));
    use std::sync::atomic::Ordering::Relaxed;
    for mut stream in listener.incoming().flatten() {
        if connections.fetch_add(1, Relaxed) >= CONNECTION_LIMIT {
            connections.fetch_sub(1, Relaxed);
            let _ = stream.set_write_timeout(Some(Duration::from_millis(100)));
            let _ = reject(
                &mut stream,
                "503 Service Unavailable",
                "Server sedang sibuk.",
            );
            continue;
        }
        let count = Arc::clone(&connections);
        let studio = Arc::clone(&studio);
        let spawned = thread::Builder::new().spawn(move || {
            let _ = serve(stream, &studio);
            count.fetch_sub(1, Relaxed);
        });
        if spawned.is_err() {
            connections.fetch_sub(1, Relaxed);
        }
    }
    Ok(())
}

fn line(reader: &mut impl BufRead, limit: usize) -> io::Result<String> {
    let mut value = String::new();
    reader.take(limit as u64).read_line(&mut value)?;
    if !value.ends_with("\r\n") {
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            "Incomplete HTTP line",
        ));
    }
    value.truncate(value.len() - 2);
    Ok(value)
}

fn serve(mut stream: TcpStream, studio: &Studio) -> io::Result<()> {
    let allowed = stream
        .peer_addr()
        .map(|peer| studio.allow(peer.ip()))
        .unwrap_or(false);
    if !allowed {
        return reject(
            &mut stream,
            "429 Too Many Requests",
            "Terlalu banyak permintaan. Coba lagi sebentar.",
        );
    }
    stream.set_read_timeout(Some(Duration::from_secs(4)))?;
    stream.set_write_timeout(Some(Duration::from_secs(4)))?;
    let mut reader = BufReader::new(&mut stream);
    let start = line(&mut reader, 4096)?;
    let parts: Vec<_> = start.split_ascii_whitespace().collect();
    let [method, path, "HTTP/1.1" | "HTTP/1.0"] = parts.as_slice() else {
        return reject(&mut stream, "400 Bad Request", "Permintaan tidak valid.");
    };
    let mut length = None;
    let mut json_input = false;
    let mut accepted_headers = false;
    let mut deadline = Instant::now() + Duration::from_secs(4);
    for _ in 0..48 {
        if Instant::now() > deadline {
            return Ok(());
        }
        let header = line(&mut reader, 4096)?;
        if header.is_empty() {
            accepted_headers = true;
            break;
        }
        let Some((key, value)) = header.split_once(':') else {
            return reject(&mut stream, "400 Bad Request", "Header tidak valid.");
        };
        if key.eq_ignore_ascii_case("Content-Length") {
            let Ok(size) = value.trim().parse::<usize>() else {
                return reject(&mut stream, "400 Bad Request", "Ukuran tidak valid.");
            };
            if length.replace(size).is_some() || size > MAX_BODY {
                return reject(
                    &mut stream,
                    "413 Payload Too Large",
                    "Permintaan terlalu besar.",
                );
            }
        }
        if key.eq_ignore_ascii_case("Transfer-Encoding") {
            return reject(
                &mut stream,
                "400 Bad Request",
                "Transfer encoding tidak didukung.",
            );
        }
        if key.eq_ignore_ascii_case("Content-Type") {
            json_input = value.trim().split(';').next() == Some("application/json");
        }
    }
    if !accepted_headers {
        return reject(
            &mut stream,
            "431 Request Header Fields Too Large",
            "Header terlalu panjang.",
        );
    }
    let mut body = vec![0; length.unwrap_or(0)];
    let mut remaining = body.as_mut_slice();
    deadline = Instant::now() + Duration::from_secs(4);
    while !remaining.is_empty() {
        if Instant::now() > deadline {
            return Ok(());
        }
        let received = reader.read(remaining)?;
        if received == 0 {
            return Ok(());
        }
        remaining = &mut remaining[received..];
    }
    match (*method, *path) {
        ("GET", "/") => respond(
            &mut stream,
            "200 OK",
            "text/html; charset=utf-8",
            HTML.as_bytes(),
        ),
        ("GET", "/studio.css") => respond(
            &mut stream,
            "200 OK",
            "text/css; charset=utf-8",
            CSS.as_bytes(),
        ),
        ("GET", "/studio.js") => respond(
            &mut stream,
            "200 OK",
            "text/javascript; charset=utf-8",
            JS.as_bytes(),
        ),
        ("GET", "/line-geometry.js") => respond(
            &mut stream,
            "200 OK",
            "text/javascript; charset=utf-8",
            LINE_GEOMETRY.as_bytes(),
        ),
        ("GET", "/cad-export.js") => respond(
            &mut stream,
            "200 OK",
            "text/javascript; charset=utf-8",
            CAD_EXPORT.as_bytes(),
        ),
        ("GET", "/skp-import.js") => respond(
            &mut stream,
            "200 OK",
            "text/javascript; charset=utf-8",
            SKP_IMPORT.as_bytes(),
        ),
        ("GET", "/qreasee-logo.png") => respond(
            &mut stream,
            "200 OK",
            "image/png",
            LOGO,
        ),
        ("GET", "/qreasee-logo-black.png") => respond(
            &mut stream,
            "200 OK",
            "image/png",
            LOGO_BLACK,
        ),
        ("POST", _) if !json_input => reject(
            &mut stream,
            "415 Unsupported Media Type",
            "Gunakan application/json.",
        ),
        ("POST", "/api/rooms") => {
            let seed: Value = match serde_json::from_slice(&body) {
                Ok(value) => value,
                Err(_) => return reject(&mut stream, "400 Bad Request", "JSON tidak valid."),
            };
            let id = Uuid::new_v4();
            let mut document = demo();
            if seed.get("blank").and_then(Value::as_bool) == Some(true) {
                document.objects.clear();
                document.sheet.title = "Proyek tanpa judul".into();
            }
            save(&studio.directory, id, &document)?;
            send_json(
                &mut stream,
                "201 Created",
                json!({ "room": id.to_string() }),
            )
        }
        ("POST", route) if route.starts_with("/api/rooms/") => {
            let Ok(id) = Uuid::parse_str(&route[11..]) else {
                return reject(&mut stream, "404 Not Found", "Ruang tidak ditemukan.");
            };
            let Ok(request) = serde_json::from_slice::<RequestData>(&body) else {
                return reject(&mut stream, "400 Bad Request", "Perintah tidak valid.");
            };
            let (status, payload) = studio.exchange(id, request)?;
            send_json(&mut stream, status, payload)
        }
        _ => reject(&mut stream, "404 Not Found", "Halaman tidak ditemukan."),
    }
}

impl Studio {
    fn allow(&self, address: IpAddr) -> bool {
        const WINDOW: Duration = Duration::from_secs(10);
        const LIMIT: u32 = 240;
        let Ok(mut limits) = self.limits.lock() else {
            return false;
        };
        let now = Instant::now();
        limits.retain(|_, (start, _)| now.duration_since(*start) < WINDOW);
        let entry = limits.entry(address).or_insert((now, 0));
        if entry.1 >= LIMIT {
            false
        } else {
            entry.1 += 1;
            true
        }
    }

    fn exchange(&self, id: Uuid, request: RequestData) -> io::Result<(&'static str, Value)> {
        let room_state = {
            let mut rooms = self
                .rooms
                .lock()
                .map_err(|_| io::Error::other("Room state lock poisoned"))?;
            if let std::collections::hash_map::Entry::Vacant(entry) = rooms.entry(id) {
                let Some(mut document) = restore(&self.directory, id)? else {
                    return Ok((
                        "404 Not Found",
                        json!({ "error": "Ruang tidak ditemukan." }),
                    ));
                };
                if model::initialize_faces(&mut document) {
                    save(&self.directory, id, &document)?;
                }
                entry.insert(Arc::new(Mutex::new(Room {
                    document,
                    peers: HashMap::new(),
                })));
            }
            Arc::clone(rooms.get(&id).expect("room loaded"))
        };
        let mut room_state = room_state
            .lock()
            .map_err(|_| io::Error::other("Room state lock poisoned"))?;
        let room = &mut *room_state;
        let now = Instant::now();
        room.peers
            .retain(|_, peer| now.duration_since(peer.seen) < Duration::from_secs(8));
        let name: String = request
            .name
            .trim()
            .chars()
            .filter(|c| !c.is_control())
            .take(32)
            .collect();
        let cursor = request.cursor.filter(|cursor| match cursor.mode.as_str() {
            "model" => cursor.x.abs() <= 10000.0 && cursor.y.abs() <= 10000.0
                && cursor.z.is_none_or(|z| z.is_finite() && z.abs() <= 10000.0)
                && cursor.line.as_ref().is_none_or(|line| line.a.iter().chain(line.b.iter())
                    .all(|value| value.is_finite() && value.abs() <= 10000.0)),
            "layout" => (0.0..=420.0).contains(&cursor.x) && (0.0..=297.0).contains(&cursor.y)
                && cursor.line.is_none(),
            _ => false,
        });
        if room.peers.len() < 64 || room.peers.contains_key(&request.client) {
            room.peers.insert(
                request.client,
                Peer {
                    name,
                    seen: now,
                    cursor,
                },
            );
        }
        let mut status = "200 OK";
        let mut error = None;
        let mut topology = None;
        if let Some(edit) = request.edit {
            let share_edit = matches!(&edit, Edit::Share { .. });
            let comment_edit = matches!(&edit, Edit::Comment { .. });
            let role = room.document.share.role.as_str();
            let denied = !share_edit
                && (role == "view" || (role == "comment" && !comment_edit));
            if denied {
                status = "403 Forbidden";
                error = Some(if role == "comment" {
                    "Akses ini hanya dapat menambah atau menghapus komentar."
                } else {
                    "Akses ini hanya dapat melihat proyek."
                });
            } else {
                let mut next = room.document.clone();
                match apply(&mut next, edit) {
                    Ok(faces) => {
                        if save(&self.directory, id, &next).is_ok() {
                            room.document = next;
                            topology = Some(faces);
                        } else {
                            status = "500 Internal Server Error";
                            error = Some("Revisi gagal disimpan.");
                        }
                    }
                    Err("conflict") => {
                        status = "409 Conflict";
                        error = Some("Objek atau lembar ini sudah diubah di sesi lain.");
                    }
                    Err(message) => {
                        status = "422 Unprocessable Content";
                        error = Some(message);
                    }
                }
            }
        }
        let peers: Vec<_> = room.peers.iter().map(|(client, peer)| {
            json!({ "id": client.to_string(), "name": peer.name, "cursor": peer.cursor })
        }).collect();
        let changes = (request.revision != Some(room.document.revision)).then(|| {
            json!({
                "document": room.document,
                "meshes": room.document.objects.iter().map(Object::mesh).collect::<Vec<_>>(),
                "plans": room.document.objects.iter().map(|object| object.plan(room.document.sheet.cut_height)).collect::<Vec<_>>()
            })
        });
        Ok((
            status,
            json!({ "changes": changes, "peers": peers, "error": error,
                "topology": topology, "can_manage": true,
                "role": room.document.share.role.clone() }),
        ))
    }
}

fn save(directory: &Path, id: Uuid, document: &Document) -> io::Result<()> {
    let room_dir = directory.join(id.to_string());
    fs::create_dir_all(&room_dir)?;
    let temporary = room_dir.join(format!("{}.tmp", Uuid::new_v4()));
    let current = room_dir.join(format!("{:020}.json", document.revision));
    let write = || -> io::Result<()> {
        let mut file = fs::File::create(&temporary)?;
        serde_json::to_writer(&mut file, document)?;
        file.sync_all()?;
        fs::rename(&temporary, &current)?;
        Ok(())
    };
    if let Err(error) = write() {
        let _ = fs::remove_file(&temporary);
        return Err(error);
    }
    if document.revision > 0 {
        let previous = room_dir.join(format!("{:020}.json", document.revision - 1));
        let _ = fs::remove_file(previous);
    }
    Ok(())
}

fn restore(directory: &Path, id: Uuid) -> io::Result<Option<Document>> {
    let path = directory.join(id.to_string());
    if !path.is_dir() {
        return Ok(None);
    }
    let latest = fs::read_dir(path)?
        .filter_map(Result::ok)
        .map(|entry| entry.path())
        .filter(|path| {
            path.extension()
                .is_some_and(|extension| extension == "json")
        })
        .max();
    latest
        .map(|path| {
            let file = fs::File::open(path)?;
            Ok(serde_json::from_reader(file)?)
        })
        .transpose()
}

fn reject(stream: &mut TcpStream, status: &str, error: &str) -> io::Result<()> {
    send_json(stream, status, json!({ "error": error }))
}

fn send_json(stream: &mut TcpStream, status: &str, body: Value) -> io::Result<()> {
    respond(
        stream,
        status,
        "application/json",
        &serde_json::to_vec(&body)?,
    )
}

fn respond(
    stream: &mut TcpStream,
    status: &str,
    content_type: &str,
    body: &[u8],
) -> io::Result<()> {
    write!(
        stream,
        "HTTP/1.1 {status}\r\nContent-Type: {content_type}\r\nContent-Length: {}\r\nConnection: close\r\nCache-Control: no-store\r\nX-Content-Type-Options: nosniff\r\nX-Frame-Options: DENY\r\nX-Permitted-Cross-Domain-Policies: none\r\nReferrer-Policy: no-referrer\r\nPermissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()\r\nCross-Origin-Opener-Policy: same-origin\r\nCross-Origin-Resource-Policy: same-origin\r\nContent-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'\r\n\r\n",
        body.len(),
    )?;
    stream.write_all(body)
}

use serde::{Deserialize, Serialize};
use std::{
    collections::{BTreeMap, HashSet},
    f64::consts::TAU,
};

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Membership {
    pub id: String,
    pub name: String,
    pub definition: Option<String>,
    pub slot: Option<String>,
}

impl Membership {
    fn valid(&self) -> bool {
        let uuid = |value: &str| uuid::Uuid::parse_str(value).is_ok();
        uuid(&self.id)
            && !self.name.trim().is_empty()
            && self.name.chars().count() <= 64
            && match (&self.definition, &self.slot) {
                (None, None) => true,
                (Some(definition), Some(slot)) => uuid(definition) && uuid(slot),
                _ => false,
            }
    }
}

pub type Point = [f64; 3];

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Shape {
    Line,
    Rectangle,
    Circle,
    Polygon,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Profile {
    pub points: Vec<[f64; 2]>,
    pub inferred: bool,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Object {
    pub id: String,
    pub name: String,
    pub shape: Shape,
    pub x: f64,
    pub y: f64,
    pub z: f64,
    pub width: f64,
    pub depth: f64,
    pub height: f64,
    pub rotation: f64,
    pub color: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub container: Option<Box<Membership>>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub profile: Option<Box<Profile>>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub wall_axis: Option<[f64; 2]>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub plane_u: Option<Point>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub plane_v: Option<Point>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub solid_id: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub surface_role: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub opening_id: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub opening_origin: Option<Point>,
    #[serde(default, skip_serializing_if = "is_false")]
    pub hide_edges: bool,
}

fn is_false(value: &bool) -> bool {
    !*value
}

#[derive(Serialize)]
pub struct Mesh {
    pub vertices: Vec<Point>,
    pub faces: Vec<Vec<usize>>,
    pub cut: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cap: Option<Vec<[usize; 3]>>,
}

impl Object {
    pub fn valid(&self) -> bool {
        let dimensions = [self.width, self.depth, self.height];
        let bounded = |number: f64| number.is_finite() && number.abs() <= 10000.0;
        uuid::Uuid::parse_str(&self.id).is_ok()
            && !self.name.trim().is_empty()
            && self.name.chars().count() <= 64
            && self.color.len() == 7
            && self.color.starts_with('#')
            && self.color.as_bytes()[1..].iter().all(u8::is_ascii_hexdigit)
            && [self.x, self.y, self.z, self.rotation]
                .into_iter()
                .all(bounded)
            && dimensions.into_iter().all(bounded)
            && self.wall_axis.is_none_or(|axis| {
                matches!(self.shape, Shape::Rectangle | Shape::Polygon | Shape::Circle)
                    && axis.iter().all(|value| value.is_finite())
                    && (axis[0].hypot(axis[1]) - 1.0).abs() < 1e-5
            })
            && match (self.plane_u, self.plane_v) {
                (None, None) => true,
                (Some(u), Some(v)) => {
                    self.shape == Shape::Polygon && self.wall_axis.is_none()
                        && u.into_iter().chain(v).all(bounded)
                        && (u.iter().map(|x| x*x).sum::<f64>()-1.0).abs()<1e-5
                        && (v.iter().map(|x| x*x).sum::<f64>()-1.0).abs()<1e-5
                        && u.iter().zip(v).map(|(a,b)| a*b).sum::<f64>().abs()<1e-5
                },
                _ => false,
            }
            && self.solid_id.as_ref().is_none_or(|id| uuid::Uuid::parse_str(id).is_ok())
            && self.surface_role.as_ref().is_none_or(|role| {
                self.solid_id.is_some()
                    && matches!(role.as_str(), "top" | "bottom" | "side" | "edge" | "pocket")
                    && (role == "edge") == (self.shape == Shape::Line)
            })
            && self.opening_id.as_ref().is_none_or(|id| {
                self.solid_id.is_some() && uuid::Uuid::parse_str(id).is_ok()
            })
            && self.opening_origin.is_none_or(|point| {
                self.opening_id.is_some() && point.iter().copied().all(bounded)
            })
            && self.container.as_deref().is_none_or(Membership::valid)
            && match (&self.shape, &self.profile) {
                (Shape::Polygon, Some(profile)) => {
                    profile.points.len() >= 3
                        && profile.points.len() <= 250
                        && profile
                            .points
                            .iter()
                            .flatten()
                            .all(|coordinate| coordinate.is_finite() && coordinate.abs() <= 0.501)
                        && crate::topology::triangulate(&profile.points).len()
                            == profile.points.len() - 2
                }
                (Shape::Polygon, None) | (_, Some(_)) => false,
                _ => true,
            }
            && match self.shape {
                Shape::Line => self.width.hypot(self.depth).hypot(self.height) >= 0.001,
                _ => self.width >= 0.001 && self.depth >= 0.001 && self.height >= 0.0,
            }
    }

    pub fn footprint(&self) -> Vec<[f64; 2]> {
        let w = self.width / 2.0;
        let d = self.depth / 2.0;
        let outline = match self.shape {
            Shape::Line => vec![[-w, -d], [w, d]],
            Shape::Rectangle => vec![[-w, -d], [w, -d], [w, d], [-w, d]],
            Shape::Circle => (0..48)
                .map(|i| {
                    let angle = i as f64 * TAU / 48.0;
                    [w * angle.cos(), d * angle.sin()]
                })
                .collect(),
            Shape::Polygon => self
                .profile
                .as_ref()
                .unwrap()
                .points
                .iter()
                .map(|point| [point[0] * self.width, point[1] * self.depth])
                .collect(),
        };
        let (sin, cos) = self.rotation.to_radians().sin_cos();
        outline
            .iter()
            .map(|[x, y]| [self.x + x * cos - y * sin, self.y + x * sin + y * cos])
            .collect()
    }

    pub fn mesh(&self) -> Mesh {
        if let (Some(u),Some(v),Some(profile)) = (self.plane_u,self.plane_v,&self.profile) {
            let normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
            let count=profile.points.len();
            let mut vertices:Vec<Point>=profile.points.iter().map(|p| {
                [self.x+u[0]*p[0]*self.width+v[0]*p[1]*self.depth,
                 self.y+u[1]*p[0]*self.width+v[1]*p[1]*self.depth,
                 self.z+u[2]*p[0]*self.width+v[2]*p[1]*self.depth]
            }).collect();
            let triangles=crate::topology::triangulate(&profile.points);
            let top:Vec<Vec<usize>>=triangles.iter().map(|triangle|triangle.to_vec()).collect();
            let mut faces=top.clone();
            if self.height>0.0 {
                vertices.extend((0..count).map(|i| {
                    [vertices[i][0]+normal[0]*self.height,
                     vertices[i][1]+normal[1]*self.height,
                     vertices[i][2]+normal[2]*self.height]
                }).collect::<Vec<_>>());
                faces=top.iter().map(|face|face.iter().rev().copied().collect()).collect();
                for i in 0..count {faces.push(vec![i,(i+1)%count,(i+1)%count+count,i+count]);}
                faces.extend(top.iter().map(|face|face.iter().map(|i|i+count).collect()));
            }
            return Mesh{vertices,faces,cut:false,cap:Some(triangles)};
        }
        if let Some(axis) = self.wall_axis {
            let (sin, cos) = self.rotation.to_radians().sin_cos();
            let u = [axis[0] * cos - axis[1] * sin, axis[0] * sin + axis[1] * cos];
            let n = [u[1], -u[0]];
            let w = self.width / 2.0;
            let d = self.depth / 2.0;
            let outline: Vec<_> = if self.shape == Shape::Circle {
                (0..48)
                    .map(|i| {
                        let angle = i as f64 * TAU / 48.0;
                        [w * angle.cos(), d * angle.sin()]
                    })
                    .collect()
            } else if let Some(profile) = &self.profile {
                profile.points.iter().map(|p| [p[0] * self.width, p[1] * self.depth]).collect()
            } else {
                vec![[-w, -d], [w, -d], [w, d], [-w, d]]
            };
            let count = outline.len();
            let sides_only =
                self.surface_role.as_deref() == Some("side") && self.shape == Shape::Circle;
            let mut vertices: Vec<Point> = outline.into_iter()
                .map(|[along, vertical]| {
                    [
                        self.x + along * u[0],
                        self.y + along * u[1],
                        self.z + vertical,
                    ]
                })
                .collect();
            let cap = self.profile.as_ref().map(|profile| crate::topology::triangulate(&profile.points));
            let top: Vec<Vec<usize>> = cap.as_ref().map_or_else(
                || vec![(0..count).collect()],
                |triangles| triangles.iter().map(|triangle| triangle.to_vec()).collect(),
            );
            if sides_only && self.height == 0.0 {
                return Mesh {
                    vertices: Vec::new(),
                    faces: Vec::new(),
                    cut: false,
                    cap: None,
                };
            }
            let mut faces = if sides_only { Vec::new() } else { top.clone() };
            if self.height > 0.0 {
                vertices.extend(
                    (0..count)
                        .map(|i| {
                            let point = vertices[i];
                            [
                                point[0] + self.height * n[0],
                                point[1] + self.height * n[1],
                                point[2],
                            ]
                        })
                        .collect::<Vec<_>>(),
                );
                if !sides_only {
                    faces = top.iter().map(|face| face.iter().rev().copied().collect()).collect();
                }
                for i in 0..count {
                    faces.push(vec![i, (i + 1) % count, (i + 1) % count + count, i + count]);
                }
                if !sides_only {
                    faces.extend(top.iter().map(|face| face.iter().map(|index| index + count).collect()));
                }
            }
            return Mesh {
                vertices,
                faces,
                cut: false,
                cap,
            };
        }
        let outline = self.footprint();
        let layer = |z| outline.iter().map(move |[x, y]| [*x, *y, z]);
        let mut vertices: Vec<_> = layer(self.z).collect();
        if self.shape == Shape::Line {
            vertices[1][2] += self.height;
        }
        let count = vertices.len();
        let mut faces = Vec::new();
        let sides_only = self.surface_role.as_deref() == Some("side") && self.shape == Shape::Circle;
        let cap = self
            .profile
            .as_ref()
            .map(|profile| crate::topology::triangulate(&profile.points));
        let top: Vec<Vec<usize>> = cap.as_ref().map_or_else(
            || vec![(0..count).collect()],
            |triangles| triangles.iter().map(|triangle| triangle.to_vec()).collect(),
        );
        if sides_only && self.height == 0.0 {
            return Mesh {
                vertices: Vec::new(),
                faces: Vec::new(),
                cut: false,
                cap: None,
            };
        }
        if self.shape != Shape::Line {
            if self.height == 0.0 {
                if !sides_only {
                    faces.extend(top);
                }
            } else {
                vertices.extend(layer(self.z + self.height));
                if !sides_only {
                    faces.extend(top.iter().map(|face| face.iter().rev().copied().collect()));
                }
                for i in 0..count {
                    let next = (i + 1) % count;
                    faces.push(vec![i, next, next + count, i + count]);
                }
                if !sides_only {
                    faces.extend(
                        top.iter()
                            .map(|face| face.iter().map(|index| index + count).collect()),
                    );
                }
            }
        }
        Mesh {
            vertices,
            faces,
            cut: false,
            cap,
        }
    }

    pub fn plan(&self, elevation: f64) -> Mesh {
        if self.plane_u.is_some() {
            let mesh=self.mesh();
            if mesh.vertices.iter().all(|point|point[2]>elevation) {
                return Mesh{vertices:Vec::new(),faces:Vec::new(),cut:false,cap:None};
            }
            return mesh;
        }
        if let Some(axis) = self.wall_axis {
            if self.z - self.depth / 2.0 > elevation {
                return Mesh {
                    vertices: Vec::new(),
                    faces: Vec::new(),
                    cut: false,
                    cap: None,
                };
            }
            if self.z + self.depth / 2.0 > elevation {
                let (sin, cos) = self.rotation.to_radians().sin_cos();
                let u = [axis[0] * cos - axis[1] * sin, axis[0] * sin + axis[1] * cos];
                let n = [u[1], -u[0]];
                let half = if self.shape == Shape::Circle {
                    let ratio = ((elevation - self.z) / (self.depth / 2.0)).clamp(-1.0, 1.0);
                    self.width / 2.0 * (1.0 - ratio * ratio).max(0.0).sqrt()
                } else {
                    self.width / 2.0
                };
                let vertices = [-half, half].map(|along| {
                    [
                        self.x + along * u[0] + self.height * n[0] / 2.0,
                        self.y + along * u[1] + self.height * n[1] / 2.0,
                        elevation,
                    ]
                });
                return Mesh {
                    vertices: vertices.to_vec(),
                    faces: Vec::new(),
                    cut: true,
                    cap: None,
                };
            }
            return self.mesh();
        }
        if self.z > elevation {
            return Mesh {
                vertices: Vec::new(),
                faces: Vec::new(),
                cut: false,
                cap: None,
            };
        }
        let cut = self.height > 0.0 && self.z + self.height > elevation;
        let mut mesh = self.mesh();
        if cut {
            mesh.vertices
                .iter_mut()
                .for_each(|vertex| vertex[2] = vertex[2].min(elevation));
            mesh.cut = true;
        }
        mesh
    }
}

fn default_cut_height() -> f64 {
    1.2
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Sheet {
    pub title: String,
    pub number: String,
    pub scale: u32,
    pub notes: String,
    #[serde(default = "default_cut_height")]
    pub cut_height: f64,
}

impl Sheet {
    pub fn valid(&self) -> bool {
        !self.title.trim().is_empty()
            && self.title.chars().count() <= 80
            && !self.number.trim().is_empty()
            && self.number.chars().count() <= 20
            && [25, 50, 75, 100, 150, 200, 500].contains(&self.scale)
            && self.notes.chars().count() <= 200
            && self.cut_height.is_finite()
            && self.cut_height.abs() <= 10000.0
    }
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Comment {
    pub id: String,
    pub target: String,
    pub author: String,
    pub text: String,
    pub created_at: u64,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub mentions: Vec<String>,
}

impl Comment {
    fn valid(&self) -> bool {
        uuid::Uuid::parse_str(&self.id).is_ok()
            && uuid::Uuid::parse_str(&self.target).is_ok()
            && !self.author.trim().is_empty()
            && self.author.chars().count() <= 32
            && !self.text.trim().is_empty()
            && self.text.chars().count() <= 1000
            && self.created_at > 0
            && self.mentions.len() <= 16
            && self
                .mentions
                .iter()
                .all(|name| !name.trim().is_empty() && name.chars().count() <= 32)
    }
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Document {
    pub revision: u64,
    pub objects: Vec<Object>,
    pub sheet: Sheet,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub comments: Vec<Comment>,
    #[serde(default)]
    pub faces_initialized: bool,
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum Edit {
    Object {
        before: Option<Object>,
        after: Option<Object>,
    },
    Batch {
        before: Vec<Object>,
        after: Vec<Object>,
        #[serde(default)]
        replay: bool,
    },
    Sheet {
        before: Sheet,
        after: Sheet,
    },
    Comment {
        before: Option<Comment>,
        after: Option<Comment>,
    },
}

#[derive(Debug, Default, PartialEq, Serialize)]
pub struct FaceChanges {
    pub added: Vec<Object>,
    pub removed: Vec<Object>,
}

pub fn apply(document: &mut Document, edit: Edit) -> Result<FaceChanges, &'static str> {
    let changes = match edit {
        Edit::Object { before, after } => apply_objects(
            document,
            before.into_iter().collect(),
            after.into_iter().collect(),
            false,
        )?,
        Edit::Batch {
            before,
            after,
            replay,
        } => apply_objects(document, before, after, replay)?,
        Edit::Sheet { before, after } => {
            if document.sheet != before {
                return Err("conflict");
            }
            if !after.valid() {
                return Err("Judul, nomor, skala, atau catatan tidak valid.");
            }
            document.sheet = after;
            FaceChanges::default()
        }
        Edit::Comment { before, after } => {
            apply_comment(document, before, after)?;
            FaceChanges::default()
        }
    };
    document.revision += 1;
    Ok(changes)
}

fn comment_target_exists(objects: &[Object], target: &str) -> bool {
    objects.iter().any(|object| {
        object.id == target
            || object
                .container
                .as_ref()
                .is_some_and(|container| container.id == target)
    })
}

fn apply_comment(
    document: &mut Document,
    before: Option<Comment>,
    after: Option<Comment>,
) -> Result<(), &'static str> {
    match (before, after) {
        (None, Some(comment)) => {
            if !comment.valid() || !comment_target_exists(&document.objects, &comment.target) {
                return Err("Komentar atau objek target tidak valid.");
            }
            if document.comments.iter().any(|item| item.id == comment.id) {
                return Err("conflict");
            }
            if document.comments.len() >= 200 {
                return Err("Batas 200 komentar per proyek tercapai.");
            }
            document.comments.push(comment);
            Ok(())
        }
        (Some(before), None) => {
            let Some(index) = document.comments.iter().position(|item| item.id == before.id) else {
                return Err("conflict");
            };
            if document.comments[index] != before {
                return Err("conflict");
            }
            document.comments.remove(index);
            Ok(())
        }
        (Some(before), Some(after)) => {
            if !after.valid() || !comment_target_exists(&document.objects, &after.target) {
                return Err("Komentar atau objek target tidak valid.");
            }
            let Some(index) = document.comments.iter().position(|item| item.id == before.id) else {
                return Err("conflict");
            };
            if document.comments[index] != before || after.id != before.id {
                return Err("conflict");
            }
            document.comments[index] = after;
            Ok(())
        }
        (None, None) => Err("Perintah komentar tidak valid."),
    }
}

fn apply_objects(
    document: &mut Document,
    before: Vec<Object>,
    after: Vec<Object>,
    replay: bool,
) -> Result<FaceChanges, &'static str> {
    let sources: BTreeMap<_, _> = before.iter().map(|object| (&object.id, object)).collect();
    let updates: BTreeMap<_, _> = after.iter().map(|object| (&object.id, object)).collect();
    if sources.len() != before.len()
        || updates.len() != after.len()
        || (sources.is_empty() && updates.is_empty())
        || after.iter().any(|object| !object.valid())
    {
        return Err("Geometri atau nama objek tidak valid.");
    }
    let existing: BTreeMap<_, _> = document
        .objects
        .iter()
        .map(|object| (&object.id, object))
        .collect();
    if sources
        .iter()
        .any(|(id, object)| existing.get(id) != Some(object))
        || updates
            .keys()
            .any(|id| existing.contains_key(id) && !sources.contains_key(id))
    {
        return Err("conflict");
    }
    let mut next: Vec<_> = document
        .objects
        .iter()
        .filter_map(|object| {
            if sources.contains_key(&object.id) {
                updates.get(&object.id).copied().cloned()
            } else {
                Some(object.clone())
            }
        })
        .collect();
    next.extend(
        after
            .iter()
            .filter(|object| !existing.contains_key(&object.id))
            .cloned(),
    );
    let mut changes = FaceChanges::default();
    if !replay {
        for object in &mut next {
            if sources
                .get(&object.id)
                .is_some_and(|previous| changed_profile(previous, object))
            {
                if let Some(profile) = object.profile.as_mut() {
                    profile.inferred = false;
                }
            }
        }
        changes = crate::topology::update_faces(&document.objects, &mut next, &sources);
        for object in &next {
            if updates
                .get(&object.id)
                .is_some_and(|proposed| *proposed != object)
            {
                changes.added.push(object.clone());
            }
        }
    }
    if next.len() > 250 {
        return Err("Batas ruang model adalah 250 objek.");
    }
    validate_containers(&next)?;
    document.comments.retain(|comment| {
        next.iter().any(|object| {
            object.id == comment.target
                || object
                    .container
                    .as_ref()
                    .is_some_and(|container| container.id == comment.target)
        })
    });
    document.objects = next;
    Ok(changes)
}

fn changed_profile(before: &Object, after: &Object) -> bool {
    before.x != after.x
        || before.y != after.y
        || before.z != after.z
        || before.width != after.width
        || before.depth != after.depth
        || before.height != after.height
        || before.rotation != after.rotation
}

pub fn initialize_faces(document: &mut Document) -> bool {
    if document.faces_initialized {
        return false;
    }
    document.faces_initialized = true;
    let mut objects = document.objects.clone();
    if crate::topology::initialize_faces(&mut objects) == 0
        || objects.len() > 250
        || validate_containers(&objects).is_err()
    {
        return false;
    }
    document.objects = objects;
    document.revision += 1;
    true
}

fn validate_containers(objects: &[Object]) -> Result<(), &'static str> {
    let mut instances: BTreeMap<&str, Vec<(&Membership, &Object)>> = BTreeMap::new();
    for object in objects {
        if let Some(container) = &object.container {
            instances
                .entry(&container.id)
                .or_default()
                .push((container, object));
        }
    }
    let mut definitions = BTreeMap::new();
    for members in instances.values_mut() {
        let (header, _) = members[0];
        if members
            .iter()
            .any(|(member, _)| member.definition != header.definition || member.name != header.name)
        {
            return Err("conflict");
        }
        let Some(definition) = header.definition.as_deref() else {
            continue;
        };
        let slots: HashSet<_> = members
            .iter()
            .map(|(member, _)| member.slot.as_deref())
            .collect();
        if slots.len() != members.len() {
            return Err("Slot Component duplikat.");
        }
        members.sort_unstable_by(|(a, _), (b, _)| a.slot.cmp(&b.slot));
        let reference = definitions
            .entry(definition)
            .or_insert_with(|| members.clone());
        if reference.len() != members.len() {
            return Err("conflict");
        }
        let origin = members[0].1;
        let base = reference[0].1;
        for ((slot, object), (base_slot, original)) in members.iter().zip(reference) {
            let equal_delta = |a: f64, b: f64, c: f64, d: f64| ((a - b) - (c - d)).abs() < 0.00001;
            if slot.slot != base_slot.slot
                || object.shape != original.shape
                || object.name != original.name
                || object.color != original.color
                || object.width != original.width
                || object.depth != original.depth
                || object.height != original.height
                || object.rotation != original.rotation
                || object.profile != original.profile
                || !equal_delta(object.x, origin.x, original.x, base.x)
                || !equal_delta(object.y, origin.y, original.y, base.y)
                || !equal_delta(object.z, origin.z, original.z, base.z)
            {
                return Err("conflict");
            }
        }
    }
    Ok(())
}

pub fn demo() -> Document {
    let mut objects = Vec::new();
    let mut block = |name: &str, [x, y, z, width, depth, height]: [f64; 6], color: &str| {
        objects.push(Object {
            id: uuid::Uuid::new_v4().to_string(),
            name: name.into(),
            shape: Shape::Rectangle,
            x,
            y,
            z,
            width,
            depth,
            height,
            rotation: 0.0,
            color: color.into(),
            container: None,
            profile: None,
            wall_axis: None,
            plane_u: None,
            plane_v: None,
            solid_id: None,
            surface_role: None,
            opening_id: None,
            opening_origin: None,
            hide_edges: false,
        });
    };
    block("Pelat dasar", [0., 0., 0., 13., 8., 0.28], "#c1b5a2");
    block(
        "Teras beton",
        [0., -3.25, 0.28, 12.9, 1.45, 0.12],
        "#dfcdb0",
    );
    block(
        "Dinding belakang",
        [0., 2.52, 0.28, 10.9, 0.24, 3.2],
        "#eff0e9",
    );
    block(
        "Dinding barat",
        [-5.32, 0., 0.28, 0.24, 5.0, 3.2],
        "#e9e3d6",
    );
    block("Inti servis", [3.85, 0.72, 0.28, 2.8, 3.45, 3.2], "#ded7c7");
    block(
        "Lantai dalam",
        [-0.6, -0.05, 0.28, 9.2, 4.8, 0.1],
        "#c3a987",
    );
    block("Atap utama", [-0.1, 0., 3.45, 11.9, 5.85, 0.28], "#eae2d3");
    block(
        "Atap teras",
        [-0.25, -3.2, 3.05, 11.9, 1.75, 0.25],
        "#423d36",
    );
    for x in [-5.45, -1.8, 1.85, 5.5] {
        block("Kolom teras", [x, -3.72, 0.4, 0.15, 0.15, 2.66], "#664e3a");
    }
    for x in [-4.6, -3.0, -1.4, 0.2, 1.8] {
        block("Panel kaca", [x, -2.42, 0.4, 1.48, 0.10, 2.64], "#809b9d");
        block(
            "Mullion",
            [x - 0.78, -2.50, 0.38, 0.065, 0.12, 2.70],
            "#464740",
        );
    }
    block(
        "Ambang atas",
        [-1.4, -2.43, 3.04, 8.05, 0.14, 0.42],
        "#95765c",
    );
    for i in 0..10 {
        block(
            "Kisi kayu",
            [2.62 + i as f64 * 0.30, -2.48, 0.38, 0.085, 0.2, 2.7],
            "#bd8651",
        );
    }
    Document {
        revision: 0,
        objects,
        sheet: Sheet {
            title: "Paviliun Cendana".into(),
            number: "A-101".into(),
            scale: 100,
            notes: "Dimensi model dalam meter.".into(),
            cut_height: default_cut_height(),
        },
        comments: Vec::new(),
        faces_initialized: true,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extrusion_has_closed_mesh_and_rotates() {
        let mut block = demo().objects.remove(0);
        block.rotation = 90.0;
        let mesh = block.mesh();
        assert_eq!(mesh.vertices.len(), 8);
        assert_eq!(mesh.faces.len(), 6);
        assert!((mesh.vertices[0][0] - 4.0).abs() < 0.0001);
        assert_eq!(mesh.vertices[4][2], 0.28);
    }

    #[test]
    fn circle_side_mesh_omits_caps() {
        let mut side = demo().objects.remove(0);
        side.shape = Shape::Circle;
        side.width = 2.0;
        side.depth = 2.0;
        side.z = 0.5;
        side.height = 3.0;
        side.solid_id = Some(uuid::Uuid::new_v4().to_string());
        side.surface_role = Some("side".into());
        assert!(side.valid());
        let mesh = side.mesh();
        assert_eq!(mesh.vertices.len(), 96);
        assert_eq!(mesh.faces.len(), 48);
        assert!(mesh.faces.iter().all(|face| face.len() == 4));
        assert!(mesh.cap.is_none());
    }

    #[test]
    fn vertical_circle_renders_in_wall_plane() {
        let mut circle = demo().objects.remove(0);
        circle.shape = Shape::Circle;
        circle.wall_axis = Some([1.0, 0.0]);
        circle.x = 2.0;
        circle.y = -1.5;
        circle.z = 1.5;
        circle.width = 2.0;
        circle.depth = 2.0;
        circle.height = 0.0;
        assert!(circle.valid());
        let mesh = circle.mesh();
        assert_eq!(mesh.vertices.len(), 48);
        assert_eq!(mesh.faces.len(), 1);
        assert!(mesh.vertices.iter().all(|point| (point[1] + 1.5).abs() < 1e-9));
        assert!((mesh.vertices[12][2] - 2.5).abs() < 1e-9);
        circle.solid_id = Some(uuid::Uuid::new_v4().to_string());
        circle.surface_role = Some("side".into());
        circle.height = 1.0;
        let side = circle.mesh();
        assert_eq!(side.vertices.len(), 96);
        assert_eq!(side.faces.len(), 48);
        assert!(side.cap.is_none());
    }

    #[test]
    fn vertical_line_keeps_distinct_endpoint_heights() {
        let mut line = demo().objects.remove(0);
        line.shape = Shape::Line;
        line.width = 0.0;
        line.depth = 0.0;
        line.height = 2.4;
        assert!(line.valid());
        let vertices = line.mesh().vertices;
        assert_eq!(vertices[0][2], 0.0);
        assert_eq!(vertices[1][2], 2.4);
    }

    #[test]
    fn vertical_rectangle_renders_on_wall_and_cuts_plan() {
        let mut rectangle = demo().objects.remove(0);
        rectangle.wall_axis = Some([1.0, 0.0]);
        rectangle.x = 2.0;
        rectangle.y = 3.0;
        rectangle.z = 1.5;
        rectangle.width = 2.0;
        rectangle.depth = 3.0;
        rectangle.height = 0.0;
        assert!(rectangle.valid());
        let mesh = rectangle.mesh();
        assert_eq!(mesh.faces, vec![vec![0, 1, 2, 3]]);
        assert_eq!(mesh.vertices[0], [1.0, 3.0, 0.0]);
        assert_eq!(mesh.vertices[2], [3.0, 3.0, 3.0]);
        let plan = rectangle.plan(1.2);
        assert_eq!(plan.vertices.len(), 2);
        assert!(plan.vertices.iter().all(|point| point[2] == 1.2));
        rectangle.wall_axis = Some([2.0, 0.0]);
        assert!(!rectangle.valid());
    }

    #[test]
    fn three_point_inclined_face_renders_and_extrudes() {
        let mut face=demo().objects.remove(0);
        face.shape=Shape::Polygon;
        face.height=0.0;
        face.plane_u=Some([2.0/(5.0_f64).sqrt(),0.0,1.0/(5.0_f64).sqrt()]);
        face.plane_v=Some([0.0,1.0,0.0]);
        face.x=1.0;face.y=1.0;face.z=0.5;
        face.width=(5.0_f64).sqrt();face.depth=2.0;
        face.profile=Some(Box::new(Profile{points:vec![[-0.5,-0.5],[0.5,-0.5],[0.0,0.5]],inferred:true}));
        assert!(face.valid());
        let mesh=face.mesh();
        assert_eq!(mesh.vertices.len(),3);
        assert_eq!(mesh.faces.len(),1);
        face.height=0.4;
        assert!(face.valid());
        assert_eq!(face.mesh().vertices.len(),6);
        assert_eq!(face.mesh().faces.len(),5);
    }

    #[test]
    fn independent_edits_merge_while_stale_same_object_conflicts() {
        let mut doc = demo();
        let first = doc.objects[0].clone();
        let second = doc.objects[1].clone();
        for old in [&first, &second] {
            let mut updated = old.clone();
            updated.width += 1.0;
            apply(
                &mut doc,
                Edit::Object {
                    before: Some(old.clone()),
                    after: Some(updated),
                },
            )
            .unwrap();
        }
        assert_eq!(doc.revision, 2);
        assert_eq!(
            apply(
                &mut doc,
                Edit::Object {
                    before: Some(first),
                    after: None
                }
            ),
            Err("conflict")
        );
        assert_eq!(doc.revision, 2);
    }

    #[test]
    fn comments_are_attached_to_targets_and_deleted_with_them() {
        let mut doc = demo();
        let first = doc.objects[0].clone();
        let comment = Comment {
            id: uuid::Uuid::new_v4().to_string(),
            target: first.id.clone(),
            author: "Rina".into(),
            text: "Periksa ketebalan @Budi".into(),
            created_at: 1_700_000_000_000,
            mentions: vec!["Budi".into()],
        };
        apply(
            &mut doc,
            Edit::Comment {
                before: None,
                after: Some(comment.clone()),
            },
        )
        .unwrap();
        assert_eq!(doc.comments, vec![comment]);
        apply(
            &mut doc,
            Edit::Object {
                before: Some(first),
                after: None,
            },
        )
        .unwrap();
        assert!(doc.comments.is_empty());
    }

    #[test]
    fn container_comments_remain_until_the_group_disappears() {
        let mut doc = demo();
        let mut first = doc.objects[0].clone();
        let mut second = doc.objects[1].clone();
        let container = Membership {
            id: uuid::Uuid::new_v4().to_string(),
            name: "Atap Grup".into(),
            definition: None,
            slot: None,
        };
        first.container = Some(Box::new(container.clone()));
        second.container = Some(Box::new(container.clone()));
        let previous = doc.objects[..2].to_vec();
        apply(
            &mut doc,
            Edit::Batch {
                before: previous,
                after: vec![first.clone(), second.clone()],
                replay: false,
            },
        )
        .unwrap();
        apply(
            &mut doc,
            Edit::Comment {
                before: None,
                after: Some(Comment {
                    id: uuid::Uuid::new_v4().to_string(),
                    target: container.id,
                    author: "Rina".into(),
                    text: "Grup ini perlu ditinjau.".into(),
                    created_at: 1_700_000_000_000,
                    mentions: Vec::new(),
                }),
            },
        )
        .unwrap();
        apply(
            &mut doc,
            Edit::Object {
                before: Some(first),
                after: None,
            },
        )
        .unwrap();
        assert_eq!(doc.comments.len(), 1, "comment follows the remaining group");
        apply(
            &mut doc,
            Edit::Object {
                before: Some(second),
                after: None,
            },
        )
        .unwrap();
        assert!(doc.comments.is_empty());
    }

    #[test]
    fn comment_target_must_exist() {
        let mut doc = demo();
        let comment = Comment {
            id: uuid::Uuid::new_v4().to_string(),
            target: uuid::Uuid::new_v4().to_string(),
            author: "Rina".into(),
            text: "Tidak ada target.".into(),
            created_at: 1_700_000_000_000,
            mentions: Vec::new(),
        };
        assert_eq!(
            apply(
                &mut doc,
                Edit::Comment {
                    before: None,
                    after: Some(comment),
                }
            ),
            Err("Komentar atau objek target tidak valid.")
        );
    }
}

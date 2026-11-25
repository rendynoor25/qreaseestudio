# Qreasee Studio

Editor 3D dan lembar arsitektur dalam satu aplikasi web. Rust menyimpan dokumen, membuat mesh, memvalidasi operasi, dan menyinkronkan revisi ruang. JavaScript menangani kanvas interaktif, pratinjau drag, dan lembar vektor SVG.

## Jalankan di Windows

Jalankan `Mulai-Qreasee.cmd` dari folder yang juga berisi `qreasee-studio.exe`. Server membuka aplikasi di `http://127.0.0.1:8941`. Biarkan jendela server terbuka saat bekerja. Aplikasi pertama kali membuat ruang berisi contoh Paviliun Cendana. Gunakan menu di sebelah nama proyek untuk membuat ruang kosong. Simpan tautan ruang untuk membukanya kembali.

Untuk membangun dari kode sumber dengan toolchain Rust dan Visual Studio Build Tools:

```powershell
cargo build --locked --release
cargo test --locked
.\target\release\qreasee-studio.exe
```

## Alur kerja

| Kebutuhan | Cara menggunakan |
| --- | --- |
| Menggambar | Pilih Garis (L), Persegi panjang (R), atau Lingkaran (C). Klik dan tarik. Snap mencari ujung, titik tengah, dan tepi yang terlihat. Jika tidak ada titik terdekat, Snap memakai grid 0,25 m. Titik awal menentukan elevasi gambar. |
| Membentuk bidang | Hubungkan garis hingga menutup loop pada elevasi yang sama. Klik bagian dalam untuk memilih bidang dan klik tepi untuk memilih garis. Bidang memiliki properti dan dapat di-Push/Pull. Menambahkan garis pembagi memecah bidang otomatis yang masih mengikuti garis sumber. |
| Membuat volume | Gunakan Push/Pull (P) di tampilan 3D. Tarik bidang atas untuk mengatur tinggi dengan langkah 0,05 m saat Snap aktif. Tinggi juga bisa diisi langsung. |
| Mengedit objek | Pilih objek di kanvas atau daftar. Isi nama, dimensi, posisi, sudut rotasi, dan warna melalui properti. Gunakan Move (M) untuk menggeser sejajar bidang dasar. |
| Rotate | Pilih Rotate (Q) dan tarik mengelilingi pusat objek atau Group. Sudut positif di panel properti memutar berlawanan arah jarum jam pada denah. |
| Skala | Pilih Skala (S), lalu tarik dari bagian objek atau Group di luar pusatnya. Ukuran dan tinggi berubah proporsional; Snap memakai langkah faktor 0,05. Untuk mengubah isi Component, buka Edit isi terlebih dahulu. |
| Penghapus | Pilih Penghapus (E), lalu klik objek atau Group. Gunakan Ctrl+Z untuk mengurungkan. |
| Ukur | Pilih Ukur (T), tarik antara dua titik pada elevasi yang sama. Jarak tampil di kanvas dan bilah status dalam meter. Pengukuran ini bersifat sementara. |
| Melihat model | Perspektif aktif saat proyek dibuka. Menu kamera juga menyediakan Aksonometri, Denah, Tampak depan, dan Tampak kanan. Gulir untuk zoom. Tahan tombol tengah untuk orbit. Shift + tombol tengah atau tombol kanan menggeser kamera. F memasukkan seluruh model ke layar. |
| Group | Shift + klik objek lepas di kanvas atau daftar, lalu pilih Group. Pindahkan atau duplikat Group sebagai satu unit. Pilih Edit isi untuk mengubah anggotanya, dan Urai untuk melepas grup. |
| Component | Shift + klik objek lepas, lalu pilih Component. Duplikat membuat instans tertaut yang dapat dipindah secara independen. Perubahan lewat Edit isi diterapkan pada semua instans. Urai melepaskan satu instans dari tautannya. Group dan Component bertingkat belum tersedia. |
| Membuat gambar kerja | Buka Layout untuk melihat denah, tampak depan, tampak kanan, dan aksonometri yang mengikuti model. Edit judul, nomor, skala, dan catatan. Gunakan Cetak / PDF dengan kertas A3 lanskap dan ukuran aktual 100%. |
| Berkolaborasi | Gunakan Bagikan, isi nama tampilan, lalu salin tautan. Peserta yang membuka ruang yang sama melihat nama, kursor, dan revisi model maupun Layout. |
| Mengekspor | Unduh geometri OBJ dengan sumbu Z ke atas atau snapshot JSON melalui menu proyek. |

Layout A3 memiliki empat viewport tetap. Tiga viewport ortografis memakai skala terukur, aksonometri dipaskan otomatis. Denah memotong model pada elevasi yang dapat diatur dan menampilkan satu dimensi lebar keseluruhan. Jika model melewati batas viewport, pilih penyebut skala lebih besar.

## Kolaborasi dan hosting

URL `127.0.0.1` berlaku pada komputer tempat server berjalan. Dua tab pada komputer tersebut dapat membuka ruang yang sama untuk menguji kolaborasi. Untuk lintas komputer, jalankan satu instans server pada mesin yang dapat diakses peserta dan bagikan URL instans itu beserta fragmen ruangnya. Tempatkan server di balik endpoint HTTPS untuk akses lewat internet. Atur `QREASEE_ADDR` untuk alamat dan port listen serta `QREASEE_DATA` untuk direktori penyimpanan persisten. Jangan jalankan beberapa instans yang menulis ke direktori data yang sama.

```powershell
$env:QREASEE_ADDR = '0.0.0.0:8941'
$env:QREASEE_DATA = 'C:\QreaseeData'
.\qreasee-studio.exe
```

Paket juga berisi Dockerfile. Dari folder sumber, gunakan:

```sh
docker build -t qreasee-studio .
docker run --name qreasee-studio -p 127.0.0.1:8941:8941 -v qreasee-data:/data qreasee-studio
```

Tautan ruang memberikan izin edit kepada siapa pun yang memegangnya. Versi ini belum memiliki akun, peran pengguna, riwayat revisi yang bisa dipulihkan, atau pengujian beban produksi. Untuk ruang privat, batasi akses di depan server dan gunakan tautan langsung hanya untuk peserta yang dipercaya. Simpan cadangan direktori data jika model diperlukan di kemudian hari.

Revisi dan posisi kursor diperiksa setiap 350 ms selama tab aktif. Perubahan geometri dibagikan setelah drag dilepas atau setelah nilai diterapkan. Edit pada objek yang berbeda bisa digabung, sedangkan edit dari versi lama pada objek atau lembar yang sama ditolak dan memuat keadaan terbaru. Undo/redo berlaku pada operasi sesi sendiri dan tunduk pada pemeriksaan konflik yang sama.

## Referensi fungsi SketchUp 2021

Inspeksi pada jendela SketchUp Pro 2021 memperlihatkan alat gambar garis, persegi, dan lingkaran, Push/Pull dan Move, navigasi Orbit/Pan/Zoom, serta panel Entity Info, Materials, dan Scenes. Ada perintah LayOut tersendiri di toolbar. Pada Qreasee Studio, daftar objek dan properti berada di sekitar kanvas, sementara tab Layout membaca dokumen 3D yang sama. Antarmuka mengikuti palet aplikasi web `D:\Qreasee\qreasee\apps\web\src\styles.css` dengan aksen `#F0913B`.

Geometri versi ini menggunakan garis dan profil horizontal yang diekstrusi vertikal. Bidang otomatis mendukung loop tertutup horizontal, termasuk bentuk cekung. Loop bersarang belum otomatis menghasilkan lubang. Dukungan SKP, potongan, tags, pengeditan mesh per muka, dan tata letak bebas atau multi-lembar belum tersedia. File JSON adalah snapshot ekspor. Untuk melanjutkan pengeditan, buka kembali tautan ruang asal.

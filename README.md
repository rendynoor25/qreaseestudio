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

## Pemeriksaan tipe

Kode browser tetap berupa JavaScript dan dimuat langsung oleh server Rust, tanpa langkah kompilasi TypeScript. Pemeriksaan tipe statis memakai TypeScript dengan JSDoc dan `checkJs`:

```powershell
npm ci
npm run check
```

Bentuk data bersama berada di [`web/qreasee-types.d.ts`](web/qreasee-types.d.ts) dan perlu diselaraskan dengan `src/model.rs`, `src/main.rs`, serta RPC Supabase. Konfigurasi saat ini memakai `strict: false`; `strictNullChecks` dapat diaktifkan bertahap setelah bagian yang diperiksa sudah memiliki tipe yang lengkap.

## Alur kerja

| Kebutuhan | Cara menggunakan |
| --- | --- |
| Menggambar | Pilih Garis (L), Rectangle (R), atau Lingkaran (C). Ketik ukuran sebelum atau sesudah klik titik awal, lalu klik kedua kali untuk menentukan arah. Garis menerima panjang, Rectangle menerima `X x Y` (misalnya `2 x 3`), dan Lingkaran menerima radius. Rectangle dan Lingkaran dapat digambar pada permukaan horizontal atau dinding vertikal; pada Rectangle, X mengikuti arah mendatar bidang dan Y arah tegak pada dinding. Lingkaran pada dinding membentuk bidang bulat tegak, dan Push/Pull bergerak sepanjang normal dinding. Titik awal dan akhir Rectangle ikut snap ke ujung, titik tengah, dan tepi, termasuk pada dinding vertikal. Rectangle dan Lingkaran yang selesai dibuat tidak otomatis terpilih, sehingga tidak langsung menampilkan pola seleksi. Drag langsung tanpa angka tetap tersedia. Snap mencari ujung (oranye), titik tengah (kuning), dan tepi yang terlihat; tanpa titik dekat, Snap memakai grid 0,25 m. Garis baru yang berpotongan atau menimpa garis lama membagi garis lama; bagian yang tumpang tindih tidak diduplikasi. |
| Busur | Pilih Busur (A), klik pusat, ketik radius (misalnya `2`) atau radius dan sudut (misalnya `2, 90`), lalu klik arah untuk membuat busur. Radius saja memakai sudut 90°. Tanpa angka, klik awal, klik akhir chord, lalu klik ketiga untuk menetapkan kelengkungan. Busur disimpan sebagai rangkaian garis dalam satu operasi. |
| Offset | Pilih Offset (F), klik perimeter bidang datar, lalu gerakkan kursor ke dalam atau ke luar. Klik kedua menetapkan jarak, atau ketik jarak setelah klik pertama lalu tekan Enter. Arah ke dalam membuat bidang offset di dalam perimeter; arah ke luar membuat bidang baru yang melampaui bidang lama. |
| Membentuk bidang | Hubungkan minimal tiga titik yang tidak segaris dengan garis pada satu bidang datar, termasuk bidang vertikal atau miring. Tutup loop untuk membuat bidang otomatis. Klik bagian dalam untuk memilih bidang dan klik tepi untuk memilih garis. Bidang memiliki properti dan dapat di-Push/Pull. Menambahkan garis pembagi memecah bidang horizontal yang masih mengikuti garis sumber. Rectangle atau Lingkaran baru yang berpotongan dengan bidang lama membagi kedua bidang; daerah irisan, sisa bidang lama, dan bagian luar bentuk baru masing-masing menjadi bidang terpisah yang dapat diklik. |
| Membuat volume dan bukaan | Gunakan Push/Pull (P) di tampilan 3D. Klik bidang persegi panjang, ketik jarak, lalu klik arah tarik; drag langsung juga tersedia. Volume persegi panjang menghasilkan bidang atas, bawah, empat sisi, dan garis tepi sebagai objek terpisah yang bisa dipilih dan dikelompokkan sendiri. Push/Pull pada salah satu sisi balok menggeser sisi itu dan menyesuaikan tutup atas, tutup bawah, serta sisi lain tanpa meninggalkan bidang lama. Lingkaran yang ditarik menjadi tiga objek terpisah: bidang bawah, bidang atas, dan satu sisi silinder halus tanpa garis faset yang bisa dipilih sebagai satu permukaan. Rectangle baru yang berpotongan dengan bidang atas atau dinding vertikal membagi bidang lama, termasuk jika Rectangle baru hanya sebagian berada di dalam bidang lama. Bidang baru pada sisi vertikal dapat ditarik keluar menjadi tonjolan yang menyatu dengan bidang lama, atau ditarik ke dalam menjadi cekungan; garis penghubung antara bidang asal dan bidang baru tidak digambar. Push/Pull bidang baru ke dalam untuk membuat cekungan; lanjutkan sampai menembus sisi seberangnya untuk membuat lubang. Tiap langkah dapat diurungkan dengan Undo. |
| Mengedit objek | Pilih objek di kanvas atau daftar. Isi nama, dimensi, posisi, sudut rotasi, dan warna melalui properti. Wajah yang disorot mouse menampilkan pola silang; wajah atau objek terpilih menampilkan pola titik. Gunakan Move (M) setelah memilih objek: klik titik awal pergeseran, lalu klik titik tujuan; kedua klik dapat snap ke ujung, titik tengah, tepi, atau permukaan objek lain sehingga objek ikut naik atau turun mengikuti ketinggian titik tujuan. Saat klik kedua, tahan Alt dan klik bidang horizontal untuk meletakkan dasar objek tepat di atas bidang itu, misalnya di atas lantai teras. Selama Move, tekan panah Atas atau Bawah untuk mengunci gerakan ke sumbu Z dan menggeser objek naik/turun; tekan panah lagi untuk kembali bebas. Esc membatalkan. |
| Rotate | Pilih Rotate dari bilah alat. Klik pusat rotasi (bisa snap), lalu gerakkan kursor untuk menentukan sudut dan klik kedua. Anda juga dapat mengetik sudut lalu menekan Enter. Sudut positif memutar berlawanan arah jarum jam pada denah. |
| Skala | Pilih Skala (S), lalu tarik dari bagian objek atau Group di luar pusatnya. Ukuran dan tinggi berubah proporsional; Snap memakai langkah faktor 0,05. Untuk mengubah isi Component, buka Edit isi terlebih dahulu. |
| Penghapus | Pilih Penghapus (E), lalu klik garis atau tahan tombol kiri dan geser melewati beberapa garis. Eraser hanya menghapus garis, tidak menghapus bidang secara langsung; bidang otomatis yang kehilangan batasnya ikut hilang. Objek atau beberapa objek yang sedang terpilih tetap dapat dihapus dengan Delete atau Backspace. Gunakan Ctrl+Z untuk mengurungkan. |
| Ukur | Pilih Ukur (T), tarik antara dua titik pada elevasi yang sama. Jarak tampil di kanvas dan bilah status dalam meter. Pengukuran ini bersifat sementara. |
| Melihat model | Perspektif aktif saat proyek dibuka dengan FOV vertikal tetap 35°. Scroll ke atas memajukan kamera (zoom in), scroll ke bawah memundurkannya (zoom out). Menu kamera juga menyediakan Aksonometri, Denah, Tampak depan, dan Tampak kanan. Tahan tombol tengah dan drag untuk orbit mengelilingi titik model yang diklik; titik itu tetap di posisi layar yang sama, juga saat kamera berada di atas atau bawah model. Shift + tombol tengah atau tombol kanan menggeser kamera. Shift+F memasukkan seluruh model ke layar. |
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

## Demo statis di Vercel

Jalankan `node scripts/build-demo.cjs` untuk menghasilkan folder `dist` berisi aset statis. Folder ini dapat di-deploy ke Vercel menggunakan `vercel.json`. Tanpa mode cloud, demo memakai `localStorage` browser; tombol Bagikan menjelaskan batasnya dan penyalinan tautan ruang dinonaktifkan. Mode cloud di bawah menyimpan ruang di Supabase sehingga tautan yang sama membuka model yang sama di PC berbeda.

Untuk menguji kolaborasi antara dua PC pada Wi-Fi yang sama, jalankan server Rust dengan `QREASEE_ADDR=0.0.0.0:8944` dan direktori `QREASEE_DATA` khusus demo. Buka `http://<IP-PC-SERVER>:8944/` pada kedua PC, buat ruang dari PC pertama, dan gunakan Bagikan untuk menyalin URL ruang yang sama. PC server harus tetap menyala; firewall Windows mungkin perlu mengizinkan koneksi masuk pada port 8944. Jangan memakai URL `127.0.0.1` di PC kedua karena alamat itu selalu menunjuk ke PC yang sedang digunakan.

## Konfigurasi Supabase

Salin `.env.example` ke `.env.local`, lalu isi URL proyek dan publishable key dari Supabase. `.env.local` diabaikan Git. Jalankan `node scripts/check-supabase.cjs` untuk memeriksa koneksi tanpa mencetak key. Terapkan [`supabase/001_shared_rooms.sql`](supabase/001_shared_rooms.sql) sekali melalui SQL Editor di dashboard Supabase. Kunci publishable tidak punya izin untuk membuat tabel sendiri.

Untuk build demo lintas internet, set `QREASEE_CLOUD_DEMO=1`, `NEXT_PUBLIC_SUPABASE_URL`, dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` sebagai variabel lingkungan build Vercel. Jalankan build ulang; jangan unggah `.env.local`. Pada build lokal, dua nilai Supabase boleh dibaca dari `.env.local`. `dist/cloud-config.js` berisi publishable key yang memang ditujukan untuk browser. Tabel tidak memberi akses langsung kepada `anon`; fungsi RPC menerima UUID ruang sebagai izin edit. Tautan harus dibagikan hanya kepada peserta uji. Mode ini masih prototipe: belum ada akun pengguna, izin per anggota, pembatasan pembuatan ruang, atau ketahanan untuk beban besar. Model dan kursor diperiksa tiap 1,5 detik. Pengeditan objek berbeda dapat bergabung; pengeditan objek atau lembar yang sama menampilkan konflik. Pembentukan bidang otomatis tetap memerlukan server Rust dan belum tersedia pada demo cloud.

Qreasee saat ini bukan aplikasi Next.js, jadi helper SSR dan middleware Next.js tidak dipakai. Klien demo memanggil Supabase REST RPC langsung dari browser.

Demo cloud publik tersedia di [GitHub Pages](https://rendynoor25.github.io/qreaseestudio/). Untuk publikasi ulang, jalankan build cloud lalu unggah tujuh aset di `dist` ke cabang `gh-pages`. Path aset pada build memakai direktori situs saat ini sehingga tautan Pages dapat dibuka dari `/qreaseestudio/`. Jalankan `node scripts/test-cloud.cjs` untuk menguji sinkronisasi dua klien, konflik, dan penggabungan edit; tes ini membuat satu ruang kecil di Supabase.

### Mode masuk dengan Google

Mode Google disiapkan sebagai build terpisah agar demo publik tetap bisa dipakai selama konfigurasi OAuth. Di Google Cloud Console, buat OAuth client tipe Web application. Daftarkan origin situs `https://rendynoor25.github.io` dan callback Supabase yang ditampilkan pada **Authentication → Providers → Google**. Masukkan Client ID dan Client Secret hanya di dashboard Supabase, lalu aktifkan provider Google. Pada **Authentication → URL Configuration**, set Site URL `https://rendynoor25.github.io/qreaseestudio/` dan tambahkan alamat yang sama ke Redirect URLs. Jangan masukkan Client Secret ke repository atau variabel `NEXT_PUBLIC_*`.

Setelah provider aktif, jalankan `npm ci`, build dengan `QREASEE_CLOUD_DEMO=1` serta `QREASEE_AUTH_DEMO=1`, lalu terbitkan build login. Segera sesudah situs login aktif, jalankan `supabase/002_google_login.sql` di SQL Editor. Urutan ini menghindari masa ketika situs lama sudah kehilangan izin mengedit tetapi halaman login belum terbit. Build login menampilkan gerbang Google, menyimpan sesi dengan `@supabase/supabase-js`, dan mengirim access token saat memanggil RPC. Migrasi mencabut izin `anon`; jangan menganggap autentikasi aktif sebelum migrasi selesai. Ruang lama tetap bisa dibuka oleh akun Google yang memegang tautannya. Mode ini belum memiliki daftar anggota atau peran per ruang; setiap akun yang masuk dan memiliki tautan dapat mengedit. Setelah migrasi, skrip uji RPC memerlukan access token pengguna lewat variabel `QREASEE_TEST_ACCESS_TOKEN`; jangan simpan token dalam berkas atau commit.

Tautan ruang memberikan izin edit kepada siapa pun yang memegangnya. Versi ini belum memiliki akun, peran pengguna, riwayat revisi yang bisa dipulihkan, atau pengujian beban produksi. Untuk ruang privat, batasi akses di depan server dan gunakan tautan langsung hanya untuk peserta yang dipercaya. Simpan cadangan direktori data jika model diperlukan di kemudian hari.

Revisi dan posisi kursor diperiksa setiap 350 ms selama tab aktif. Perubahan geometri dibagikan setelah drag dilepas atau setelah nilai diterapkan. Edit pada objek yang berbeda bisa digabung, sedangkan edit dari versi lama pada objek atau lembar yang sama ditolak dan memuat keadaan terbaru. Undo/redo berlaku pada operasi sesi sendiri dan tunduk pada pemeriksaan konflik yang sama.

## Referensi fungsi SketchUp 2021

Inspeksi pada jendela SketchUp Pro 2021 memperlihatkan alat gambar garis, persegi, dan lingkaran, Push/Pull dan Move, navigasi Orbit/Pan/Zoom, serta panel Entity Info, Materials, dan Scenes. Ada perintah LayOut tersendiri di toolbar. Pada Qreasee Studio, daftar objek dan properti berada di sekitar kanvas, sementara tab Layout membaca dokumen 3D yang sama. Antarmuka mengikuti palet aplikasi web `D:\Qreasee\qreasee\apps\web\src\styles.css` dengan aksen `#F0913B`.

Geometri versi ini menggunakan garis, profil horizontal yang diekstrusi vertikal, dan Rectangle vertikal pada dinding. Bidang otomatis mendukung loop tertutup horizontal, termasuk bentuk cekung. Loop bersarang belum otomatis menghasilkan lubang. Push/Pull masih bekerja pada permukaan horizontal. Dukungan SKP, potongan, tags, pengeditan mesh per muka, dan tata letak bebas atau multi-lembar belum tersedia. File JSON adalah snapshot ekspor. Untuk melanjutkan pengeditan, buka kembali tautan ruang asal.

Line Tool mendukung rangkaian klik, inferensi sumbu X/Y/Z, panjang numerik sesuai satuan aktif, serta undo/redo per segmen. Loop tertutup horizontal menghasilkan bidang yang dapat dipakai Push/Pull. Pada demo Supabase, garis penutup dan bidang dikirim dalam satu edit; pratinjau garis dan kursor dibagikan selama menggambar. Logika snap sumbu dan triangulasi ditulis di `web/line-geometry.ts`, lalu dibangun menjadi `web/line-geometry.js` dengan `npm run build:line`. UI utama masih `web/studio.js` dengan pemeriksaan TypeScript melalui JSDoc dan `npm run check`; migrasi dilakukan bertahap.

Selection Tool mendukung kotak dari kiri ke kanan untuk memilih objek yang seluruh proyeksinya berada di dalam kotak, dan dari kanan ke kiri untuk memilih objek yang bersinggungan dengan kotak. Klik tiga kali pada garis memilih rangkaian garis yang bertemu pada ujungnya; klik tiga kali pada bidang memilih bidang yang berbagi sisi beserta garis-garis batasnya. Group dan Component dipilih sebagai satu objek selama tidak dalam mode Edit isi. Tahan Shift saat menarik kotak untuk menambah pilihan.

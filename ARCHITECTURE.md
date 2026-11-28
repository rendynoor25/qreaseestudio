# Peta kode Qreasee

## Alur data

1. `src/main.rs` menerima operasi dan mengirim revisi ruang. `src/model.rs` memvalidasi dokumen dan membangun mesh. `src/topology.rs` membagi garis yang berpotongan dan membentuk bidang.
2. `web/studio/bootstrap.js` mengelola state, UI utama, dan sinkronisasi. `comments.js` berisi komentar dan bidang potong, `modeling.js` berisi seleksi serta operasi model, `viewport.js` menangani kamera, gambar kanvas, dan input alat, sedangkan `layout.js` menangani lembar. Kelimanya disusun berurutan menjadi `web/studio.js` untuk server Rust. Semua masih berbagi lingkup global editor; pemisahan ini membuat kepemilikan kode jelas tanpa mengubah state atau perilaku.
3. `web/line-geometry.ts` berisi geometri garis dan bidang di browser. `web/cad-export.ts` dan `web/skp-import.ts` menangani batas format CAD. Ketiganya adalah sumber; berkas `.js` senama adalah hasil build yang disimpan agar server Rust dan demo statis bisa memuatnya langsung.
4. `demo/cloud.js` dan `demo/auth-entry.js` menghubungkan editor statis ke Supabase. `demo/demo.js` menyediakan mode contoh lokal. `scripts/build-demo.cjs` menyusun berkas distribusi dari sumber web dan demo.

## Kontrak perubahan

- Ubah tipe dokumen di `src/model.rs` dan `web/qreasee-types.d.ts` bersama. Pertahankan pembacaan dokumen lama dengan nilai default pada field baru.
- Ubah `web/line-geometry.ts`, `web/cad-export.ts`, atau `web/skp-import.ts`, lalu jalankan `npm run build:line` atau `npm run build:cad` dan commit hasil `.js` yang berubah. `npm run check:generated` membandingkan hasil build tanpa menulis berkas.
- Ubah editor pada salah satu berkas `web/studio/*.js`, jalankan `npm run build:studio`, dan commit `web/studio.js` yang dihasilkan. Jangan sunting `web/studio.js` langsung.
- Jalankan `npm run verify` sebelum push. Perintah ini memeriksa tipe browser, kesesuaian hasil build, kasus geometri, dan tes Rust. GitHub Actions menjalankan pemeriksaan yang sama pada push dan pull request.
- Tes Supabase di `scripts/test-cloud.cjs` membuat data sungguhan di proyek yang dikonfigurasi. Jalankan terpisah saat mengubah protokol kolaborasi; jangan masukkan ke pemeriksaan lokal atau CI biasa.

## Menelusuri bug

| Gejala | Mulai dari |
| --- | --- |
| Bentuk, snap, atau bidang salah | `web/line-geometry.ts`, lalu `src/topology.rs` dan `src/model.rs` |
| Orbit, seleksi, atau alat UI salah | `web/studio/viewport.js`, `web/studio/modeling.js`, dan `web/qreasee-types.d.ts` |
| Isi lembar atau skala viewport salah | `web/studio/layout.js`, validasi `SheetLayout` di `src/model.rs` |
| Dua pengguna melihat revisi berbeda | `demo/cloud.js`, RPC Supabase, lalu operasi revisi di `src/main.rs` |
| SKP/DWG gagal | `web/skp-import.ts` atau `web/cad-export.ts`, lalu build dan pemeriksaan hasil `.js` |

Langkah berikutnya adalah mengganti lingkup global bersama dengan antarmuka modul yang eksplisit dan memigrasikan berkas sumber ini ke TypeScript secara bertahap. Pertahankan satu pemilik state dokumen dan satu jalur operasi edit saat melakukannya.

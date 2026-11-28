# Peta kode Qreasee

## Alur data

1. `src/main.rs` menerima operasi dan mengirim revisi ruang. `src/model.rs` memvalidasi dokumen dan membangun mesh. `src/topology.rs` membagi garis yang berpotongan dan membentuk bidang.
2. `web/studio.js` mengelola state editor, alat interaktif, kamera, seleksi, dan Layout. Ini masih modul terbesar; perubahan di sini perlu pemeriksaan tipe dan uji alur terkait.
3. `web/line-geometry.ts` berisi geometri garis dan bidang di browser. `web/cad-export.ts` dan `web/skp-import.ts` menangani batas format CAD. Ketiganya adalah sumber; berkas `.js` senama adalah hasil build yang disimpan agar server Rust dan demo statis bisa memuatnya langsung.
4. `demo/cloud.js` dan `demo/auth-entry.js` menghubungkan editor statis ke Supabase. `demo/demo.js` menyediakan mode contoh lokal. `scripts/build-demo.cjs` menyusun berkas distribusi dari sumber web dan demo.

## Kontrak perubahan

- Ubah tipe dokumen di `src/model.rs` dan `web/qreasee-types.d.ts` bersama. Pertahankan pembacaan dokumen lama dengan nilai default pada field baru.
- Ubah `web/line-geometry.ts`, `web/cad-export.ts`, atau `web/skp-import.ts`, lalu jalankan `npm run build:line` atau `npm run build:cad` dan commit hasil `.js` yang berubah. `npm run check:generated` membandingkan hasil build tanpa menulis berkas.
- Jalankan `npm run verify` sebelum push. Perintah ini memeriksa tipe browser, kesesuaian hasil build, kasus geometri, dan tes Rust. GitHub Actions menjalankan pemeriksaan yang sama pada push dan pull request.
- Tes Supabase di `scripts/test-cloud.cjs` membuat data sungguhan di proyek yang dikonfigurasi. Jalankan terpisah saat mengubah protokol kolaborasi; jangan masukkan ke pemeriksaan lokal atau CI biasa.

## Menelusuri bug

| Gejala | Mulai dari |
| --- | --- |
| Bentuk, snap, atau bidang salah | `web/line-geometry.ts`, lalu `src/topology.rs` dan `src/model.rs` |
| Orbit, seleksi, atau alat UI salah | `web/studio.js` dan `web/qreasee-types.d.ts` |
| Isi lembar atau skala viewport salah | Bagian Layout di `web/studio.js`, validasi `SheetLayout` di `src/model.rs` |
| Dua pengguna melihat revisi berbeda | `demo/cloud.js`, RPC Supabase, lalu operasi revisi di `src/main.rs` |
| SKP/DWG gagal | `web/skp-import.ts` atau `web/cad-export.ts`, lalu build dan pemeriksaan hasil `.js` |

`web/studio.js` masih memadukan beberapa tanggung jawab. Pemisahan selanjutnya harus mengikuti batas state dan operasi yang jelas, dimulai dari Layout, tanpa menggandakan state dokumen atau jalur penyimpanan.

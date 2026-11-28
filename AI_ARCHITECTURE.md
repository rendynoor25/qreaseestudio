# Rancangan AI untuk Qreasee

AI menerjemahkan maksud desain menjadi **perintah model yang terstruktur**, bukan menulis mesh, JavaScript, atau dokumen proyek secara langsung. Contoh: `create_wall`, `create_opening`, `move_object`, `set_material`, dan `create_sheet_view`, masing-masing dengan ID, koordinat, satuan, serta parameter yang jelas.

Alur yang disarankan:

1. UI TypeScript mengirim permintaan pengguna dan ringkasan model yang relevan ke endpoint AI di server. Kunci penyedia tidak disimpan di browser.
2. Adaptor penyedia memanggil OpenAI atau Anthropic dan meminta daftar perintah sesuai skema berversi. Penyedia dapat diganti tanpa mengubah editor atau format dokumen.
3. Server memvalidasi skema, izin pengguna, batas jumlah objek, satuan, geometri, dan revisi proyek. Rust tetap menjadi otoritas untuk operasi model; hasil AI melewati jalur edit yang sama dengan alat manual.
4. UI menampilkan pratinjau perubahan dan alasan singkatnya. Setelah pengguna menerapkan, operasi dikirim sebagai satu transaksi dengan undo/redo dan sinkronisasi kolaborasi. Konflik revisi diminta untuk dihitung ulang dari keadaan terbaru.

Simpan perintah semantik dan versi skema dalam riwayat agar hasil dapat diperiksa dan diulang. Uji perintah deterministik tanpa API AI; uji penyedia secara terpisah. Jangan bergantung pada gambar layar atau klik otomatis untuk membuat geometri presisi.

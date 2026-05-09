# PBP.ID — Proyek Bagus Pemerintah

> **Katalog data publik untuk membantu masyarakat melihat proyek pemerintah, angka anggaran, vendor, dan relasinya dengan lebih mudah.**

PBP.ID adalah katalog berbasis sumber terbuka (OSINT) yang memetakan data publik
proyek strategis nasional — mulai dari kontrak pengadaan, yayasan mitra, sampai
relasi antar entitas — supaya data yang tersebar di AHU, LPSE, SiRUP, dan arsip
berita bisa dibaca berdampingan.

Situs ini bersifat informatif, bukan tuduhan atau putusan hukum. Semua
kesimpulan hukum tetap kewenangan lembaga yang berwenang.

---

## Fitur

- **Graf Relasi Interaktif** — pemetaan hubungan antar aktor (pejabat, pengusaha),
  perusahaan, yayasan, dan proyek menggunakan Cytoscape.js.
- **Catatan Proyek (Dossier)** — halaman editorial per topik (BGN–Peruri,
  Koperasi Merah Putih, motor MBG, dst.) dengan kronologi, angka kunci, dan
  sumber yang bisa diklik.
- **Direktori SPPG** — katalog 27.000+ unit Satuan Pelayanan Gizi dengan peta
  sebaran dan status sertifikasi.
- **Pencarian Entitas** — cari nama individu atau organisasi lintas dataset.
- **Ekspor Data Terbuka** — dataset tersedia dalam JSON dan CSV di
  `/exports/pbp_sppg_data.{json,csv}`.

## Topik yang Dicatat

1. **MBG (Makan Bergizi Gratis)** — anggaran besar, jejaring yayasan mitra,
   dan jalur pengadaan logistik.
2. **BGN (Badan Gizi Nasional)** — kontrak Sistem Informasi Gizi Rp 600 M,
   pengadaan tablet, sikat & semir sepatu.
3. **KMP (Koperasi Merah Putih)** — rencana konstruksi 80.000+ gerai senilai
   Rp 128 T dan ekosistem PT Agrinas.

## Arsitektur

### Frontend (`/frontend`)

- Next.js 16 (App Router, static export) + React 19
- Cytoscape.js untuk graf, React Leaflet untuk peta
- Tailwind v4 + CSS variables (mode gelap/terang)
- Target deploy: Cloudflare Pages

### ETL (`/etl`)

- Python scraper (Playwright, Beautiful Soup) untuk AHU Online, LPSE, portal
  berita
- NER dengan Gemini 2.0 Flash untuk dokumen teks panjang
- Data disimpan sebagai flat JSON di `frontend/public/data/` untuk kemudahan
  akses statis

## Sumber

Analisis di situs ini berbasis dokumen publik resmi (AHU Online, LPSE, SiRUP,
arsip berita nasional) dan disajikan apa adanya untuk tujuan edukasi dan
transparansi publik.

© 2026 PBP.ID — *Data publik untuk masyarakat.*

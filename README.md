# PBP.ID — Data Publik Proyek Pemerintah

> **"Data publik, tersaji agar bisa diperiksa ulang."**

PBP.ID adalah katalog data publik yang memetakan entitas (pejabat, perusahaan, yayasan), relasi kepemilikan/pengurus, dan potensi konflik kepentingan di sekitar proyek strategis pemerintah Indonesia. Seluruh data disusun dari sumber terbuka: AHU Online, LPSE, SiRUP, laporan berita arus utama, dan dokumen resmi lembaga.

Situs ini bersifat informatif, bukan tuduhan atau putusan hukum.

---

## Fitur

- **Graf relasi**: visualisasi interaktif hubungan antar aktor, perusahaan, dan yayasan (Cytoscape.js).
- **Catatan proyek (dossier)**: ringkasan kasus per proyek strategis dengan sumber tertaut.
- **Direktori SPPG**: peta sebaran Satuan Pelayanan Pemenuhan Gizi berdasarkan data resmi BGN.
- **Pencarian entitas**: pencarian cepat profil individu dan organisasi dalam dataset.
- **Ekspor data publik**: seluruh dataset tersedia dalam JSON/CSV.

## Fokus Investigasi Saat Ini

1. **Program MBG** — anggaran, mitra yayasan, dan pola pengadaan di Badan Gizi Nasional.
2. **Pengadaan BGN** — paket-paket anomali pada sistem E-Purchasing dan penunjukan langsung.
3. **Koperasi Merah Putih** — struktur kepemilikan, penugasan konstruksi, dan rantai pasok.

## Arsitektur

### Frontend
- Next.js 15+ (App Router, static export).
- Cytoscape.js untuk graf, React Leaflet untuk peta SPPG.
- Tailwind CSS dengan dukungan dark/light mode.
- Dioptimalkan untuk deployment di Cloudflare Pages.

### ETL & Data
- Python (Playwright, Beautiful Soup) untuk scraper AHU Online, LPSE, dan portal berita.
- Flat JSON di `frontend/public/data/` sebagai single source untuk aplikasi web.
- Case studies tervalidasi ada di `frontend/public/data/case_study_*.json`.

## Struktur Direktori

```text
├── frontend/         # Aplikasi web Next.js
│   ├── app/          # Routes (Beranda, Graf, Cari, Dossier, SPPG, Tentang)
│   ├── components/   # UI components
│   ├── lib/          # Data loaders, konstanta, utilitas graf
│   └── public/
│       ├── data/     # Dataset statis untuk web (single source)
│       └── exports/  # Ekspor publik (CSV/JSON)
├── etl/              # Skrip pemrosesan data & deteksi konflik
├── scrapers/         # Crawler AHU, LPSE, berita, BGN
├── data/             # Cache raw/processed lokal
└── docs/             # Metodologi dan catatan riset
```

## Instalasi

Prasyarat: Node.js 20+, Python 3.10+.

```bash
# Frontend
cd frontend
npm install
npm run dev

# ETL (jalankan skrip yang dibutuhkan saja)
python etl/conflict_detector_v2.py
```

## Deployment (Cloudflare Pages)

1. Hubungkan repositori ke Cloudflare Pages.
2. Root Directory: `frontend`.
3. Build Command: `npm run build`.
4. Output Directory: `out` (static export).

## Metodologi

Data disusun dari dokumen publik resmi. Tiap entitas/relasi diusahakan disertai tautan sumber. Situs ini adalah alat bantu untuk melihat pola yang perlu diperiksa, bukan putusan hukum.

---

© 2026 PBP.ID — *Data publik untuk akuntabilitas publik.*

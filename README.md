# PBP.ID — Proyek Bagus Pemerintah

> Katalog proyek pemerintah Indonesia yang anggarannya besar, vendornya unik, dan dokumennya sudah tersedia di ruang publik.

**PBP.ID bukan investigasi.** Situs ini hanya mengumpulkan data yang memang sudah publik — dari AHU Online, LPSE, SiRUP, rilis resmi lembaga, dan arsip berita — lalu menaruhnya di satu tempat supaya bisa dibaca tanpa harus buka lima tab sekaligus.

Kalau datanya terlihat aneh, itu bukan narasi kami. Itu datanya yang aneh.

---

## Apa yang ada di sini

- **Katalog entri**: rangkuman per-proyek (anggaran, vendor, tanggal kunci, relasi, sumber).
- **Peta relasi**: visualisasi antar entitas (pejabat, perusahaan, yayasan) dengan Cytoscape.js.
- **Peta SPPG**: sebaran 27.000+ titik Satuan Pelayanan Pemenuhan Gizi.
- **Pencarian entitas**: pencarian cepat profil individu dan organisasi.
- **Ekspor publik**: seluruh dataset dalam JSON/CSV.

## Apa yang TIDAK ada

- Analisis, opini, atau kesimpulan.
- Wawancara narasumber atau laporan jurnalistik.
- Tuduhan, putusan, atau penilaian hukum.

## Fokus saat ini

1. **MBG** (Makan Bergizi Gratis)
2. **BGN** (Badan Gizi Nasional)
3. **KMP** (Koperasi Merah Putih)

## Arsitektur

### Frontend
- Next.js 15+ (App Router, static export).
- Cytoscape.js untuk graf, React Leaflet untuk peta.
- Tailwind CSS + dark/light mode.
- Deploy di Cloudflare Pages.

### ETL & Data
- Python (Playwright, Beautiful Soup) untuk scraper AHU, LPSE, berita.
- Flat JSON di `frontend/public/data/` sebagai single source.
- Entri tervalidasi di `frontend/public/data/case_study_*.json`.

## Struktur

```text
├── frontend/         # Aplikasi web Next.js
│   ├── app/          # Routes (Beranda, Graf, Cari, Dossier, SPPG, Tentang, Kontak)
│   ├── components/   # UI components
│   ├── lib/          # Data loaders, konstanta, utilitas graf
│   ├── scripts/      # Build-time scripts (OG image generator)
│   └── public/
│       ├── data/     # Dataset statis
│       └── exports/  # Ekspor publik (CSV/JSON)
├── etl/              # Pemrosesan data
├── scrapers/         # Crawler AHU, LPSE, berita, BGN
├── scripts/          # Audit sources, slim data
├── data/             # Cache raw/processed
└── docs/             # Metodologi dan catatan riset
```

## Instalasi

Prasyarat: Node.js 20+, Python 3.10+.

```bash
cd frontend
npm install
npm run dev
```

## Kontribusi

Semua kode dan data terbuka. Kalau data kami salah, laporkan lewat GitHub issue — perbaikan dicatat di riwayat commit.

## Deployment (Cloudflare Pages)

1. Hubungkan repositori ke Cloudflare Pages.
2. Root Directory: `frontend`.
3. Build Command: `git lfs pull && npm run build`.
4. Output Directory: `out`.

`npm run build` otomatis menjalankan `scripts/check-lfs.mjs` untuk memastikan LFS blob sudah ter-resolve, lalu `scripts/generate-og.mjs` untuk generate OG PNG per entri.

## Metodologi

Data disusun dari dokumen publik resmi. Tiap entitas dan relasi disertai tautan sumber. Situs ini adalah alat bantu melihat pola, bukan alat penilaian. Kesimpulan hukum adalah kewenangan lembaga yang berwenang.

---

© 2026 PBP.ID

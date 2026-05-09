# PBP.ID — Data Publik Proyek Pemerintah

> **"Data proyek pemerintah yang perlu dilihat lebih dekat."**

PBP.ID adalah katalog data publik yang mengumpulkan informasi soal proyek pemerintah — angka anggaran, vendor, sumber dokumen, dan relasi antar entitas — supaya data yang tersebar bisa lebih mudah dibaca dan diperiksa ulang.

---

## Fitur

- **Graf relasi interaktif** (Cytoscape.js) antar individu, organisasi, proyek, dan kasus hukum yang muncul di dokumen publik.
- **Catatan proyek (dossier)**: rangkuman naratif per tema dengan tautan ke entitas dan dokumen sumber.
- **Direktori SPPG**: peta sebaran ~27.000 unit Satuan Pelayanan Gizi.
- **Pencarian entitas**: cari individu/organisasi cepat.
- **Ekspor data**: JSON & CSV, supaya bisa dibandingkan dengan dataset lain.

## Ruang Lingkup Catatan Saat Ini

1. **MBG (Makan Bergizi Gratis)** — dokumentasi anggaran, yayasan mitra, dan kontrak pengadaan terkait.
2. **BGN (Badan Gizi Nasional)** — pengadaan tablet, motor listrik, dan sistem informasi gizi.
3. **KMP (Koperasi Merah Putih)** — rencana konstruksi gerai dan ekosistem vendor yang dominan di tender.

Data disusun sebagai catatan dari dokumen publik — bukan kesimpulan hukum.

## Arsitektur Teknis

### Frontend
- **Framework**: Next.js 15+ (App Router, Server Components)
- **Visualisasi**: Cytoscape.js (graf), React Leaflet (peta)
- **Styling**: Tailwind CSS + CSS Variables (Dark/Light)
- **Deploy target**: Cloudflare Pages (static export)

### ETL & Data
- **Scrapers**: Python (Playwright, BeautifulSoup) untuk AHU Online, LPSE, portal berita
- **NER**: Gemini 2.0 Flash untuk ekstraksi entitas dari teks dokumen
- **Storage**: Flat JSON — gampang dibaca, gampang di-diff

## Struktur Direktori

```text
├── frontend/             Aplikasi Next.js
│   ├── app/              Routes & pages
│   ├── components/       UI components
│   ├── lib/              Data loaders, dossier registry, graph utils
│   └── public/data/      Dataset JSON statis
├── etl/                  Skrip pemrosesan data
├── scrapers/             Bot crawler
├── data/                 Data mentah & hasil proses
└── docs/                 Metodologi & recon lapangan
```

## Pengembangan

### Prasyarat
- Node.js 20+
- Python 3.10+

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### ETL
```bash
python etl/conflict_detector_v2.py
```

## Deploy (Cloudflare Pages)

1. Hubungkan repo ke Cloudflare Pages.
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `.next`

## Metodologi & Disclaimer

Analisis di sini berbasis dokumen publik (AHU Online, LPSE, SiRUP, berita nasional). Data disajikan apa adanya untuk transparansi dan pemeriksaan publik. **PBP.ID tidak menyampaikan tuduhan hukum** — kesimpulan hukum adalah wewenang lembaga yang berwenang. Jika ada data yang keliru atau perlu dikoreksi, buka issue atau kirim PR.

---
© 2026 PBP.ID — *Open data untuk pemeriksaan publik.*

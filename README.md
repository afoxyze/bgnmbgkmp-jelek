# KONEKSI.ID — Platform Investigasi Bisnis-Politik Indonesia

> **"Menyingkap Jaringan di Balik Kebijakan."**

KONEKSI.ID adalah platform investigasi berbasis sumber terbuka (OSINT) yang memetakan aliansi bisnis-politik, konsentrasi kepemilikan saham, dan potensi konflik kepentingan dalam proyek strategis nasional di Indonesia.

---

## 🚀 Fitur Utama

- **Visualisasi Graf Relasi**: Pemetaan interaktif hubungan antar aktor (pejabat, pengusaha), perusahaan, dan yayasan menggunakan *Cytoscape.js*.
- **Conflict of Interest Engine**: Deteksi otomatis "Red Flags" berdasarkan tumpang tindih kepengurusan, rekam jejak hukum, dan afiliasi partai politik.
- **Direktori Nasional SPPG**: Peta sebaran dan database 27.000+ unit Satuan Pelayanan Gizi (SPPG) di seluruh Indonesia.
- **Pencarian Entitas**: Modul pencarian cepat untuk memverifikasi profil individu atau organisasi dalam ekosistem proyek pemerintah.
- **Open Data Portal**: Seluruh temuan tersedia dalam format JSON/CSV untuk mendukung jurnalisme data dan pengawasan publik.

## 🕵️ Pusat Investigasi Aktif

1.  **MBG (Makan Bergizi Gratis)**: Investigasi anggaran Rp335T, gugatan Dana Pendidikan di MK, dan patronase politik 28 yayasan mitra.
2.  **BGN (Badan Gizi Nasional)**: Analisis anomali pengadaan alat IT (Tablet Samsung) dan logistik (Motor Listrik) melalui sistem E-Purchasing.
3.  **KMP (Koperasi Merah Putih)**: Pemetaan gurita monopoli infrastruktur desa senilai Rp128T+ yang dikendalikan melalui jejaring PT Agrinas.

## 🛠️ Arsitektur Teknis

### Frontend (Aplikasi Web)
- **Framework**: Next.js 15+ (App Router, Server Components).
- **Visualisasi**: 
  - **Graf**: Cytoscape.js dengan *layout* kustom.
  - **Peta**: React Leaflet untuk pemetaan geografis SPPG.
- **Styling**: Tailwind CSS & CSS Variables (Dark/Light Mode).
- **Deployment**: Dioptimalkan untuk **Cloudflare Pages**.

### ETL & Data (Backend)
- **Scrapers**: Python (Playwright, Beautiful Soup) untuk ekstraksi data AHU Online, LPSE, dan Portal Berita.
- **AI Engine**: Gemini 2.0 Flash untuk *Named Entity Recognition* (NER) dan analisis dokumen hukum.
- **Data Storage**: Flat JSON files (Static Data) untuk performa maksimal dan kemudahan aksesibilitas.

## 📂 Struktur Direktori

```text
├── frontend/             # Aplikasi web Next.js
│   ├── app/              # Routes & Pages (Hero, Graf, Cari, Tentang)
│   ├── components/       # UI Components (GraphExplorer, InteractiveMap, dll)
│   ├── lib/              # Data loaders & Graph utilities
│   └── public/data/      # Database JSON statis untuk web
├── etl/                  # Skrip pemrosesan data & deteksi konflik
├── scrapers/             # Koleksi bot crawler (AHU, News, BGN)
├── data/                 # Penyimpanan data lokal (Raw & Processed)
└── docs/                 # Dokumentasi metodologi & riset lapangan
```

## ⚙️ Pengembangan & Instalasi

### Prasyarat
- Node.js 20+
- Python 3.10+

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### Setup Scrapers/ETL
```bash
pip install -r requirements.txt  # Jika ada
# atau jalankan skrip spesifik
python etl/conflict_detector_v2.py
```

## 🌐 Deployment (Cloudflare Pages)

Proyek ini dirancang untuk dijalankan sebagai aplikasi statis di Cloudflare Pages:
1.  Hubungkan repositori GitHub ke Cloudflare Pages.
2.  Set **Root Directory** ke `frontend`.
3.  Set **Build Command** ke `npm run build`.
4.  Set **Output Directory** ke `.next`.

---

## ⚖️ Metodologi & Disclaimer

Analisis dalam platform ini berbasis sepenuhnya pada dokumen publik resmi (AHU Online, LPSE, SiRUP, Berita Nasional). Data disajikan "sebagaimana adanya" untuk tujuan edukasi dan transparansi publik. KONEKSI.ID **bukan merupakan tuduhan hukum** melainkan alat bantu pemetaan fakta dokumen.

---
© 2026 KONEKSI.ID — *Open Intelligence for Public Accountability.*

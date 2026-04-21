# Recon: BGN (Badan Gizi Nasional) — Target Utama MBG

**Tanggal recon:** 2026-04-08
**Dikerjakan oleh:** Claude (WebSearch + WebFetch + Playwright)

---

## Temuan Kritis: MBG Bukan Tender Kompetitif

Program Makan Bergizi Gratis (MBG) **tidak** dilelang melalui LPSE tender biasa.
BGN pakai **penunjukan langsung (direct appointment)** untuk paket-paket besar.

Ini melanggar Perpres No. 12/2021 yang mensyaratkan kondisi khusus untuk penunjukan langsung.
Sudah dilaporkan IDN Times sebagai "kejanggalan".

---

## Paket Mencurigakan (Rp1.3 Triliun, Penunjukan Langsung)

| Paket | Nilai | Metode |
|---|---|---|
| Pemenuhan Infrastruktur TIK (5.000 lokasi MBG) | Rp665 miliar | Penunjukan Langsung ⚠️ |
| Sistem Informasi Pemenuhan Gizi Nasional | Rp600 miliar | Penunjukan Langsung ⚠️ |
| Penyediaan Jasa Akomodasi/Sosialisasi | Rp18,2 miliar | Penunjukan Langsung ⚠️ |
| Penyelenggaraan Rekomendasi Kebijakan | Rp10 miliar | Penunjukan Langsung ⚠️ |

Sumber: [IDN Times, April 2026](https://www.idntimes.com/news/indonesia/ada-kejanggalan-pengadaan-barang-mbg-bgn-tabrak-aturan-00-w8cq5-9f89kw)

**Update 2026-04-08 — 1 perusahaan teridentifikasi:**

| Paket | Nilai | Pemenang |
|---|---|---|
| Infrastruktur TIK (5.000 lokasi SPPG) | Rp665 miliar | ❓ Belum diumumkan |
| Sistem Informasi Pemenuhan Gizi Nasional | Rp600 miliar | **PT Peruri** ✅ |
| Jasa Akomodasi/Sosialisasi | Rp18,2 miliar | ❓ Belum diumumkan |
| Rekomendasi Kebijakan | Rp10 miliar | ❓ Belum diumumkan |

Sumber PT Peruri: [Bisnis.com, Des 2025](https://teknologi.bisnis.com/read/20251216/101/1937147/bgn-bangun-sistem-informasi-rp600-miliar-penunjukan-langsung-ke-peruri)

---

## Struktur Program MBG

```
BGN (Badan Gizi Nasional)
├── Budget: Rp71 triliun (APBN 2025)
├── Target: 19,47 juta penerima
├── Mulai: 6 Januari 2025
│
├── SPPG (Satuan Pelayanan Pemenuhan Gizi)
│   ├── Unit lokal yang operasikan dapur MBG
│   ├── Bisa PT, CV, koperasi, atau perorangan
│   └── Ini adalah "vendor" yang menarik untuk diinvestigasi
│
└── Vendor/Supplier
    ├── E-Katalog LKPP (untuk bahan pangan)
    └── Penunjukan Langsung (untuk ICT, sistem informasi)
```

---

## Data yang Tersedia (dan Di Mana)

| Data | Platform | Status Akses |
|---|---|---|
| Paket penunjukan langsung BGN | SiRUP LKPP (`sirup.lkpp.go.id`) | ⚠️ DNS tidak resolve dari mesin ini |
| Rekap pengadaan BGN | `sirup.lkpp.go.id/sirup/rekap/penyedia/L112` | ⚠️ DNS issue |
| Pengumuman pengadaan BGN | `bgn.go.id/news/pengumuman` | ✅ Accessible via Playwright |
| Daftar SPPG operator | BGN website (belum ditemukan halaman khususnya) | ❓ Perlu eksplorasi |
| Vendor e-katalog MBG | LKPP e-katalog | ❓ Belum dicek |

---

## SiRUP LKPP — Platform Kunci yang Belum Bisa Diakses

- **URL:** https://sirup.lkpp.go.id/sirup/caripaketctr/index
- **Isi:** Rencana Umum Pengadaan semua K/L, termasuk BGN
- **Alternatif URL:** https://sirup-preproduction.eproc.dev (ada data update 7 April 2026)
- **Problem:** `sirup.lkpp.go.id` tidak resolve via DNS dari mesin ini
- **Fix:** Coba akses dari browser langsung, atau cek apakah bisa via VPN/proxy

---

## Pejabat BGN Terlibat

| Nama | Jabatan | Catatan |
|---|---|---|
| Dr. Ir. Dadan Hindayana | Kepala BGN | Mengakui 4 paket masih tahap perencanaan di SiRUP |
| Dedi Kuswandi | PPK Awal (diganti) | Diangkat 24 Jan 2025, asal Kemendag, tidak punya sertifikasi PPK |
| Dohardo Pakpahan | PPK Pengganti | Diangkat 19 Feb 2025, asal KPU, diganti < 1 bulan |

Sumber: [IDN Times — PPK Diganti < 1 Bulan](https://www.idntimes.com/news/indonesia/dugaan-kejanggalan-pengadaan-di-bgn-ppk-diganti-kurang-dari-sebulan-00-w8cq5-81klhh)

---

## Pertanyaan Investigasi yang Harus Dijawab

1. **Siapa perusahaan yang dapat Rp665M kontrak ICT?** → Belum diumumkan, pantau SiRUP
2. **PT Peruri (pemenang Rp600M) — siapa direksinya? Ada koneksi ke Dadan Hindayana?** → Cek AHU
3. **Kenapa PPK Dedi Kuswandi diganti < 1 bulan?** → Ada konflik kepentingan?
4. **Dohardo Pakpahan (pengganti PPK) — background-nya apa?** → Cross-reference berita
5. **Siapa yang jadi operator SPPG?** → BGN website + AHU

---

## Next Step

1. **Buka `sirup.lkpp.go.id` dari browser** — cari semua paket BGN 2025, catat nama perusahaan
2. **Buka `bgn.go.id`** — cari halaman daftar SPPG
3. **Lookup perusahaan pemenang di AHU** — catat direksi, pemegang saham
4. **Google nama direksi** — cari koneksi politik

---

## Catatan Teknis

- BGN tidak punya LPSE sendiri di inaproc
- Playwright bisa akses `bgn.go.id` (200 OK dengan proper UA)
- DNS issues dengan `sirup.lkpp.go.id` dari mesin ini — bukan masalah blocking, kemungkinan routing

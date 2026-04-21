# Recon: Dataset yang Sudah Ada

**Tanggal recon:** 2026-04-08
**Dikerjakan oleh:** Claude (WebFetch + WebSearch)

---

## Kesimpulan Utama

**Tidak ada dataset siap pakai yang berisi nama PT pemenang + nilai kontrak di level yang kita butuhkan.** Kita tetap perlu akses ke SPSE/LPSE. Tapi ada dua opsi bagus yang menghemat banyak effort:

1. **PyProc** — Python wrapper untuk SPSE API, bisa langsung `pip install`, tidak perlu Playwright
2. **INAPROC Official API** — API resmi pemerintah, butuh registrasi tapi legal dan stabil

---

## LKPP Open Data (data.lkpp.go.id)

- **Status:** ✅ Bisa diakses, CKAN API tersedia
- **Format:** XLSX, CSV, JSON
- **Dataset:** 47 dataset, semua **aggregate/summary** — bukan transaction-level
- **Yang ada:** Indeks kinerja pengadaan, nilai transaksi per K/L, persentase UMKM, e-katalog
- **Yang tidak ada:** Nama PT pemenang, nama direksi, detail per paket tender
- **Coverage:** Mayoritas 2023
- **Kesimpulan:** ❌ **Tidak cukup untuk KONEKSI.ID** — tidak ada data winner/pemenang spesifik

---

## OpenTender.net

- **Status:** ❌ Tidak tersedia untuk Indonesia (404 di `/id`)
- **Kesimpulan:** ❌ Skip

---

## DataLPSE.com (Third-party)

- **URL:** https://www.datalpse.com
- **Status:** Paid service
- **Yang ada:** Monitor 712 portal LPSE, fitur analisa pemenang lelang
- **Harga:** Rp350.000 / 3 bulan (Personal), Rp1.2 juta / 12 bulan (Corporate)
- **API/Download:** Belum ada (coming soon — "Data Research" package)
- **Kesimpulan:** 🟡 Opsi terakhir kalau butuh data cepat tanpa effort, tapi lebih baik pakai PyProc/API resmi dulu

---

## PyProc — Python SPSE Wrapper ⭐ REKOMENDASI UTAMA

- **URL:** https://github.com/wakataw/pyproc
- **Install:** `pip install pyproc`
- **Status:** Aktif dirawat (385 commits, last release v0.1.14 Desember 2023)
- **Python:** ≥3.9
- **Data yang bisa diambil:**
  - Daftar paket tender (lelang)
  - Detail per paket
  - Pemenang tender + nilai kontrak
  - Informasi penyedia/vendor
- **Cara pakai:**
  ```python
  from pyproc import Lpse

  lpse = Lpse('kemendikbud')
  packages = lpse.get_paket_tender(start=0, length=30)
  detil = lpse.detil_paket_tender(id_paket='48658064')
  pemenang = detil.get_pemenang()
  ```
  Atau via CLI:
  ```bash
  pyproc kemendikbud --output json
  ```
- **Catatan:** Ada built-in delay (default 1s per request). Tidak butuh Playwright!
- **Kesimpulan:** ✅ **Gunakan ini untuk Phase 0 manual case study** — bisa langsung pull data Kemendikbud

---

## INAPROC Official API (data.inaproc.id) ⭐ OPSI JANGKA PANJANG

- **URL:** https://data.inaproc.id/docs
- **Status:** Official government API gateway
- **Data:** Akses ke semua sistem pengadaan pemerintah Indonesia
- **Autentikasi:** Perlu registrasi di https://akun.inaproc.id/ → verifikasi identitas → dapat API token
- **Proses:** 3 tahap (registrasi → verifikasi profil → verifikasi akses oleh INAPROC verifikator)
- **Biaya:** Tidak disebutkan (kemungkinan gratis untuk peneliti)
- **Kesimpulan:** ✅ **Daftar sekarang** — proses verifikasi butuh waktu, lebih baik mulai awal. Kalau dapat akses, ini paling legal dan stabil jangka panjang.

---

## ICW (Indonesia Corruption Watch)

- **Status:** Belum dihubungi
- **TODO:** Hubungi via https://antikorupsi.org untuk tanya dataset korupsi/pengadaan

---

## Action Items (Prioritas)

1. **SEKARANG:** Test `pyproc` dengan kode `kemendikbud` — verifikasi bisa fetch data tender MBG
2. **SEKARANG:** Daftar akun di https://akun.inaproc.id/ — proses verifikasi mungkin lama
3. **NANTI:** Hubungi ICW untuk dataset tambahan
4. **SKIP:** LKPP Open Data, OpenTender.net

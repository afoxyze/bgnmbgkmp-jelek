# Recon: LPSE / INAPROC / SPSE

**Tanggal recon:** 2026-04-08
**Dikerjakan oleh:** Claude (WebFetch + WebSearch)

---

## Temuan

- **Butuh login?** Tidak (data publik bisa diakses tanpa login)
- **Butuh captcha?** Tidak (SPSE menggunakan JSON API)
- **JavaScript-heavy?** Ya — tapi ada JSON API yang bisa di-hit langsung
- **Format response:** JSON (via SPSE API endpoints)
- **Rate limit:** Tidak terdokumentasi, gunakan delay minimal 1 detik antar request
- **URL utama:** https://spse.inaproc.id/{kode_kementerian}/lelang
- **URL Kemendikbud:** https://spse.inaproc.id/kemendikbud/lelang

---

## Temuan Kritis: Sudah Ada Python Wrapper

**Tidak perlu build scraper dari scratch.** Ada library `pyproc` yang sudah wrap semua SPSE API:

```bash
pip install pyproc
```

```python
from pyproc import Lpse

lpse = Lpse('kemendikbud')
packages = lpse.get_paket_tender(start=0, length=30)
detil = lpse.detil_paket_tender(id_paket='PAKET_ID')
pemenang = detil.get_pemenang()
```

CLI:
```bash
pyproc kemendikbud --output json
```

**GitHub:** https://github.com/wakataw/pyproc (385 commits, v0.1.14 Des 2023)

---

## Struktur URL SPSE

Pola URL untuk berbagai kementerian:
- Kemendikbud: `spse.inaproc.id/kemendikbud`
- Kemenkeu: `spse.inaproc.id/kemenkeu`
- PUPR: `spse.inaproc.id/pu`
- Kemendagri: `spse.inaproc.id/kemendagri`

---

## Data yang Tersedia

Berdasarkan kapabilitas PyProc:
- ✅ Daftar paket tender dengan filter tahun
- ✅ Detail per paket (nama, nilai HPS, metode pengadaan)
- ✅ Pemenang tender (nama PT, nilai penawaran, nilai kontrak)
- ✅ Informasi vendor/penyedia
- ❓ Perlu verifikasi: apakah ada data MBG spesifik atau hanya kode satker

---

## Next Step

1. Test `pyproc` dengan:
   ```bash
   pip install pyproc
   pyproc kemendikbud --output json 2024
   ```
2. Filter hasil untuk keyword "makan bergizi" atau "MBG"
3. Catat struktur JSON yang dihasilkan — fields apa yang ada
4. Simpan sample output di `data/manual/sample_lpse_kemendikbud.json`

---

## Fallback jika PyProc Tidak Berhasil

- Adaptasi scraper dari: https://github.com/yfktn/spse-scraper
- Manual download dari portal LPSE Kemendikbud
- Gunakan INAPROC Official API (butuh registrasi dulu)

---

## Catatan

- WebFetch langsung ke `spse.inaproc.id` blocked (403) — dikonfirmasi butuh JS execution
- PyProc hits JSON API endpoints langsung, tidak perlu render HTML
- Verifikasi apakah library masih kompatibel dengan struktur SPSE April 2026 sebelum commit

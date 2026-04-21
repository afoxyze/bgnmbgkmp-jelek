# Recon: AHU Online (Kemenkumham)

**Tanggal recon:** 2026-04-08
**Dikerjakan oleh:** Claude (WebFetch)

---

## Temuan

- **URL utama:** https://ahu.go.id
- **Butuh login?** Sebagian — ada "AHU Unduh Data" yang mungkin butuh login
- **Butuh captcha?** Kemungkinan ya (JS obfuscated, perlu verifikasi manual)
- **JavaScript-heavy?** Ya — sangat heavily obfuscated JS, bukan static HTML
- **Format response:** Tidak diketahui pasti (perlu eksplorasi manual)
- **Services yang relevan:** "AHU Unduh Data" untuk pencarian profil PT

---

## Data yang Tersedia (Estimasi)

Berdasarkan layanan yang ditawarkan di portal:
- ✅ Registrasi PT / CV (data resmi yang pasti ada)
- ✅ Direksi dan komisaris PT
- ✅ Pemegang saham (RUPS)
- ✅ Beneficial ownership tracking
- ❓ Apakah bisa diakses tanpa login?
- ❓ Format response (HTML tabel vs JSON)

---

## Status: Perlu Eksplorasi Manual

Recon ini belum lengkap. WebFetch tidak bisa render JS-heavy site ini.

**Yang harus dilakukan manual:**
1. Buka https://ahu.go.id
2. Cari "AHU Unduh Data" atau menu pencarian PT
3. Coba lookup 1 PT pemenang tender dari data LPSE
4. Catat:
   - Apakah butuh login?
   - Ada captcha di mana?
   - Field apa yang muncul untuk 1 PT?
   - URL setelah lookup (bisa di-scrape?)
5. Screenshot setiap langkah → simpan di folder ini

---

## Pendekatan Scraping (Rencana)

Karena JS-heavy:
- **Tool:** Playwright (Python)
- **Captcha:** 2captcha service (~$3/1000 captcha)
- **Fallback:** Manual batch lookup untuk PT yang paling penting

---

## Catatan

- AHU adalah sumber terpercaya (confidence 1.0 per framework di plan.md)
- Data AHU dependency dari data LPSE: kita butuh nama PT dulu, baru bisa lookup AHU
- Prioritas scraper: LPSE dulu → baru AHU

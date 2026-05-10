# PBP.ID — Catatan Pengembangan

> Internal. Bukan copy publik.

## Identitas

**PBP** = **Proyek Bagus Pemerintah**.

Nada: sarkasme deadpan. Jangan meledak. Di UI, kita berpose sebagai arsiparis netral yang hanya "mengumpulkan data yang sudah publik". Sarkasmenya muncul dari kontras antara nama dan isinya, bukan dari kata-kata menuduh.

## Prinsip Copy

- **Katalog**, bukan investigasi.
- **Entri**, bukan catatan atau dossier.
- **Sorotan**, bukan red flag atau "perlu dicek".
- **Mengumpulkan / tercatat / terdaftar**, bukan "membongkar / menyingkap / mengungkap".
- **Tidak ada** analisis, opini, tuduhan, kesimpulan. Hanya fakta dari dokumen publik.
- Kalau datanya aneh, itu bukan narasi kami — itu datanya yang aneh.

## Fokus Aktif

- **Katalog isi**: entri MBG, BGN, KMP sudah tersedia. Entri baru lewat GitHub issue.
- **Frontend UX**: sudah cukup rapi untuk launch. Polish lanjut per feedback real user.
- **Data freshness**: update per bulan atau ketika ada proyek baru yang viral.

## Fokus Saat Ini

- Tone konsisten di semua halaman.
- Nama "Proyek Bagus Pemerintah" harus jelas tapi tidak mencolok berlebihan.
- Sorotan (merah) hanya untuk hal yang tercatat di dokumen publik sebagai janggal, bukan penilaian kami.

## Catatan Teknis

- Dataset besar (all_sppg_locations 19 MB, sppg_points 10 MB) masih di git. Tunggu jadi masalah nyata sebelum migrasi LFS.
- OG PNG generated di prebuild script. Update `frontend/scripts/generate-og.mjs` kalau dossier registry berubah.
- Audit source coverage: `python scripts/audit_sources.py` (exit 1 kalau ada red flag/entitas tanpa sumber).

## Yang Perlu Diperhatikan Sebelum Tambah Entri

1. Tiap entitas harus punya `sumber[]` (non-placeholder URL).
2. Tiap red flag harus punya `sumber[]`.
3. Sumber harus tautan publik yang bisa diverifikasi pihak ketiga.
4. Tidak ada narasi analitis — deskripsi harus mencatat fakta, bukan menarik kesimpulan.

## Riwayat Ringkas

- Reboot dari KONEKSI.ID ke PBP.ID (sarkastik).
- Konsolidasi frontend ke repo utama.
- Migrasi ke static export untuk Cloudflare Pages.
- Penambahan dossier route, share buttons, URL state, a11y, security headers, OG per-dossier.
- Reframing tone dari "investigasi" ke "katalog / arsip / dikumpulkan".

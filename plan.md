# PBP.ID — Catatan Pengembangan

> Catatan kerja internal. Bukan rilis resmi, bukan narasi konsumsi publik.

## Status Saat Ini

Proyek fase operasional. Frontend di-deploy sebagai static export ke Cloudflare Pages. Dataset inti SPPG sudah lengkap per batch resmi BGN. Case studies utama (MBG, BGN/Peruri, Motor BGN, KMP/Agrinas, Yayasan SPPG) tersedia di `frontend/public/data/`.

## Fokus Aktif

- **Frontend UX** — penyempurnaan interaksi graf, panel detail, dan halaman dossier.
- **Scenario deep-linking** — parameter URL untuk membuka graf dengan fokus entitas tertentu (plumbing sudah ada di `GraphExplorer`, implementasi di `GraphViewer` belum terhubung penuh).
- **Anti-hardcode** — statistik di halaman beranda dihitung dari data, bukan literal. Fallback masih tersisa di `lib/data.ts#getLiveStats`, perlu dipindah ke file summary tersendiri.
- **Attribution** — komponen `SourceLink` dipakai di `DetailSidebar`. Perlu diperluas ke panel red flag dan dossier agar setiap klaim bisa ditelusuri.

## Yang Perlu Diperhatikan

- **Dataset besar di git** — `all_sppg_locations.json` (~19 MB) dan `sppg_points.json` (~13 MB) masih tracked. Cloudflare punya batas ukuran file, jadi sudah di-minify tapi belum dipindah ke LFS/CDN.
- **`any` di GraphViewer** — tipe Cytoscape belum disiplin. Tidak mendesak tapi bikin refactor masa depan lebih ribet.
- **Naming** — produk pakai `PBP.ID`. Pastikan tidak ada peninggalan nama lama di kode atau teks UI.

## Riwayat Ringkas

- Konsolidasi frontend ke repo utama.
- Migrasi ke static export untuk Cloudflare (menghapus route API dinamis, minify JSON besar).
- Penambahan route `/dossier/[slug]` dan komponen investigasi.
- Overhaul UI desktop/mobile (beranda, header, detail sidebar).

## Next Up

1. Hubungkan `focusNodeIds` + `useSearchParams` → auto-zoom di `GraphViewer`.
2. Pisahkan metadata SPPG ringan ke `summary.json` agar `getLiveStats` tidak stream-parse file 19 MB.
3. Wire `SourceLink` ke `RedFlagsPanel` untuk tiap red flag yang punya URL sumber.
4. Evaluasi migrasi dataset besar ke Git LFS atau CDN terpisah.

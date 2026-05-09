# PBP.ID — Project Plan

> **Platform data publik untuk memeriksa proyek pemerintah.**
> Terakhir diperbarui: 2026-05-09

---

## Status

Situs dalam kondisi **pre-launch beta** — arsitektur stabil, data mayoritas tersinkron, tapi masih ada beberapa bagian yang perlu ditutup sebelum go-public.

### Yang Sudah Jalan
- Recon & scrapers dasar (BGN, AHU, news) — selesai untuk cakupan saat ini.
- Direktori SPPG nasional (~27.066 unit terdata).
- AHU Board Mapper + deteksi konflik dasar.
- Ekspor CSV/JSON untuk dataset inti.
- Master config (`etl/master_config.py`) sebagai sumber tunggal ID.
- Frontend: halaman beranda, dossier, graf, cari, peta SPPG, tentang.
- Schema + type guards di `frontend/types/graph.ts` (strict TS).
- Dossier registry di `frontend/lib/dossier.ts`.

### Known Issues (prioritas turun)
1. **Integritas angka** — `getLiveStats()` sempat pakai fallback statis; perlu dipastikan semua angka derived dari dataset aktual.
2. **Dataset besar di-commit** — `all_sppg_locations.json` (~19 MB), `sppg_points.json` (~13 MB), dan dua file ekspor. Pilihan: LFS, atau generate saat build.
3. **Types `any` di `GraphViewer.tsx`** — perlu diganti dengan tipe dari `@types/cytoscape`.
4. **Review legal / reputasi** — klaim yang menyebut nama individu perlu URL sumber yang bisa diklik di UI sebelum publik.
5. **Styling double-track** — campuran Tailwind utility + inline `style={{}}` di beberapa file. Perlu dikonsolidasi ke utility class atau reusable `@layer`.

## Next Actions

1. Refactor `getLiveStats()` untuk baca `sppg_summary.json` penuh (ganti regex parsing 2 KB).
2. Pastikan semua `rf.sumber` di UI dirender sebagai tautan (pakai `SourceLink`).
3. Tighten tipe Cytoscape di `GraphViewer.tsx` + `GraphExplorer.tsx`.
4. Evaluasi pemindahan dataset besar ke LFS atau object storage.
5. Legal review untuk halaman dossier sebelum go-public.

---

## Changelog Ringkas

- **2026-05-09** — Cleanup: dead code dihapus (InvestigationCard, folder osint, draft case studies di `data/manual/`); naming disinkronkan ke PBP.ID; ekspor direname `koneksi_id_*` → `pbp_id_*`.
- **2026-04-12** — Scenario engine deep-linking (prop `focusNodeIds` di `GraphViewer` — implementasi dalam progress).
- **2026-04-11** — Total refactoring: master config, sinkronisasi ID global, UI stability (silent graph calibration).
- **2026-04-08** — Recon dataset existing (LKPP, PyProc, INAPROC API).

# Landing Page — Brief

> Dokumen ini buat sesi berikutnya. Bilang: "Baca plan.md dan landingpage.md, bikin landing page"

---

## Apa yang Berubah

| Sebelum | Sesudah |
|---|---|
| `/` = graph viewer | `/` = landing page |
| Ga ada route `/graf` | `/graf` = graph viewer (pindahan dari `/`) |
| Nav: Graf di `/` | Nav: Beranda `/`, Graf `/graf`, Cari `/cari`, Tentang `/tentang` |

## Yang TIDAK Berubah

- `/cari`, `/tentang`, `/entitas/[id]` — semua tetap
- Semua components graph (GraphViewer, GraphExplorer, DetailSidebar, RedFlagsPanel) — ga disentuh
- data.ts, graph-utils.ts, types, theme-context.tsx — ga disentuh

---

## Struktur Landing Page

### Section 1: Hero

- **Headline:** Punchy, bikin orang langsung ngerti. Contoh: "Siapa di Balik Proyek Pemerintahmu?"
- **Subheadline:** 1 kalimat jelasin platform ini
- **3 angka dari data asli** (tarik dari `getCaseStudy()`):
  - Total red flags
  - Total entitas terpetakan
  - Total relasi ditemukan
- **CTA button** → ke `/graf` atau scroll ke section 2

### Section 2: Featured Investigations (2 Cards)

**Card 1 — BGN-Peruri (Thread A)**
- Judul: "Kontrak Rp 1.3T Tanpa Tender Kompetitif"
- Deskripsi (hardcoded editorial, 2-3 kalimat):
  - BGN memberikan kontrak senilai Rp 1.3 triliun kepada Peruri melalui penunjukan langsung
  - Komisaris utama anak perusahaan penerima kontrak adalah pejabat aktif Kemenkes dan BPJS Kesehatan
  - Wakil direktur utama sebelumnya bekerja di procurement pemerintah — revolving door
- Stats dari data: jumlah entitas, jumlah red flags, severity badges
- CTA: "Lihat Investigasi" → `/graf`

**Card 2 — Yayasan SPPG (Thread B)**
- Judul: "Terpidana Korupsi Kelola Program MBG"
- Deskripsi (hardcoded editorial, 2-3 kalimat):
  - 28 dari 102 yayasan pengelola MBG terafiliasi partai politik
  - 3 yayasan dikelola mantan terpidana korupsi, termasuk eks-Gubernur dengan vonis 12 tahun
  - 4 anggota DPR/DPRD aktif memimpin yayasan — conflict of interest langsung dengan fungsi anggaran
- Stats dari data: jumlah entitas, jumlah red flags, severity badges
- CTA: "Lihat Investigasi" → `/graf`

### Section 3: Bottom CTA

- "Jelajahi Semua Data" → `/graf`
- "Cari Entitas" → `/cari`

---

## Skills yang WAJIB Di-invoke

Frontend-coder HARUS invoke semua ini sebelum coding:

**Design (urutan ini):**
1. `frontend-design` — dari anthropic-agent-skills. Pilih aesthetic direction SEBELUM coding. JANGAN SKIP.
2. `impeccable:frontend-design` — production-grade UI
3. `impeccable:arrange` — layout dan spacing

**Code patterns:**
4. `react-frontend-patterns`
5. `typescript-patterns`

---

## Design Direction (Belum Decided)

Biar `frontend-design` skill yang guide pilihan ini. Tapi context buat inform decision:

- **Platform:** OSINT / investigasi korupsi
- **Target user:** Publik umum Indonesia
- **Mood yang diinginkan:** Serius tapi accessible, bikin orang trust datanya
- **"Wow factor":** Angka-angka shocking + koneksi yang ga terduga
- **Harus avoid:** Generic AI look, bland cards, Inter font default, purple gradients

Opsi yang cocok (biar frontend-coder pilih salah satu):
- Editorial/Magazine — kayak artikel investigasi Tempo
- Brutalist/Raw — expose the truth feel
- Industrial/Utilitarian — dark, data-driven, intelligence agency vibe

---

## Technical Notes

- Server component — `getCaseStudy()` bisa dipake langsung buat tarik stats
- Harus work di light + dark mode (pake CSS variables yang udah ada di globals.css)
- Responsive (mobile-friendly)
- No new dependencies
- Build harus pass 0 TypeScript errors

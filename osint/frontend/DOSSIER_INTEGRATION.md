# KONEKSI.ID — Dossier Integration

Paket ini menambahkan **deep-read dossier pages** ke `bgnmbgkmp-jelek`. Tidak mengubah graph viewer, search, atau SPPG map. Hanya menambah rute baru `/dossier/[slug]` dan komponen landing opsional.

---

## File Map (semua file baru, ga ada yang diganti paksa)

```
frontend/
├── app/
│   └── dossier/
│       └── [slug]/
│           ├── page.tsx           # server component, renders dossier
│           └── not-found.tsx      # 404 untuk slug tidak terdaftar
├── components/
│   └── dossier/
│       ├── DossierHero.tsx        # headline + lede + budget callout
│       ├── KeyFactsGrid.tsx       # 4-up stat strip
│       ├── FindingsList.tsx       # numbered findings w/ entity chips
│       ├── DossierTimeline.tsx    # kronologi horizontal
│       ├── ActorGrid.tsx          # Person / Org / Project columns
│       ├── SourcesBlock.tsx       # source URLs + disclaimer
│       ├── RelatedDossiers.tsx    # "up next" block
│       └── DossierIndexCard.tsx   # optional landing-page card
└── lib/
    └── dossier.ts                 # slug registry + loader
```

## Yang TIDAK Disentuh

- `app/page.tsx` — kalau mau tambahin link ke dossier di landing, tambahin manual (contoh di bawah)
- `app/graf/**`, `app/cari/**`, `app/tentang/**`, `app/entitas/**`, `app/sppg/**`
- Semua components graph (`GraphViewer`, `GraphExplorer`, `DetailSidebar`, `RedFlagsPanel`, dll)
- `lib/data.ts`, `lib/graph-utils.ts`, `lib/constants.ts`, `lib/theme-context.tsx`
- `types/graph.ts`
- `globals.css`

## Yang WAJIB Dipastikan

1. **Header.tsx** — tambahin link dossier ke `NAV_LINKS`:
   ```ts
   { href: "/dossier/bgn-peruri", label: "DOSSIER" }, // contoh, atau buat index page
   ```
   (atau ga usah, dossier tetap bisa diakses via link dari landing / graph entitas)

2. **File JSON case_study udah ada** — loader baca dari `public/data/case_study_*.json` pakai path yang udah didaftarin di `DOSSIER_REGISTRY` (`lib/dossier.ts`).

## Nambah Dossier Baru

Edit `lib/dossier.ts`:
```ts
export const DOSSIER_REGISTRY = [
  // ... existing
  {
    slug: "nama-slug-baru",
    code: "DOSSIER 04",
    file: "case_study_xxx.json",   // harus ada di public/data/
    title: "...",
    subtitle: "...",
    lede: "...",
    severity: "ACTIVE",
    thread: "Thread D",
    categoryShort: "XXX",
    categoryLong: "...",
    anggaranFokus: "Rp ...",
    anggaranLabel: "...",
    findings: [ { tag, title, body, relatedEntityIds, relatedRedFlagIds }, ... ],
    timeline: [ { date, event, source }, ... ],
  },
];
```

`generateStaticParams` otomatis pick up slug baru.

## Optional — Tambahin Card Dossier di Landing

Di `app/page.tsx`, import + pake di `InvestigationsSection`:

```tsx
import { getDossierSummaries } from "@/lib/dossier";
import { DossierIndexCard } from "@/components/dossier/DossierIndexCard";

// dalam component:
const dossiers = getDossierSummaries();

// di JSX:
<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
  {dossiers.map((d) => <DossierIndexCard key={d.slug} dossier={d} />)}
</div>
```

## Deep-link dari Graph

`/dossier/[slug]` ada di server, aman buat di-link dari `DetailSidebar` atau `InvestigationCard`:

```tsx
<Link href={`/dossier/bgn-peruri`}>Baca dossier lengkap →</Link>
```

## Build Check

```bash
cd frontend
npm run build
```

Expected: 0 TypeScript errors. Static generation akan produce 3 halaman statis (satu per slug).

---

## Design Decisions

- **Typography** — pakai IBM Plex Serif + Mono stack yang udah ada di `layout.tsx`. Ga ada font baru.
- **Warna** — pakai CSS vars (`--accent-danger`, `--text-primary`, dll). Light + dark mode free.
- **No client JS** kecuali `SourceLink` (udah ada di project). Dossier rendering full server → fast, cacheable.
- **Responsive** — grid collapse di 640px dan 820px breakpoint.
- **Type-safe** — `DossierMeta`, `DossierFacts`, `LoadedDossier` fully typed. `isCaseStudy` guard dipake buat validasi file.

// PBP.ID — Dossier loader & slug registry
// Server-only. Loads a single case_study_*.json and enriches it with
// pre-computed facts (severity counts, people/orgs split, budget totals).

import { isCaseStudy, type CaseStudy, type Entity, type RedFlag } from "@/types/graph";

// ─── Slug registry ───────────────────────────────────────────────────────────
// Each dossier slug maps to a case_study JSON file + editorial metadata.
// Adding a new dossier = add a row here.

export interface DossierMeta {
  readonly slug: string;
  readonly code: string;           // "DOSSIER 01"
  readonly file: string;           // "case_study_bgn_peruri.json"
  readonly title: string;
  readonly subtitle: string;
  readonly lede: string;           // 1–2 sentence lead paragraph
  readonly severity: "CRITICAL" | "ACTIVE" | "VERIFIED";
  readonly thread: string;         // "Thread A — BGN & Peruri"
  readonly categoryShort: string;  // "MBG", "BGN", "KMP"
  readonly categoryLong: string;
  readonly anggaranFokus?: string; // headline budget line, e.g. "Rp 600 M"
  readonly anggaranLabel?: string;
  readonly findings: readonly DossierFinding[];
  readonly timeline: readonly DossierTimelineEvent[];
}

export interface DossierFinding {
  readonly tag: string;            // "Temuan", "Anomali", "Konflik"
  readonly title: string;
  readonly body: string;
  readonly relatedEntityIds?: readonly string[];
  readonly relatedRedFlagIds?: readonly string[];
}

export interface DossierTimelineEvent {
  readonly date: string;           // "2024-08-15" or "Aug 2024"
  readonly event: string;
  readonly source?: string;
}

export const DOSSIER_REGISTRY: readonly DossierMeta[] = [
  {
    slug: "bgn-peruri",
    code: "PROYEK 01",
    file: "case_study_bgn_peruri.json",
    title: "Sistem Informasi Gizi BGN — Rp 600 Miliar",
    subtitle: "BUMN percetakan uang memenangkan kontrak sistem informasi kesehatan, tanpa tender.",
    lede: "Badan Gizi Nasional memberi kontrak Rp 600 miliar kepada Perum Peruri — BUMN percetakan dokumen berharga — lewat penunjukan langsung. Entri ini mencatat angka, jalur pengadaan, dan entitas yang muncul di dokumen publik.",
    severity: "CRITICAL",
    thread: "Thread A — BGN & Peruri",
    categoryShort: "BGN",
    categoryLong: "Badan Gizi Nasional",
    anggaranFokus: "Rp 600 M",
    anggaranLabel: "Kontrak penunjukan langsung",
    findings: [
      {
        tag: "Pengadaan",
        title: "Peruri tercatat menerima proyek IT senilai Rp 600 miliar.",
        body: "Peruri secara historis adalah BUMN percetakan dokumen berharga. Kontrak sistem informasi kesehatan diberikan via penunjukan langsung kepada anak perusahaannya, PT Peruri Digital Security (PDS), tanpa tender kompetitif terbuka.",
        relatedEntityIds: ["org-bgn", "org-peruri", "org-pds"],
        relatedRedFlagIds: ["rf-001"],
      },
      {
        tag: "Jabatan",
        title: "Nama pejabat Kemenkes muncul di kursi komisaris PDS.",
        body: "Setiaji, Chief DTO Kementerian Kesehatan, duduk sebagai Komisaris Utama PDS — lembaga yang menerima kontrak IT dari lembaga pemerintah. Wakil Direktur Utama, Rahmat Danu Andika, sebelumnya menjabat Direktur GovTech Procurement di pemerintahan.",
        relatedEntityIds: ["person-setiaji", "person-danu-andika", "org-pds"],
      },
      {
        tag: "Pemilik Manfaat",
        title: "Satu CEO, dua perusahaan, akumulasi kontrak ~Rp 700 M.",
        body: "Shoraya Lolyta Oktaviana terdaftar sebagai pemilik manfaat dua entitas berbeda (PT IMI dan PT NSP), yang keduanya memenangkan paket pengadaan rak Koperasi Merah Putih dengan nilai kumulatif ~Rp 695 miliar.",
        relatedEntityIds: ["person-shoraya", "org-imi", "org-nsp"],
        relatedRedFlagIds: ["rf-008"],
      },
      {
        tag: "Harga",
        title: "Sikat dan semir sepatu SPPI diadakan dengan markup ~300%.",
        body: "Harga satuan di Inaproc mencapai Rp 50.000–56.000 per unit, dibandingkan harga pasar eceran Rp 18.000–19.000. Total alokasi Rp 1,57 miliar untuk 12 paket kontrak via E-Purchasing.",
        relatedEntityIds: ["proj-bgn-sikat-sepatu", "org-gajah-mitra"],
        relatedRedFlagIds: ["rf-012"],
      },
    ],
    timeline: [
      { date: "Okt 2024", event: "BGN dibentuk via Perpres No. 83/2024 sebagai Lembaga Pemerintah Non-Kementerian.", source: "Perpres 83/2024" },
      { date: "Jan 2025", event: "Anggaran BGN 2025 ditetapkan Rp 71 triliun untuk program MBG.", source: "APBN 2025" },
      { date: "Mar 2025", event: "Kontrak Sistem Informasi Gizi Rp 600 M diberikan ke Peruri via penunjukan langsung.", source: "LPSE" },
      { date: "Okt 2025", event: "Temuan anomali harga tablet Samsung Galaxy Tab Active5 (markup Rp 7,95 juta/unit).", source: "Jawa Pos, ICW" },
      { date: "Feb 2026", event: "Pengadaan sikat & semir sepatu Rp 1,57 M dengan markup 300% viral di media.", source: "Tempo, Detik" },
      { date: "Apr 2026", event: "Audit silang AHU + LPSE menampilkan dua entitas pemilik manfaat Shoraya Lolyta Oktaviana.", source: "Arsip PBP.ID" },
    ],
  },
  {
    slug: "agrinas-kmp",
    code: "PROYEK 02",
    file: "case_study_agrinas_kmp.json",
    title: "Koperasi Merah Putih — Rp 128 Triliun untuk 80.000+ Gerai",
    subtitle: "Konstruksi puluhan ribu gerai jatuh ke satu ekosistem perusahaan.",
    lede: "PT Agrinas dan jejaring terkaitnya tercatat sebagai pelaksana konstruksi puluhan ribu gerai Koperasi Merah Putih. Skalanya besar, vendornya sedikit.",
    severity: "VERIFIED",
    thread: "Thread C — Agrinas & KMP",
    categoryShort: "KMP",
    categoryLong: "Koperasi Merah Putih",
    anggaranFokus: "Rp 128 T",
    anggaranLabel: "Estimasi nilai proyek total",
    findings: [
      {
        tag: "Konsentrasi Vendor",
        title: "80.000+ gerai tercatat dilaksanakan oleh satu ekosistem.",
        body: "PT Agrinas dan jejaring entitas afiliasinya memegang kontrak konstruksi untuk lebih dari 80.000 gerai Koperasi Merah Putih. Skala ini meniadakan ruang partisipasi kontraktor lokal dan kompetisi harga terbuka.",
      },
      {
        tag: "Selisih Harga",
        title: "Selisih ~Rp 700 juta per gerai di Denpasar.",
        body: "Anggaran per unit gerai di dokumen pengadaan berbeda dari penilaian fisik lapangan. Studi kasus Denpasar mencatat selisih hingga Rp 700 juta per unit antara nilai kontrak dan nilai konstruksi riil.",
      },
      {
        tag: "Jabatan Strategis",
        title: "Menhan aktif tercatat sebagai pimpinan ex-officio YPPSDP.",
        body: "YPPSDP adalah yayasan induk ekosistem Agrinas. Menteri Pertahanan aktif menjabat sebagai pimpinan ex-officio yayasan ini, menyambungkan regulator anggaran pertahanan dengan operator proyek infrastruktur desa.",
      },
      {
        tag: "Lokasi Barang",
        title: "Ribuan unit rak SPPG tersimpan di gudang Pusziad TNI AD, Cileungsi.",
        body: "Catatan lapangan publik menyebut ribuan unit rak proyek SLO (Sarana Logistik Operasional) yang seharusnya terdistribusi ke SPPG ditemukan tersimpan di gudang militer Pusziad TNI AD Cileungsi.",
      },
    ],
    timeline: [
      { date: "2024", event: "YPPSDP direstrukturisasi di bawah Kemenhan; Menhan menjadi pimpinan ex-officio." },
      { date: "Feb 2025", event: "Program Koperasi Merah Putih resmi diluncurkan dengan target 80.000+ gerai." },
      { date: "Mei 2025", event: "Kontrak konstruksi mayoritas tercatat jatuh ke ekosistem Agrinas." },
      { date: "Okt 2025", event: "Penilaian fisik lapangan di Denpasar mencatat selisih ~Rp 700 juta/unit." },
      { date: "Jan 2026", event: "Ribuan unit rak SLO ditemukan tersimpan di gudang Pusziad Cileungsi." },
      { date: "Apr 2026", event: "Pemetaan AHU mencatat 57 relasi dalam ekosistem Agrinas." },
    ],
  },
  {
    slug: "motor-bgn",
    code: "PROYEK 03",
    file: "case_study_motor_bgn.json",
    title: "Motor Listrik MBG — Rp 1,4 Triliun",
    subtitle: "Vendor pemenang terdaftar sebagai saksi di berkas perkara bansos KPK.",
    lede: "Kontrak pengadaan motor listrik Rp 1,4 triliun untuk distribusi Makan Bergizi Gratis dimenangkan PT Yasa Artha. Nama direksinya juga tercatat di berkas perkara bansos yang ditangani KPK.",
    severity: "ACTIVE",
    thread: "Thread B — Logistik MBG",
    categoryShort: "MBG",
    categoryLong: "Makan Bergizi Gratis",
    anggaranFokus: "Rp 1,4 T",
    anggaranLabel: "Kontrak pengadaan motor listrik",
    findings: [
      {
        tag: "Jejak Nama",
        title: "Direksi vendor tercatat di berkas perkara bansos KPK.",
        body: "Jajaran direksi PT Yasa Artha tercatat dalam berkas penyidikan KPK sebagai saksi kunci kasus dugaan korupsi pengadaan bansos. Fakta ini tidak mengubah status vendor dalam sistem pengadaan pemerintah.",
      },
      {
        tag: "Angka Besar",
        title: "Rp 1,4 triliun untuk satu lini logistik.",
        body: "Alokasi Rp 1,4 T untuk motor listrik saja merupakan porsi signifikan dari total anggaran logistik MBG. Tidak ada dokumen publik yang menjustifikasi pilihan teknologi atau unit cost.",
      },
      {
        tag: "Nama Berulang",
        title: "Ekosistem vendor MBG tumpang tindih dengan ekosistem Agrinas.",
        body: "Beberapa entitas vendor yang muncul di paket logistik MBG juga tercatat sebagai pemasok di ekosistem Agrinas/KMP. Pola ini menunjukkan konsentrasi pasar yang sempit.",
      },
    ],
    timeline: [
      { date: "Feb 2025", event: "RUP pengadaan motor listrik MBG diumumkan dalam SiRUP." },
      { date: "Jun 2025", event: "PT Yasa Artha ditetapkan sebagai pemenang kontrak Rp 1,4 T." },
      { date: "Agu 2025", event: "Audit silang KPK mencatat keterlibatan direksi Yasa Artha dalam kasus bansos." },
      { date: "Nov 2025", event: "Distribusi motor listrik dimulai; laporan lapangan mencatat inkonsistensi spesifikasi." },
    ],
  },
] as const;

export const DOSSIER_SLUGS = DOSSIER_REGISTRY.map((d) => d.slug);

export function getDossierMeta(slug: string): DossierMeta | null {
  return DOSSIER_REGISTRY.find((d) => d.slug === slug) ?? null;
}

// Returns the union of relatedEntityIds across all findings, deduplicated.
// Used to deep-link a dossier into /graf?focus=... so the graph opens already
// zoomed to the actors relevant for that specific note.
export function getDossierFocusIds(slug: string): readonly string[] {
  const meta = getDossierMeta(slug);
  if (!meta) return [];
  const seen = new Set<string>();
  for (const f of meta.findings) {
    f.relatedEntityIds?.forEach((id) => seen.add(id));
  }
  return Array.from(seen);
}

// ─── Data loader ─────────────────────────────────────────────────────────────

export interface DossierFacts {
  readonly entities: readonly Entity[];
  readonly people: readonly Entity[];
  readonly orgs: readonly Entity[];
  readonly projects: readonly Entity[];
  readonly redFlags: readonly RedFlag[];
  readonly redFlagsHigh: number;
  readonly redFlagsMedium: number;
  readonly totalRelations: number;
  readonly allSources: readonly string[];
}

export interface LoadedDossier {
  readonly meta: DossierMeta;
  readonly caseStudy: CaseStudy;
  readonly facts: DossierFacts;
}

export async function loadDossier(slug: string): Promise<LoadedDossier | null> {
  const meta = getDossierMeta(slug);
  if (!meta) return null;

  try {
    const { readFile } = await import("fs/promises");
    const { join } = await import("path");
    const filePath = join(process.cwd(), "public", "data", meta.file);
    const raw = await readFile(filePath, "utf-8");
    const data: unknown = JSON.parse(raw);

    if (!isCaseStudy(data)) {
      console.error(`[dossier] invalid case study: ${meta.file}`);
      return null;
    }

    const people = data.entities.filter((e) => e.type === "Person");
    const orgs = data.entities.filter((e) => e.type === "Organization");
    const projects = data.entities.filter((e) => e.type === "Project");
    const redFlagsHigh = data.red_flags.filter((rf) => rf.severity === "HIGH").length;
    const redFlagsMedium = data.red_flags.filter((rf) => rf.severity === "MEDIUM").length;

    const sources = new Set<string>();
    data.entities.forEach((e) => e.sumber?.forEach((s) => sources.add(s)));
    data.red_flags.forEach((rf) => rf.sumber?.forEach((s) => sources.add(s)));
    data.relations.forEach((r) => r.sumber?.forEach((s) => sources.add(s)));

    return {
      meta,
      caseStudy: data,
      facts: {
        entities: data.entities,
        people,
        orgs,
        projects,
        redFlags: data.red_flags,
        redFlagsHigh,
        redFlagsMedium,
        totalRelations: data.relations.length,
        allSources: Array.from(sources),
      },
    };
  } catch (err) {
    console.error(`[dossier] failed to load ${meta.file}:`, err);
    return null;
  }
}

// Lightweight summaries for the index grid — no file reads.
export function getDossierSummaries(): readonly DossierMeta[] {
  return DOSSIER_REGISTRY;
}

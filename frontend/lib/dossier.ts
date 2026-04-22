// KONEKSI.ID — Dossier loader & slug registry
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
    code: "DOSSIER 01",
    file: "case_study_bgn_peruri.json",
    title: "Kontrak Rp 600 Miliar Tanpa Tender.",
    subtitle: "Bagaimana BUMN percetakan memenangkan proyek sistem informasi kesehatan nasional.",
    lede: "Badan Gizi Nasional memberikan kontrak Sistem Informasi Gizi senilai Rp 600 miliar kepada Perum Peruri melalui penunjukan langsung. Jajaran direksi anak perusahaan penerima kontrak mencakup pejabat aktif Kementerian Kesehatan dan mantan direktur GovTech procurement.",
    severity: "CRITICAL",
    thread: "Thread A — BGN & Peruri",
    categoryShort: "BGN",
    categoryLong: "Badan Gizi Nasional",
    anggaranFokus: "Rp 600 M",
    anggaranLabel: "Kontrak penunjukan langsung",
    findings: [
      {
        tag: "Penunjukan Langsung",
        title: "Mismatch kompetensi — BUMN cetak uang memenangkan proyek IT Rp 600 M.",
        body: "Peruri secara historis adalah BUMN percetakan dokumen berharga. Kontrak sistem informasi kesehatan diberikan via penunjukan langsung kepada anak perusahaannya, PT Peruri Digital Security (PDS), tanpa tender kompetitif terbuka.",
        relatedEntityIds: ["org-bgn", "org-peruri", "org-pds"],
        relatedRedFlagIds: ["rf-001"],
      },
      {
        tag: "Konflik Kepentingan",
        title: "Chief DTO Kemenkes menjabat sebagai Komisaris Utama PDS.",
        body: "Setiaji, Chief DTO Kementerian Kesehatan, duduk sebagai Komisaris Utama PDS — lembaga yang menerima kontrak IT dari lembaga pemerintah. Wakil Direktur Utama, Rahmat Danu Andika, sebelumnya menjabat Direktur GovTech Procurement di pemerintahan.",
        relatedEntityIds: ["person-setiaji", "person-danu-andika", "org-pds"],
      },
      {
        tag: "Beneficial Owner",
        title: "Satu CEO, dua perusahaan, akumulasi kontrak ~Rp 700 M.",
        body: "Shoraya Lolyta Oktaviana terdaftar sebagai pemilik manfaat dua entitas berbeda (PT IMI dan PT NSP), yang keduanya memenangkan paket pengadaan rak Koperasi Merah Putih dengan nilai kumulatif ~Rp 695 miliar.",
        relatedEntityIds: ["person-shoraya", "org-imi", "org-nsp"],
        relatedRedFlagIds: ["rf-008"],
      },
      {
        tag: "Anomali Harga",
        title: "Markup ~300% pada pengadaan sikat dan semir sepatu SPPI.",
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
      { date: "Feb 2026", event: "Viral: pengadaan sikat & semir sepatu Rp 1,57 M dengan markup 300%.", source: "Tempo, Detik" },
      { date: "Apr 2026", event: "Audit silang AHU + LPSE mengungkap dua entitas Shoraya Lolyta Oktaviana.", source: "Investigasi KONEKSI.ID" },
    ],
  },
  {
    slug: "agrinas-kmp",
    code: "DOSSIER 02",
    file: "case_study_agrinas_kmp.json",
    title: "Gurita Monopoli Rp 128 Triliun.",
    subtitle: "Satu yayasan Kemenhan memegang kendali konstruksi 80.000+ gerai Koperasi Merah Putih.",
    lede: "PT Agrinas, entitas yang berafiliasi dengan Yayasan Pembinaan Pembangunan Sumber Daya Pertanian (YPPSDP) di bawah Kementerian Pertahanan, memegang kendali konstruksi lebih dari 80.000 gerai Koperasi Merah Putih — sebuah struktur pasar yang secara efektif menghilangkan kompetisi di infrastruktur desa.",
    severity: "VERIFIED",
    thread: "Thread C — Agrinas & KMP",
    categoryShort: "KMP",
    categoryLong: "Koperasi Merah Putih",
    anggaranFokus: "Rp 128 T",
    anggaranLabel: "Estimasi nilai proyek total",
    findings: [
      {
        tag: "Monopoli Vertikal",
        title: "Satu ekosistem menguasai 80.000+ gerai infrastruktur desa.",
        body: "PT Agrinas dan jejaring entitas afiliasinya memegang kontrak konstruksi untuk lebih dari 80.000 gerai Koperasi Merah Putih. Skala ini menghilangkan ruang partisipasi kontraktor lokal dan kompetisi harga terbuka.",
      },
      {
        tag: "Markup Konstruksi",
        title: "Selisih hingga Rp 700 juta per gerai — studi kasus Denpasar.",
        body: "Anggaran per unit gerai yang diklaim mencapai angka tertentu, sementara penilaian fisik di lapangan (studi kasus Denpasar) menunjukkan selisih hingga Rp 700 juta per unit dari nilai konstruksi riil.",
      },
      {
        tag: "Jaringan Kekuasaan",
        title: "Menhan ex-officio memimpin YPPSDP — regulator anggaran sekaligus operator.",
        body: "Menteri Pertahanan aktif tercatat sebagai pimpinan ex-officio YPPSDP, yayasan induk ekosistem Agrinas. Ini mengikat regulator anggaran pertahanan langsung ke operator proyek infrastruktur desa.",
      },
      {
        tag: "Infrastruktur Militer",
        title: "Ribuan unit rak SPPG ditemukan di gudang Pusziad TNI AD, Cileungsi.",
        body: "Temuan fisik oleh tim investigasi: ribuan unit rak proyek SLO (Sarana Logistik Operasional) yang seharusnya terdistribusi ke SPPG tersimpan di gudang militer Pusziad TNI AD Cileungsi — indikasi penyimpangan rantai distribusi.",
      },
    ],
    timeline: [
      { date: "2024", event: "YPPSDP direstrukturisasi di bawah Kemenhan; Menhan menjadi pimpinan ex-officio." },
      { date: "Feb 2025", event: "Program Koperasi Merah Putih resmi diluncurkan dengan target 80.000+ gerai." },
      { date: "Mei 2025", event: "Kontrak konstruksi mayoritas jatuh ke ekosistem Agrinas." },
      { date: "Okt 2025", event: "Penilaian fisik lapangan di Denpasar mengungkap selisih ~Rp 700 juta/unit." },
      { date: "Jan 2026", event: "Ribuan unit rak SLO ditemukan tersimpan di gudang Pusziad Cileungsi." },
      { date: "Apr 2026", event: "Audit AHU memetakan 57 relasi dalam ekosistem Agrinas." },
    ],
  },
  {
    slug: "motor-bgn",
    code: "DOSSIER 03",
    file: "case_study_motor_bgn.json",
    title: "Rp 1,4 Triliun untuk Motor Listrik MBG.",
    subtitle: "Vendor pemenang adalah saksi kunci dalam kasus korupsi bansos di KPK.",
    lede: "Kontrak pengadaan motor listrik senilai Rp 1,4 triliun untuk distribusi program Makan Bergizi Gratis dimenangkan oleh PT Yasa Artha. Jajaran direksinya tercatat sebagai saksi kunci dalam kasus korupsi bansos yang saat ini sedang dalam penyidikan KPK.",
    severity: "ACTIVE",
    thread: "Thread B — Logistik MBG",
    categoryShort: "MBG",
    categoryLong: "Makan Bergizi Gratis",
    anggaranFokus: "Rp 1,4 T",
    anggaranLabel: "Kontrak pengadaan motor listrik",
    findings: [
      {
        tag: "Rekam Jejak",
        title: "Direksi vendor pemenang adalah saksi kunci kasus bansos KPK.",
        body: "Jajaran direksi PT Yasa Artha tercatat dalam berkas penyidikan KPK sebagai saksi kunci dalam kasus dugaan korupsi pengadaan bansos. Fakta ini tidak menggugurkan status vendor dalam sistem pengadaan pemerintah.",
      },
      {
        tag: "Skala Anggaran",
        title: "Rp 1,4 triliun untuk satu lini logistik — proporsi patut dipertanyakan.",
        body: "Alokasi Rp 1,4 T untuk motor listrik saja merupakan porsi signifikan dari total anggaran logistik MBG. Tidak ada data publik yang menjustifikasi pilihan teknologi atau unit cost.",
      },
      {
        tag: "Sirkularitas",
        title: "Ekosistem vendor MBG tumpang tindih dengan ekosistem Agrinas.",
        body: "Beberapa entitas vendor yang muncul dalam paket logistik MBG juga tercatat sebagai pemasok dalam ekosistem Agrinas/KMP, mengindikasikan konsentrasi pasar yang sempit.",
      },
    ],
    timeline: [
      { date: "Feb 2025", event: "RUP pengadaan motor listrik MBG diumumkan dalam SiRUP." },
      { date: "Jun 2025", event: "PT Yasa Artha ditetapkan sebagai pemenang kontrak Rp 1,4 T." },
      { date: "Agu 2025", event: "Audit silang KPK mengungkap keterlibatan direksi Yasa Artha dalam kasus bansos." },
      { date: "Nov 2025", event: "Distribusi motor listrik dimulai — laporan lapangan menunjukkan inkonsistensi spesifikasi." },
    ],
  },
] as const;

export const DOSSIER_SLUGS = DOSSIER_REGISTRY.map((d) => d.slug);

export function getDossierMeta(slug: string): DossierMeta | null {
  return DOSSIER_REGISTRY.find((d) => d.slug === slug) ?? null;
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

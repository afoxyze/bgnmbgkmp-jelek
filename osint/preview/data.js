// Preview data — mirrors frontend/lib/dossier.ts + real case_study_bgn_peruri.json.
// Plain JS (no TS) so the static HTML can load it directly.

window.DOSSIERS = [
  {
    slug: "bgn-peruri",
    code: "DOSSIER 01",
    title: "Kontrak Rp 600 Miliar Tanpa Tender.",
    subtitle: "Bagaimana BUMN percetakan memenangkan proyek sistem informasi kesehatan nasional.",
    lede: "Badan Gizi Nasional memberikan kontrak Sistem Informasi Gizi senilai Rp 600 miliar kepada Perum Peruri melalui penunjukan langsung. Jajaran direksi anak perusahaan penerima kontrak mencakup pejabat aktif Kementerian Kesehatan dan mantan direktur GovTech procurement.",
    severity: "CRITICAL",
    thread: "Thread A — BGN & Peruri",
    categoryShort: "BGN",
    categoryLong: "Badan Gizi Nasional",
    anggaranFokus: "Rp 600 M",
    anggaranLabel: "Kontrak penunjukan langsung",
    status: "Data Terverifikasi (LPSE/AHU)",
    tanggalRiset: "2026-04-08",
    primarySource: "Tempo, IDN Times, Bisnis.com, CNBC Indonesia, AHU Online",

    facts: {
      entities: 16,
      relations: 13,
      redFlagsHigh: 2,
      redFlagsMedium: 2,
    },

    findings: [
      {
        tag: "Penunjukan Langsung",
        title: "Mismatch kompetensi — BUMN cetak uang memenangkan proyek IT Rp 600 M.",
        body: "Peruri secara historis adalah BUMN percetakan dokumen berharga. Kontrak sistem informasi kesehatan diberikan via penunjukan langsung kepada anak perusahaannya, PT Peruri Digital Security (PDS), tanpa tender kompetitif terbuka.",
        relEntities: ["Badan Gizi Nasional (BGN)", "Perum Peruri", "PT Peruri Digital Security"],
        relFlags: [{ id: "rf-001", severity: "HIGH" }],
      },
      {
        tag: "Konflik Kepentingan",
        title: "Chief DTO Kemenkes menjabat sebagai Komisaris Utama PDS.",
        body: "Setiaji, Chief DTO Kementerian Kesehatan, duduk sebagai Komisaris Utama PDS — lembaga yang menerima kontrak IT dari lembaga pemerintah. Wakil Direktur Utama, Rahmat Danu Andika, sebelumnya menjabat Direktur GovTech Procurement di pemerintahan.",
        relEntities: ["Setiaji", "Rahmat Danu Andika", "PT Peruri Digital Security"],
        relFlags: [],
      },
      {
        tag: "Beneficial Owner",
        title: "Satu CEO, dua perusahaan, akumulasi kontrak ~Rp 700 M.",
        body: "Shoraya Lolyta Oktaviana terdaftar sebagai pemilik manfaat dua entitas berbeda (PT IMI dan PT NSP), yang keduanya memenangkan paket pengadaan rak Koperasi Merah Putih dengan nilai kumulatif ~Rp 695 miliar.",
        relEntities: ["Shoraya Lolyta Oktaviana", "PT IMI", "PT NSP"],
        relFlags: [{ id: "rf-008", severity: "HIGH" }],
      },
      {
        tag: "Anomali Harga",
        title: "Markup ~300% pada pengadaan sikat dan semir sepatu SPPI.",
        body: "Harga satuan di Inaproc mencapai Rp 50.000–56.000 per unit, dibandingkan harga pasar eceran Rp 18.000–19.000. Total alokasi Rp 1,57 miliar untuk 12 paket kontrak via E-Purchasing.",
        relEntities: ["Pengadaan Sikat & Semir", "PT Gajah Mitra Paragon"],
        relFlags: [{ id: "rf-012", severity: "MEDIUM" }],
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

    actors: {
      people: [
        { id: "person-dadan", name: "Dadan Hindayana", role: "Kepala Badan Gizi Nasional (BGN)", flag: false },
        { id: "person-setiaji", name: "Setiaji", role: "Komisaris Utama PDS · Chief DTO Kemenkes", flag: true },
        { id: "person-danu-andika", name: "Rahmat Danu Andika", role: "Wakil Direktur Utama PDS · eks-GovTech Procurement", flag: true },
        { id: "person-shoraya", name: "Shoraya Lolyta Oktaviana", role: "CEO PT IMI & PT NSP", flag: true },
      ],
      orgs: [
        { id: "org-bgn", name: "Badan Gizi Nasional (BGN)", role: "LPNK, anggaran Rp 71 T (2025)", flag: false },
        { id: "org-peruri", name: "Perum Percetakan Uang RI", role: "BUMN percetakan dokumen berharga", flag: true },
        { id: "org-pds", name: "PT Peruri Digital Security", role: "Anak usaha Peruri (99.78%) · IT Solutions", flag: true },
        { id: "org-imi", name: "PT Indoraya Multi Internasional", role: "Pemilik: Shoraya · kontrak Rp 375 M", flag: false },
        { id: "org-nsp", name: "PT Nagatama Septa Persada", role: "Pemilik: Shoraya · kontrak Rp 320 M", flag: false },
        { id: "org-gajah-mitra", name: "PT Gajah Mitra Paragon", role: "Vendor sikat & semir sepatu", flag: false },
        { id: "org-mht", name: "PT Mitrawira Hutama Teknologi", role: "Vendor Tablet Samsung BGN", flag: false },
      ],
      projects: [
        { id: "proj-bgn-eo", name: "Jasa Event Organizer BGN", role: "Rp 113 M · operasional MBG", flag: true },
        { id: "proj-bgn-alat-makan", name: "Pengadaan Alat Makan SPPG", role: "Rp 89,32 M · 1,2 juta paket", flag: true },
        { id: "proj-bgn-sikat-sepatu", name: "Pengadaan Sikat & Semir SPPI", role: "Rp 1,57 M · markup ~300%", flag: true },
        { id: "proj-bgn-tablet", name: "Pengadaan Tablet Samsung SPPI", role: "Rp 508,4 M · markup Rp 7,95 jt/unit", flag: true },
      ],
    },

    sources: [
      "https://bgn.go.id",
      "https://peruri.co.id",
      "https://pds.co.id",
      "https://www.tempo.co/politik/bgn-hamburkan-rp-1-5-miliar-buat-beli-sikat-and-semir-sepatu-2129673",
      "https://www.bbc.com/indonesia/articles/crr110erpyeo",
      "https://www.antaranews.com/berita/4321501/kepala-bgn-klarifikasi-anggaran-eo-rp113-miliar",
      "https://www.jawapos.com/ekonomi/015096329/icw-soroti-pengadaan-tablet-bgn-ada-potensi-markup",
      "https://news.detik.com/berita/d-7531201/dadan-hindayana-buka-suara-soal-anggaran-eo-badan-gizi-rp-113-m",
      "https://fin.co.id/read/189745/bgn-belanja-sikat-dan-semir-sepatu-rp15-miliar-harga-satuan-diduga-markup-3-kali-lipat",
      "https://www.pikiran-rakyat.com/nasional/pr-0189745/viral-pengadaan-tablet-badan-gizi-nasional-rp508-miliar",
    ],
  },

  {
    slug: "agrinas-kmp",
    code: "DOSSIER 02",
    title: "Gurita Monopoli Rp 128 Triliun.",
    subtitle: "Satu yayasan Kemenhan memegang kendali konstruksi 80.000+ gerai Koperasi Merah Putih.",
    lede: "PT Agrinas, entitas yang berafiliasi dengan Yayasan Pembinaan Pembangunan Sumber Daya Pertanian (YPPSDP) di bawah Kementerian Pertahanan, memegang kendali konstruksi lebih dari 80.000 gerai Koperasi Merah Putih — sebuah struktur pasar yang secara efektif menghilangkan kompetisi di infrastruktur desa.",
    severity: "VERIFIED",
    thread: "Thread C — Agrinas & KMP",
    categoryShort: "KMP",
    categoryLong: "Koperasi Merah Putih",
    anggaranFokus: "Rp 128 T",
    anggaranLabel: "Estimasi nilai proyek total",
    status: "Audit Selesai (Terverifikasi)",
    tanggalRiset: "2026-04-12",
    primarySource: "AHU Online, KPK, LPSE, Investigasi Lapangan Pusziad",

    facts: { entities: 17, relations: 23, redFlagsHigh: 4, redFlagsMedium: 3 },

    findings: [
      { tag: "Monopoli Vertikal", title: "Satu ekosistem menguasai 80.000+ gerai infrastruktur desa.", body: "PT Agrinas dan jejaring entitas afiliasinya memegang kontrak konstruksi untuk lebih dari 80.000 gerai Koperasi Merah Putih. Skala ini menghilangkan ruang partisipasi kontraktor lokal dan kompetisi harga terbuka.", relEntities: ["PT Agrinas", "YPPSDP", "Koperasi Merah Putih"], relFlags: [] },
      { tag: "Markup Konstruksi", title: "Selisih hingga Rp 700 juta per gerai — studi kasus Denpasar.", body: "Anggaran per unit gerai yang diklaim mencapai angka tertentu, sementara penilaian fisik di lapangan (studi kasus Denpasar) menunjukkan selisih hingga Rp 700 juta per unit dari nilai konstruksi riil.", relEntities: ["Studi Kasus Denpasar"], relFlags: [{ id: "rf-a01", severity: "HIGH" }] },
      { tag: "Jaringan Kekuasaan", title: "Menhan ex-officio memimpin YPPSDP — regulator sekaligus operator.", body: "Menteri Pertahanan aktif tercatat sebagai pimpinan ex-officio YPPSDP, yayasan induk ekosistem Agrinas. Ini mengikat regulator anggaran pertahanan langsung ke operator proyek infrastruktur desa.", relEntities: ["Sjafrie Sjamsoeddin", "YPPSDP"], relFlags: [{ id: "rf-a03", severity: "HIGH" }] },
      { tag: "Infrastruktur Militer", title: "Ribuan unit rak SPPG ditemukan di gudang Pusziad TNI AD, Cileungsi.", body: "Temuan fisik oleh tim investigasi: ribuan unit rak proyek SLO (Sarana Logistik Operasional) yang seharusnya terdistribusi ke SPPG tersimpan di gudang militer Pusziad TNI AD Cileungsi — indikasi penyimpangan rantai distribusi.", relEntities: ["Pusziad TNI AD", "Gudang Cileungsi"], relFlags: [{ id: "rf-a05", severity: "HIGH" }] },
    ],

    timeline: [
      { date: "2024", event: "YPPSDP direstrukturisasi di bawah Kemenhan; Menhan menjadi pimpinan ex-officio." },
      { date: "Feb 2025", event: "Program Koperasi Merah Putih resmi diluncurkan dengan target 80.000+ gerai." },
      { date: "Mei 2025", event: "Kontrak konstruksi mayoritas jatuh ke ekosistem Agrinas." },
      { date: "Okt 2025", event: "Penilaian fisik lapangan di Denpasar mengungkap selisih ~Rp 700 juta/unit." },
      { date: "Jan 2026", event: "Ribuan unit rak SLO ditemukan tersimpan di gudang Pusziad Cileungsi." },
      { date: "Apr 2026", event: "Audit AHU memetakan 57 relasi dalam ekosistem Agrinas." },
    ],

    actors: {
      people: [
        { id: "person-sjafrie", name: "Sjafrie Sjamsoeddin", role: "Menhan RI · Pimpinan ex-officio YPPSDP", flag: true },
        { id: "person-agrinas-ceo", name: "Direksi PT Agrinas", role: "Operator ekosistem KMP", flag: false },
      ],
      orgs: [
        { id: "org-agrinas", name: "PT Agrinas", role: "Operator utama konstruksi KMP", flag: true },
        { id: "org-yppsdp", name: "Yayasan YPPSDP", role: "Induk ekosistem · Kemenhan", flag: true },
        { id: "org-kmp", name: "Koperasi Merah Putih", role: "Target: 80.000+ gerai desa", flag: false },
        { id: "org-pusziad", name: "Pusziad TNI AD", role: "Gudang Cileungsi · smoking gun", flag: true },
      ],
      projects: [
        { id: "proj-konstruksi", name: "Konstruksi Gerai KMP", role: "Rp 128 T · 80.000+ unit", flag: true },
        { id: "proj-slo", name: "Proyek SLO (Rak SPPG)", role: "Ribuan unit di gudang militer", flag: true },
      ],
    },

    sources: [
      "https://kompas.com/tni-ad-pusziad-cileungsi-temuan-rak-slo",
      "https://tempo.co/agrinas-koperasi-merah-putih-80000-gerai",
      "https://ahu.go.id/yppsdp",
      "https://kpk.go.id/laporan-audit-agrinas",
    ],
  },

  {
    slug: "motor-bgn",
    code: "DOSSIER 03",
    title: "Rp 1,4 Triliun untuk Motor Listrik MBG.",
    subtitle: "Vendor pemenang adalah saksi kunci dalam kasus korupsi bansos di KPK.",
    lede: "Kontrak pengadaan motor listrik senilai Rp 1,4 triliun untuk distribusi program Makan Bergizi Gratis dimenangkan oleh PT Yasa Artha. Jajaran direksinya tercatat sebagai saksi kunci dalam kasus korupsi bansos yang saat ini sedang dalam penyidikan KPK.",
    severity: "ACTIVE",
    thread: "Thread B — Logistik MBG",
    categoryShort: "MBG",
    categoryLong: "Makan Bergizi Gratis",
    anggaranFokus: "Rp 1,4 T",
    anggaranLabel: "Kontrak pengadaan motor listrik",
    status: "Audit Selesai (Terverifikasi)",
    tanggalRiset: "2026-04-10",
    primarySource: "KPK, LPSE, SiRUP, Tempo",

    facts: { entities: 12, relations: 14, redFlagsHigh: 2, redFlagsMedium: 3 },

    findings: [
      { tag: "Rekam Jejak", title: "Direksi vendor pemenang adalah saksi kunci kasus bansos KPK.", body: "Jajaran direksi PT Yasa Artha tercatat dalam berkas penyidikan KPK sebagai saksi kunci dalam kasus dugaan korupsi pengadaan bansos. Fakta ini tidak menggugurkan status vendor dalam sistem pengadaan pemerintah.", relEntities: ["PT Yasa Artha"], relFlags: [{ id: "rf-m01", severity: "HIGH" }] },
      { tag: "Skala Anggaran", title: "Rp 1,4 triliun untuk satu lini logistik — proporsi patut dipertanyakan.", body: "Alokasi Rp 1,4 T untuk motor listrik saja merupakan porsi signifikan dari total anggaran logistik MBG. Tidak ada data publik yang menjustifikasi pilihan teknologi atau unit cost.", relEntities: ["Pengadaan Motor Listrik"], relFlags: [{ id: "rf-m02", severity: "MEDIUM" }] },
      { tag: "Sirkularitas", title: "Ekosistem vendor MBG tumpang tindih dengan ekosistem Agrinas.", body: "Beberapa entitas vendor yang muncul dalam paket logistik MBG juga tercatat sebagai pemasok dalam ekosistem Agrinas/KMP, mengindikasikan konsentrasi pasar yang sempit.", relEntities: [], relFlags: [] },
    ],

    timeline: [
      { date: "Feb 2025", event: "RUP pengadaan motor listrik MBG diumumkan dalam SiRUP." },
      { date: "Jun 2025", event: "PT Yasa Artha ditetapkan sebagai pemenang kontrak Rp 1,4 T." },
      { date: "Agu 2025", event: "Audit silang KPK mengungkap keterlibatan direksi Yasa Artha dalam kasus bansos." },
      { date: "Nov 2025", event: "Distribusi motor listrik dimulai — laporan lapangan menunjukkan inkonsistensi spesifikasi." },
    ],

    actors: {
      people: [
        { id: "person-yasa-direksi", name: "Direksi PT Yasa Artha", role: "Saksi kunci kasus bansos KPK", flag: true },
      ],
      orgs: [
        { id: "org-yasa", name: "PT Yasa Artha", role: "Pemenang kontrak Rp 1,4 T", flag: true },
        { id: "org-bgn", name: "Badan Gizi Nasional", role: "Pemberi kontrak", flag: false },
      ],
      projects: [
        { id: "proj-motor", name: "Pengadaan Motor Listrik MBG", role: "Rp 1,4 T · distribusi logistik", flag: true },
      ],
    },

    sources: [
      "https://kpk.go.id/kasus-bansos-yasa-artha",
      "https://sirup.lkpp.go.id/mbg-motor-listrik",
      "https://tempo.co/yasa-artha-motor-listrik-mbg-14-triliun",
    ],
  },
];

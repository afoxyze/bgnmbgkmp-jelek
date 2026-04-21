# KONEKSI.ID — Master Configuration & Entity Registry
# Use this as the single source of truth for IDs and Master Data.

import os

# Base Directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
FRONTEND_DATA_DIR = os.path.join(BASE_DIR, "frontend", "public", "data")
FRONTEND_EXPORT_DIR = os.path.join(BASE_DIR, "frontend", "public", "exports")

PATHS = {
    "raw_news": os.path.join(DATA_DIR, "raw", "news"),
    "processed_news": os.path.join(DATA_DIR, "processed", "news"),
    "processed_entities": os.path.join(DATA_DIR, "processed", "entities"),
    "nemesis_outputs": os.path.join(DATA_DIR, "gpt-5.4-analyzed-sirup", "inaproc-ds", "outputs"),
    "frontend_data": FRONTEND_DATA_DIR,
    "frontend_exports": FRONTEND_EXPORT_DIR,
    "sqlite_db": os.path.join(BASE_DIR, "backend", "data", "dashboard.sqlite"),
    "sppg_locations": os.path.join(FRONTEND_DATA_DIR, "all_sppg_locations.json"),
    "ahu_board_mapping": os.path.join(DATA_DIR, "processed", "ahu_board_mapping.json"),
    "discovery_conflicts": os.path.join(DATA_DIR, "discovery", "political_conflicts_v2.json"),
    "discovery_dir": os.path.join(DATA_DIR, "discovery"),
    "conflicts_json": os.path.join(DATA_DIR, "discovery", "conflicts.json"),
    "official_hits": os.path.join(DATA_DIR, "discovery", "official_hits.json"),
    "foundation_audit_results": os.path.join(DATA_DIR, "discovery", "foundation_audit_results.json"),
    "news_links": os.path.join(DATA_DIR, "processed", "news_links.json"),
    "regencies_full": os.path.join(DATA_DIR, "raw", "indonesia_regencies_full.json"),
    "manual_dir": os.path.join(DATA_DIR, "manual"),
    "sppg_raw_glob": os.path.join(DATA_DIR, "raw", "bgn", "sppg", "sppg_batch_*.json"),
    "case_studies_glob": os.path.join(FRONTEND_DATA_DIR, "case_study_*.json"),
}

PARTIES = [
    "Gerindra", "PDI-P", "PDIP", "Golkar", "NasDem", "PKB", "PKS", "PAN", 
    "Demokrat", "PPP", "PSI", "Perindo", "Hanura", "Gelora", "Buruh", 
    "Ummat", "PKN", "Garuda", "PBB"
]

HIGH_RISK_PEOPLE = [
    {"name": "Prabowo Subianto", "party": "Gerindra", "role": "President / Chairman"},
    {"name": "Musa Bangun", "party": "Gerindra", "role": "Waketum / YPPSDP Chair"},
    {"name": "Hashim Djojohadikusumo", "party": "Gerindra", "role": "President's Brother"},
    {"name": "Sjafrie Sjamsoeddin", "party": "None (Military/Govt)", "role": "Menhan / YPPSDP Founder"},
    {"name": "Glenny H. Kairupan", "party": "Gerindra", "role": "TMI / Garuda CEO"},
    {"name": "Angga Raka Prabowo", "party": "Gerindra", "role": "Wasekjen / Komut Telkom"},
    {"name": "Ferry Joko Juliantono", "party": "Gerindra", "role": "Waketum / Menkop"},
    {"name": "Rauf Purnama", "party": "Gerindra", "role": "Dewan Pakar / Agrinas CEO"},
    {"name": "Dirgayuza Setyawan", "party": "Gerindra", "role": "Asisten Khusus Presiden"},
    {"name": "Yasir Machmud", "party": "Gerindra", "role": "DPRD Sulsel / Sekr DPD"},
    {"name": "Sulaeman Lessu Hamzah", "party": "NasDem", "role": "DPR RI"},
    {"name": "Raden Muhammad Nizar", "party": "PPP", "role": "DPRD Garut"},
    {"name": "Raden Ayu Amrina Rosyada", "party": "Hanura", "role": "DPRD Ogan Ilir"},
    {"name": "Asep Rahmat", "party": "PAN", "role": "DPRD Ciamis"},
    {"name": "Shoraya Lolyta Oktaviana", "party": "None", "role": "CEO IMI (Investigated)"},
    {"name": "Burhanuddin Abdullah", "party": "Gerindra (TKN)", "role": "Komut PLN / Danantara"}
]

MASTER_REGISTRY = {
    "person-prabowo": {
        "id": "person-prabowo", "type": "Person", "label": "Prabowo Subianto",
        "properties": {
            "jabatan": "Presiden Republik Indonesia",
            "partai_politik": "Ketua Umum Partai Gerindra",
            "peran_strategis": "Pembuat kebijakan nasional program KMP & MBG",
            "afiliasi_yayasan": "Ketua Pembina YPPSDP (Ultimate Controller Agrinas)"
        },
        "sumber": ["https://presidenri.go.id"]
    },
    "person-sjafrie": {
        "id": "person-sjafrie", "type": "Person", "label": "Sjafrie Sjamsoeddin",
        "properties": {
            "jabatan": "Menteri Pertahanan RI (sejak 2024)",
            "latar_belakang": "Purnawirawan Jenderal TNI",
            "peran_yayasan": "Ketua Pembina YPPSDP (Ex-Officio)",
            "relevansi": "Mengawasi yayasan yang mengelola bisnis pertahanan dan pangan nasional"
        },
        "sumber": ["https://kompaspedia.kompas.id/baca/profil/tokoh/menteri-pertahanan-ri-2024-2029-sjafri-sjamsoeddin"]
    },
    "person-dadan": {
        "id": "person-dadan", "type": "Person", "label": "Dadan Hindayana",
        "properties": {
            "jabatan": "Kepala Badan Gizi Nasional (BGN)",
            "latar_belakang": "Akademisi IPB",
            "tugas_utama": "Mengelola anggaran Rp71T untuk program Makan Bergizi Gratis"
        },
        "sumber": ["https://bgn.go.id"]
    },
    "person-shoraya": {
        "id": "person-shoraya", "type": "Person", "label": "Shoraya Lolyta Oktaviana",
        "properties": {
            "jabatan": "CEO PT Indoraya Multi Internasional (IMI)",
            "koneksi": "Terafiliasi dengan Nanik S. Deyang (Wakil Kepala BGN)",
            "red_flag": "Dugaan NIK Ganda dan pemenangan kontrak tanpa tender di ekosistem Agrinas"
        },
        "sumber": ["https://radarpost.id/investigasi/shoraya-nik-ganda"]
    },
    "person-rauf-purnama": {
        "id": "person-rauf-purnama", "type": "Person", "label": "Rauf Purnama",
        "properties": {
            "jabatan": "Direktur Utama PT Agro Industri Nasional (Agrinas)",
            "afiliasi": "Anggota Dewan Pakar Partai Gerindra",
            "koneksi": "Mantan tim kampanye Prabowo-Sandiaga 2019"
        },
        "sumber": ["https://agrinas.id"]
    },
    "org-bgn": {
        "id": "org-bgn", "type": "Organization", "label": "Badan Gizi Nasional (BGN)",
        "properties": {
            "jenis_lembaga": "Lembaga Pemerintah Non-Kementerian (LPNK)",
            "dibentuk_via": "Perpres No. 83 Tahun 2024",
            "anggaran_2025": "Rp 71 Triliun",
            "kepala_badan": "Dadan Hindayana",
            "wakil_kepala": "Nanik S. Deyang",
            "fungsi_utama": "Regulator dan pengawas distribusi Makan Bergizi Gratis (MBG)"
        },
        "sumber": ["https://bgn.go.id", "https://setneg.go.id"]
    },
    "org-agrinas": {
        "id": "org-agrinas", "type": "Organization", "label": "PT Agro Industri Nasional (Agrinas)",
        "properties": {
            "jenis": "BUMN Holding — Konstruksi & Pangan",
            "kepemilikan": "99% YPPSDP (Yayasan Kemenhan), 1% Koperasi Karyawan",
            "asal_usul": "Transformasi dari PT Virama Karya, Yodya Karya, dan Indra Karya",
            "peran_kunci": "Kontraktor utama pembangunan fisik 80.081 unit Koperasi Merah Putih",
            "red_flag": "Dikuasai yayasan politik dan mendapatkan penugasan langsung triliunan rupiah tanpa tender."
        },
        "sumber": ["https://agrinas.id", "https://majalah.tempo.co"]
    },
    "org-agrinas-pangan": {
        "id": "org-agrinas-pangan", "type": "Organization", "label": "PT Agrinas Pangan Nusantara",
        "properties": {
            "jenis": "Anak Perusahaan Agrinas Group",
            "fokus_bisnis": "Logistik, Distribusi Pangan, dan Operasional Koperasi",
            "mandat": "Pengelola operasional Koperasi Merah Putih selama 2 tahun pertama"
        },
        "sumber": ["https://agrinas.id"]
    },
    "org-peruri": {
        "id": "org-peruri", "type": "Organization", "label": "Perum Percetakan Uang RI (Peruri)",
        "properties": {
            "jenis": "Badan Usaha Milik Negara (BUMN)",
            "bidang_utama": "Percetakan dokumen berharga (uang, paspor, pita cukai)",
            "direktur_utama": "Dwina Septiani Wijaya",
            "peran_bgn": "Pemenang kontrak Sistem Informasi Gizi Rp600 Miliar",
            "red_flag": "Mismatch Kompetensi: BUMN percetakan memenangkan proyek sistem informasi kesehatan nasional via penunjukan langsung."
        },
        "sumber": ["https://peruri.co.id", "https://teknologi.bisnis.com"]
    },
    "org-pds": {
        "id": "org-pds", "type": "Organization", "label": "PT Peruri Digital Security (PDS)",
        "properties": {
            "jenis": "Anak Perusahaan BUMN (99.78% milik Peruri)",
            "fokus_bisnis": "IT Solutions, GovTech, Digital ID, e-KYC",
            "direktur_utama": "Teguh Kurniawan Harmanda (Eks-Tokocrypto)",
            "wakil_dirut": "Rahmat Danu Andika (Eks-Telkom GovTech)",
            "komisaris_utama": "Setiaji (Chief DTO Kemenkes)",
            "red_flag": "REVOLVING DOOR & COI: Jajaran direksi berasal dari insider pengadaan pemerintah (Telkom) dan regulator aktif (Kemenkes)."
        },
        "sumber": ["https://peruri.co.id", "https://cnbcindonesia.com"]
    },
    "org-yasa": {
        "id": "org-yasa", "type": "Organization", "label": "PT Yasa Artha Trimanunggal",
        "properties": {
            "jenis": "Perusahaan Swasta — Logistik & Pengadaan",
            "nilai_kontrak": "Rp1,2 - 1,4 Triliun (Pemenang Motor Listrik MBG)",
            "direktur_utama": "Yenna Yuniana (Saksi Kasus Bansos KPK)",
            "komisaris_utama": "Andri Mulyono (Saksi Kasus Bansos KPK)",
            "red_flag": "Pemenang kontrak triliunan rupiah yang jajaran direksinya diperiksa KPK dalam kasus korupsi bansos."
        },
        "sumber": ["https://suara.com", "https://rmol.id"]
    },
    "org-adlas": {
        "id": "org-adlas", "type": "Organization", "label": "PT Adlas Sarana Elektrik",
        "properties": {
            "jenis": "Produsen Motor Listrik — Anak Perusahaan Yasa Group",
            "brand": "Emmo Electric Mobility",
            "produk_kunci": "Emmo JVX GT (Trail Listrik MBG)",
            "red_flag": "Self-Dealing: Yasa Group memenangkan kontrak untuk mensuplai motor yang diproduksi oleh anak perusahaannya sendiri."
        },
        "sumber": ["https://oto.detik.com", "https://yasagroup.net"]
    },
    "org-kmp": {
        "id": "org-kmp", "type": "Project", "label": "Koperasi Desa/Kelurahan Merah Putih (KMP)",
        "properties": {
            "jenis_program": "Nasional — Flagship Koperasi Desa",
            "penyelenggara": "Kementerian Koperasi (Menteri: Ferry Juliantono - Gerindra)",
            "dasar_hukum": "Inpres No. 9 Tahun 2025; Inpres No. 17 Tahun 2025",
            "alokasi_anggaran": "Rp210–216 triliun (via Danantara & Himbara)",
            "target_sasaran": "80.081 unit koperasi di seluruh desa/kelurahan",
            "tanggal_peresmian": "21 Juli 2025 oleh Presiden Prabowo",
            "skema_operasional": "Pembiayaan Rp3M/unit (Rp2,5M capex + Rp500jt opex); Konstruksi via Agrinas",
            "unit_usaha_layanan": "Kios sembako, simpan pinjam, klinik desa, apotek, cold storage, logistik",
            "koneksi_strategis": "Supplier utama bahan pangan untuk program Makan Bergizi Gratis (MBG)",
            "catatan_kritis": "MULTI-INDICATOR RISK: (1) Konflik kepentingan Presiden via Agrinas/YPPSDP, (2) Kontrak konstruksi Rp128T tanpa tender, (3) Loop pendanaan tertutup Danantara, (4) Monopoli rantai pangan nasional MBG, (5) Risiko korupsi tata kelola lokal."
        },
        "sumber": ["https://presidenri.go.id", "https://setneg.go.id", "https://voi.id"]
    },
    "proj-mbg": {
        "id": "proj-mbg", "type": "Project", "label": "Program Makan Bergizi Gratis (MBG)",
        "properties": {
            "jenis_program": "Nasional — Flagship Gizi & Kesehatan",
            "penyelenggara": "Badan Gizi Nasional (Kepala: Dadan Hindayana)",
            "dasar_hukum": "Perpres No. 83 Tahun 2024; Inpres No. 1 Tahun 2025",
            "alokasi_anggaran": "Rp71 triliun (alokasi APBN 2025)",
            "target_sasaran": "82,9 juta anak sekolah, santri, dan ibu hamil",
            "tanggal_peresmian": "Uji Coba: 2024; Operasional Nasional: Januari 2025",
            "skema_operasional": "Distribusi via Satuan Pelayanan Pemenuhan Gizi (SPPG) di tiap wilayah",
            "unit_usaha_layanan": "Dapur komunal SPPG, penyediaan makanan siap saji, edukasi gizi masyarakat",
            "koneksi_strategis": "Logistik dan bahan baku disuplai secara eksklusif oleh Koperasi Merah Putih",
            "catatan_kritis": "Risiko tata kelola pada pemilihan mitra yayasan (28 yayasan terafiliasi parpol) dan pengadaan infrastruktur dapur (SPPG) tanpa tender terbuka."
        },
        "sumber": ["https://bgn.go.id", "https://setkab.go.id", "https://kompaspedia.kompas.id"]
    },
    "org-icw-001": {
        "id": "org-icw-001", "type": "Organization", "label": "Yayasan Lazuardi Kendari",
        "properties": {
            "jenis": "Yayasan Mitra SPPG MBG",
            "lokasi": "Kendari, Sulawesi Tenggara",
            "pendiri": "Nur Alam (Eks-Terpidana Korupsi)",
            "red_flag": "Didirikan oleh mantan terpidana korupsi yang memenangkan kemitraan program strategis nasional."
        },
        "sumber": ["https://tempo.co", "https://antikorupsi.org"]
    },
    "org-icw-002": {
        "id": "org-icw-002", "type": "Organization", "label": "Yayasan Indonesia Food Security Review (IFSR)",
        "properties": {
            "jenis": "Yayasan Mitra SPPG MBG",
            "pengurus_kunci": "Burhanuddin Abdullah (Ketua Danantara)",
            "koneksi_bgn": "Didirikan oleh Tenaga Ahli BGN (I Dewa Made Agung Kertha)",
            "red_flag": "Konflik Kepentingan: Staf internal BGN mendirikan yayasan yang menjadi mitra program BGN sendiri."
        },
        "sumber": ["https://tempo.co", "https://antikorupsi.org"]
    },
    "org-icw-003": {
        "id": "org-icw-003", "type": "Organization", "label": "Yayasan Abdi Bangun Negeri",
        "properties": {
            "jenis": "Yayasan Mitra SPPG MBG",
            "lokasi": "Ternate, Maluku Utara",
            "afiliasi_koruptor": "Abdul Hamid Payapo (Terpidana Korupsi Proyek Jalan)",
            "red_flag": "Terafiliasi dengan mantan narapidana korupsi proyek infrastruktur negara."
        },
        "sumber": ["https://tempo.co", "https://antikorupsi.org"]
    },
    "org-icw-004": {
        "id": "org-icw-004", "type": "Organization", "label": "Yayasan Cahaya Wirabangsa",
        "properties": {
            "jenis": "Yayasan Mitra SPPG MBG",
            "lokasi": "Garut, Jawa Barat",
            "afiliasi_politik": "Ketua adalah Anggota DPRD Aktif (Dapil II Garut)",
            "red_flag": "Legislator aktif mengelola yayasan yang menjadi mitra pelaksana anggaran negara."
        },
        "sumber": ["https://tempo.co", "https://antikorupsi.org"]
    },
    "org-icw-005": {
        "id": "org-icw-005", "type": "Organization", "label": "Yayasan Insan Cendekia Jayapura",
        "properties": {
            "jenis": "Yayasan Mitra SPPG MBG",
            "lokasi": "Jayapura, Papua",
            "afiliasi_politik": "Pengawas adalah Anggota DPR RI Aktif (NasDem)",
            "red_flag": "Conflict of Interest: Anggota DPR RI (pengawas APBN) mengelola yayasan mitra program pemerintah."
        },
        "sumber": ["https://tempo.co", "https://antikorupsi.org"]
    },
    "org-icw-006": {
        "id": "org-icw-006", "type": "Organization", "label": "Yayasan Sahabat Pelangi",
        "properties": {
            "jenis": "Yayasan Mitra SPPG MBG",
            "lokasi": "Ogan Ilir, Sumatera Selatan",
            "afiliasi_politik": "Pendiri adalah Anggota DPRD Aktif (Hanura)",
            "red_flag": "Legislator daerah aktif terlibat langsung dalam pengelolaan unit mitra program strategis."
        },
        "sumber": ["https://tempo.co", "https://antikorupsi.org"]
    },
    "org-icw-007": {
        "id": "org-icw-007", "type": "Organization", "label": "Yayasan Asra Bakti Maritim",
        "properties": {
            "jenis": "Yayasan Mitra SPPG MBG",
            "lokasi": "Ciamis, Jawa Barat",
            "afiliasi_politik": "Ketua adalah Anggota DPRD Aktif (PAN)",
            "red_flag": "Keterlibatan aktif aktor politik daerah dalam distribusi program nasional."
        },
        "sumber": ["https://tempo.co", "https://antikorupsi.org"]
    }
}

ID_MAPPING = {
    "bgn-001": "org-bgn",
    "pangan": "org-agrinas-pangan",
    "pt-agrinas": "org-agrinas",
    "mbg": "proj-mbg",
    "program-mbg": "proj-mbg",
    "person-001": "person-dadan",
    "person-009": "person-shoraya",
    "org-001": "org-peruri",
    "org-002": "org-pds",
    "org-yasa-artha": "org-yasa",
    "org-adlas-sarana": "org-adlas",
    "org-lazuardi": "org-icw-001",
    "org-ifsr": "org-icw-002"
}

const { useState, useEffect, useMemo, useRef } = React;

const DATA = window.INVESTIGATION_DATA;

// ─── Small UI atoms ──────────────────────────────────────────────────────────
const Mono = ({ children, className = "", style }) => (
  <span className={`font-mono ${className}`} style={style}>{children}</span>
);

const Eyebrow = ({ children, color = "ink" }) => (
  <span className={`eyebrow eyebrow-${color}`}>{children}</span>
);

const Rule = ({ weight = 1, className = "" }) => (
  <div className={`rule rule-${weight} ${className}`} />
);

const StatusPill = ({ level }) => {
  const styles = {
    CRITICAL: { bg: "var(--ink)", fg: "var(--paper)", dot: "var(--flag)" },
    ACTIVE: { bg: "transparent", fg: "var(--ink)", dot: "var(--flag)", border: "var(--ink)" },
    VERIFIED: { bg: "transparent", fg: "var(--ink-2)", dot: "var(--ink-3)", border: "var(--ink-3)" },
    HIGH: { bg: "var(--flag)", fg: "var(--paper)", dot: "transparent" },
    MED: { bg: "transparent", fg: "var(--ink-2)", border: "var(--ink-3)", dot: "transparent" },
  }[level] || { bg: "transparent", fg: "var(--ink)" };
  return (
    <span className="status-pill" style={{
      background: styles.bg, color: styles.fg,
      border: styles.border ? `1px solid ${styles.border}` : "none",
    }}>
      {styles.dot !== "transparent" && <span className="status-dot" style={{ background: styles.dot }} />}
      {level}
    </span>
  );
};

// ─── Header ─────────────────────────────────────────────────────────────────
function Header({ route, setRoute }) {
  const items = [
    { id: "home", label: "Beranda" },
    { id: "mbg", label: "MBG" },
    { id: "bgn", label: "BGN" },
    { id: "kmp", label: "KMP" },
    { id: "aktor", label: "Aktor" },
    { id: "jaringan", label: "Jaringan" },
    { id: "metode", label: "Metode" },
  ];
  return (
    <header className="masthead">
      <div className="mast-top">
        <div className="mast-date">
          <Mono>{DATA.stats.lastUpdate.replace(/-/g, ".")}</Mono>
          <span className="mast-sep">·</span>
          <Mono>EDISI 01</Mono>
          <span className="mast-sep">·</span>
          <Mono>JAKARTA</Mono>
        </div>
        <div className="mast-live">
          <span className="live-dot" />
          <Mono>LIVE MONITORING</Mono>
        </div>
      </div>
      <div className="mast-brand" onClick={() => setRoute("home")}>
        <div className="brand-mark">
          <span className="brand-stamp">ARSIP</span>
          <span className="brand-no">№ 01</span>
        </div>
        <h1 className="brand-title">Koneksi<span className="brand-dot">.</span>id</h1>
        <div className="brand-tag">
          <Mono>OPEN-SOURCE DOSSIER · AUDIT JARINGAN KEKUASAAN</Mono>
        </div>
      </div>
      <nav className="mast-nav">
        {items.map((it) => (
          <button key={it.id}
            className={`nav-item ${route === it.id ? "nav-active" : ""}`}
            onClick={() => setRoute(it.id)}>
            {it.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

// ─── Home ───────────────────────────────────────────────────────────────────
function HomePage({ setRoute }) {
  return (
    <>
      <Hero setRoute={setRoute} />
      <StatStrip />
      <FeaturedLead setRoute={setRoute} />
      <DossiersGrid setRoute={setRoute} />
      <TimelineBand />
      <ActorsStrip setRoute={setRoute} />
      <MethodFooter setRoute={setRoute} />
    </>
  );
}

function Hero({ setRoute }) {
  return (
    <section className="hero">
      <div className="hero-meta">
        <Eyebrow color="flag">Investigasi Utama</Eyebrow>
        <Mono className="hero-tag">RILIS TERBUKA · 12 APR 2026</Mono>
      </div>
      <h2 className="hero-title">
        Siapa di balik <em>proyek pemerintahmu?</em>
      </h2>
      <p className="hero-deck">
        Audit jaringan Makan Bergizi Gratis, Koperasi Merah Putih, dan Badan Gizi
        Nasional — tiga proyek strategis senilai <b>Rp 545&nbsp;triliun</b> yang
        mengalir ke satu kluster yayasan, partai, dan lingkar pertemanan presiden.
      </p>
      <div className="hero-cta">
        <button className="btn btn-ink" onClick={() => setRoute("mbg")}>
          Buka Dossier 01 <span className="arrow">→</span>
        </button>
        <button className="btn btn-ghost" onClick={() => setRoute("jaringan")}>
          Lihat peta jaringan
        </button>
      </div>
    </section>
  );
}

function StatStrip() {
  const cells = [
    { k: "Entitas terpetakan", v: DATA.stats.entities },
    { k: "Relasi terverifikasi", v: DATA.stats.relations },
    { k: "Indikasi red-flag", v: DATA.stats.redFlags, flag: true },
    { k: "Unit SPPG", v: DATA.stats.sppg.toLocaleString("id-ID") },
    { k: "Yayasan terafiliasi parpol", v: DATA.stats.yayasanParpol },
  ];
  return (
    <section className="stat-strip">
      {cells.map((c, i) => (
        <div key={i} className={`stat-cell ${c.flag ? "stat-flag" : ""}`}>
          <div className="stat-v">{c.v}</div>
          <Mono className="stat-k">{c.k}</Mono>
        </div>
      ))}
    </section>
  );
}

function FeaturedLead({ setRoute }) {
  return (
    <section className="lead">
      <div className="lead-left">
        <Eyebrow color="flag">Temuan Utama</Eyebrow>
        <h3 className="lead-title">
          Satu yayasan Kementerian Pertahanan mengendalikan tiga jalur
          anggaran negara sekaligus.
        </h3>
        <div className="lead-body">
          <p>
            <b>YPPSDP</b> — Yayasan Pengembangan Potensi Sumber Daya Pertahanan —
            berdiri sejak 1983 sebagai yayasan purnawirawan. Sejak 2020,
            strukturnya berubah: kini menguasai 99% PT Agrinas (kontraktor utama
            Koperasi Merah Putih, Rp 128 T), 99,8% PT TMI (broker alutsista draft
            Perpres USD 124,99 miliar), dan tercatat sebagai mitra program Makan
            Bergizi Gratis.
          </p>
          <p>
            Ketua Pembina yayasan ini adalah <b>Presiden Prabowo Subianto</b>.
            Ketuanya, <b>Musa Bangun</b>, merangkap Waketum Gerindra dan Komut
            Inalum. Menteri Pertahanannya, <b>Sjafrie Sjamsoeddin</b>, duduk
            sebagai Ketua Pembina ex-officio. Seluruh direksi TMI adalah teman
            seangkatan Prabowo di AKABRI 1970 atau kader aktif Gerindra.
          </p>
          <p className="lead-pullout">
            <Mono>PBHI + ICW + Imparsial</Mono> telah melaporkan skema penunjukan
            langsung ini ke Ombudsman RI pada Februari 2024 atas dugaan
            maladministrasi. Belum ada putusan.
          </p>
        </div>
        <button className="link-arrow" onClick={() => setRoute("kmp")}>
          Baca Dossier 03 — KMP & Agrinas <span className="arrow">→</span>
        </button>
      </div>
      <div className="lead-right">
        <div className="placeholder-frame">
          <Mono className="ph-tag">[ YPPSDP SUPER-NODE · DIAGRAM ]</Mono>
          <NodeSketch />
          <Mono className="ph-cap">3 vehicle · 1 yayasan · 1 ketua pembina</Mono>
        </div>
      </div>
    </section>
  );
}

function NodeSketch() {
  // Minimalist static SVG — just circles, lines, labels (allowed: circles, squares)
  return (
    <svg viewBox="0 0 360 260" className="node-sketch">
      <defs>
        <pattern id="diag" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink-3)" strokeWidth="1" />
        </pattern>
      </defs>
      {/* connecting lines */}
      <line x1="180" y1="80" x2="80" y2="200" stroke="var(--ink)" strokeWidth="1" />
      <line x1="180" y1="80" x2="180" y2="200" stroke="var(--ink)" strokeWidth="1" />
      <line x1="180" y1="80" x2="280" y2="200" stroke="var(--ink)" strokeWidth="1" />
      {/* center node: YPPSDP */}
      <circle cx="180" cy="80" r="42" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="180" cy="80" r="42" fill="url(#diag)" opacity="0.4" />
      <text x="180" y="76" textAnchor="middle" className="sk-label-b">YPPSDP</text>
      <text x="180" y="92" textAnchor="middle" className="sk-label-s">Yayasan · 1983</text>
      {/* leaf nodes */}
      {[
        { x: 80, y: 220, label: "AGRINAS", sub: "Rp 128 T · KMP" },
        { x: 180, y: 220, label: "PT TMI", sub: "USD 124,99 M" },
        { x: 280, y: 220, label: "MITRA MBG", sub: "SPPG · Rp 71 T" },
      ].map((n, i) => (
        <g key={i}>
          <rect x={n.x - 48} y={n.y - 22} width="96" height="44" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1" />
          <text x={n.x} y={n.y - 4} textAnchor="middle" className="sk-label-b">{n.label}</text>
          <text x={n.x} y={n.y + 12} textAnchor="middle" className="sk-label-s">{n.sub}</text>
        </g>
      ))}
      {/* flag marker */}
      <circle cx="180" cy="80" r="5" fill="var(--flag)" />
    </svg>
  );
}

function DossiersGrid({ setRoute }) {
  return (
    <section className="dossiers">
      <div className="section-head">
        <Eyebrow color="flag">Pusat Investigasi Aktif</Eyebrow>
        <h3 className="section-title">Tiga Dossier, Satu Jaringan</h3>
      </div>
      <div className="dossier-grid">
        {DATA.dossiers.map((d) => (
          <article key={d.id} className="dossier-card" onClick={() => setRoute(d.id)}>
            <div className="dc-top">
              <Mono className="dc-code">{d.code}</Mono>
              <StatusPill level={d.status} />
            </div>
            <h4 className="dc-title">{d.title}</h4>
            <div className="dc-sub">{d.subtitle}</div>
            <p className="dc-kicker">{d.kicker}</p>
            <div className="dc-metrics">
              <div>
                <div className="metric-v">{d.budget}</div>
                <Mono className="metric-k">Anggaran</Mono>
              </div>
              <div>
                <div className="metric-v">{d.entities}</div>
                <Mono className="metric-k">Entitas</Mono>
              </div>
              <div>
                <div className="metric-v flag">{d.redFlags}</div>
                <Mono className="metric-k">Red flag</Mono>
              </div>
            </div>
            <Mono className="dc-sources">SUMBER · {d.sources}</Mono>
            <button className="dc-open">
              Buka dossier <span className="arrow">→</span>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function TimelineBand() {
  return (
    <section className="tl-band">
      <div className="section-head">
        <Eyebrow color="flag">Kronologi</Eyebrow>
        <h3 className="section-title">28 Bulan Jaringan Terbentuk</h3>
      </div>
      <div className="tl-track">
        <div className="tl-line" />
        {DATA.timeline.map((t, i) => (
          <div key={i} className="tl-item">
            <div className="tl-dot" />
            <Mono className="tl-date">{t.date}</Mono>
            <div className="tl-event">{t.event}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActorsStrip({ setRoute }) {
  return (
    <section className="actors-strip">
      <div className="section-head">
        <Eyebrow color="flag">Daftar Aktor</Eyebrow>
        <h3 className="section-title">Nama yang Muncul Berulang</h3>
        <button className="link-arrow" onClick={() => setRoute("aktor")}>
          Lihat semua aktor <span className="arrow">→</span>
        </button>
      </div>
      <div className="actor-list">
        {DATA.actors.slice(0, 6).map((a, i) => (
          <div key={i} className="actor-row">
            <Mono className="a-n">{String(i + 1).padStart(2, "0")}</Mono>
            <div className="a-name">{a.name}</div>
            <div className="a-role">{a.role}</div>
            <div className="a-flags">
              {a.flags.map((f) => <span key={f} className="flag-tag">{f}</span>)}
            </div>
            <StatusPill level={a.severity} />
          </div>
        ))}
      </div>
    </section>
  );
}

function MethodFooter({ setRoute }) {
  return (
    <section className="method-foot">
      <div className="mf-grid">
        <div>
          <Eyebrow>Metodologi</Eyebrow>
          <h3 className="section-title">Semua klaim bisa ditelusuri</h3>
          <p>
            Setiap temuan di dossier ini bersumber dari dokumen publik:
            AHU Online, LPSE, SiRUP LKPP, putusan pengadilan, audit BPK, dan
            liputan media ternama (Tempo, Kompas, BBC, ICW, The Gecko Project).
            Platform ini bukan alat penuntutan — ini peta dokumen untuk publik.
          </p>
        </div>
        <div className="mf-cta">
          <button className="btn btn-ink" onClick={() => setRoute("metode")}>Baca metodologi</button>
          <button className="btn btn-ghost" onClick={() => setRoute("jaringan")}>Lihat jaringan</button>
        </div>
      </div>
      <Rule />
      <div className="mf-disclaimer">
        <Mono>
          DISCLAIMER — Analisis berbasis dokumen publik yang disajikan "sebagaimana
          adanya". Bukan merupakan putusan atau tuduhan hukum. Setiap nama,
          angka, dan relasi dapat dikonfirmasi via tautan sumber di masing-masing
          dossier.
        </Mono>
      </div>
    </section>
  );
}

// ─── Dossier detail ─────────────────────────────────────────────────────────
function DossierPage({ id, setRoute }) {
  const d = DATA.dossiers.find((x) => x.id === id);
  if (!d) return null;
  const idx = DATA.dossiers.findIndex((x) => x.id === id);
  const next = DATA.dossiers[(idx + 1) % DATA.dossiers.length];

  return (
    <article className="dossier-page" data-screen-label={`Dossier ${d.code}`}>
      <div className="dp-head">
        <div className="dp-crumbs">
          <button className="crumb" onClick={() => setRoute("home")}>Beranda</button>
          <span>/</span>
          <Mono>{d.code}</Mono>
        </div>
        <div className="dp-statusrow">
          <StatusPill level={d.status} />
          <Mono className="dp-updated">DIPERBARUI {DATA.stats.lastUpdate.replace(/-/g, ".")}</Mono>
        </div>
      </div>
      <Rule weight={2} />

      <header className="dp-hero">
        <div className="dp-kicker">
          <Mono>{d.code}</Mono>
          <span className="dp-sep">·</span>
          <Mono className="dp-sev">SEVERITY {d.severity}</Mono>
        </div>
        <h1 className="dp-title">{d.title}</h1>
        <div className="dp-sub">{d.subtitle}</div>
        <p className="dp-lede">{d.kicker}</p>
        <div className="dp-budget">
          <div>
            <Mono className="bk">Anggaran</Mono>
            <div className="bv">{d.budget}</div>
            <Mono className="bn">{d.budgetNote}</Mono>
          </div>
          <div>
            <Mono className="bk">Entitas terpetakan</Mono>
            <div className="bv">{d.entities}</div>
          </div>
          <div>
            <Mono className="bk">Red flag</Mono>
            <div className="bv flag">{d.redFlags}</div>
          </div>
        </div>
        <Mono className="dp-sources">SUMBER · {d.sources}</Mono>
      </header>

      <Rule />

      <section className="dp-keyfacts">
        <Eyebrow color="flag">Fakta Kunci</Eyebrow>
        <div className="kf-grid">
          {d.keyFacts.map((f, i) => (
            <div key={i} className="kf-cell">
              <div className="kf-v">{f.value}</div>
              <div className="kf-l">{f.label}</div>
              <Mono className="kf-n">{f.note}</Mono>
            </div>
          ))}
        </div>
      </section>

      <Rule />

      <section className="dp-findings">
        <Eyebrow color="flag">Temuan</Eyebrow>
        <h2 className="findings-title">Yang ditemukan di dokumen</h2>
        <ol className="findings-list">
          {d.findings.map((f, i) => (
            <li key={i} className="finding">
              <div className="f-no">
                <Mono>{f.n}</Mono>
                <div className="f-tag">{f.tag}</div>
              </div>
              <div className="f-body">
                <h3 className="f-title">{f.title}</h3>
                <p className="f-text">{f.body}</p>
                <Mono className="f-src">SUMBER · {f.source}</Mono>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Rule />

      <section className="dp-network">
        <Eyebrow color="flag">Jaringan Entitas</Eyebrow>
        <h2 className="findings-title">{d.network.length} simpul utama</h2>
        <div className="net-list">
          {d.network.map((n, i) => (
            <div key={i} className="net-chip">
              <Mono className="net-n">{String(i + 1).padStart(2, "0")}</Mono>
              {n}
            </div>
          ))}
        </div>
        <button className="link-arrow" onClick={() => setRoute("jaringan")}>
          Lihat peta jaringan lengkap <span className="arrow">→</span>
        </button>
      </section>

      <Rule weight={2} />

      <footer className="dp-foot">
        <div>
          <Eyebrow>Lanjutkan</Eyebrow>
          <h3 className="dp-next-title">{next.code} — {next.title}</h3>
          <p className="dp-next-sub">{next.subtitle}</p>
        </div>
        <button className="btn btn-ink" onClick={() => setRoute(next.id)}>
          Buka dossier berikutnya <span className="arrow">→</span>
        </button>
      </footer>
    </article>
  );
}

// ─── Actors page ────────────────────────────────────────────────────────────
function ActorsPage() {
  const [filter, setFilter] = useState("ALL");
  const filtered = DATA.actors.filter((a) =>
    filter === "ALL" ? true : a.flags.includes(filter)
  );
  return (
    <section className="actors-page">
      <div className="dp-crumbs"><Mono>INDEKS · AKTOR</Mono></div>
      <Rule weight={2} />
      <header className="ap-hero">
        <h1 className="dp-title">Indeks Aktor</h1>
        <p className="dp-lede">
          {DATA.actors.length} nama yang muncul berulang di ketiga dossier —
          dengan jabatan aktif, afiliasi partai, dan relevansi terhadap red-flag.
        </p>
      </header>
      <div className="filter-bar">
        {["ALL", "MBG", "BGN", "KMP"].map((f) => (
          <button key={f}
            className={`chip ${filter === f ? "chip-active" : ""}`}
            onClick={() => setFilter(f)}>
            {f === "ALL" ? "Semua" : f}
          </button>
        ))}
      </div>
      <Rule />
      <div className="actor-list actor-list-full">
        {filtered.map((a, i) => (
          <div key={i} className="actor-row">
            <Mono className="a-n">{String(i + 1).padStart(2, "0")}</Mono>
            <div className="a-main">
              <div className="a-name">{a.name}</div>
              <div className="a-role">{a.role}</div>
              <div className="a-note">{a.note}</div>
            </div>
            <div className="a-flags">
              {a.flags.map((f) => <span key={f} className="flag-tag">{f}</span>)}
            </div>
            <StatusPill level={a.severity} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Network page ───────────────────────────────────────────────────────────
function NetworkPage() {
  const [selected, setSelected] = useState(null);

  // Node layout — hand-placed for a curated editorial diagram
  const nodes = [
    { id: "prabowo", label: "Prabowo Subianto", sub: "Presiden · Ketua Pembina YPPSDP", x: 500, y: 110, type: "person", flag: true, dossier: "KMP" },
    { id: "yppsdp", label: "YPPSDP", sub: "Yayasan · Super-node", x: 500, y: 260, type: "org", flag: true, dossier: "KMP" },
    { id: "agrinas", label: "PT Agrinas", sub: "Kontraktor KMP Rp 128 T", x: 260, y: 410, type: "org", flag: true, dossier: "KMP" },
    { id: "tmi", label: "PT TMI", sub: "Broker alutsista", x: 500, y: 410, type: "org", flag: true, dossier: "KMP" },
    { id: "gsn", label: "Yayasan GSN", sub: "Mitra SPPG MBG", x: 740, y: 410, type: "org", flag: true, dossier: "MBG" },
    { id: "kmp", label: "Program KMP", sub: "80.081 unit · Rp 210 T", x: 130, y: 560, type: "project", flag: true, dossier: "KMP" },
    { id: "mbg", label: "Program MBG", sub: "Rp 335 T · 82,9 jt sasaran", x: 740, y: 560, type: "project", flag: true, dossier: "MBG" },
    { id: "bgn", label: "BGN", sub: "Regulator MBG", x: 900, y: 410, type: "org", flag: false, dossier: "BGN" },
    { id: "peruri", label: "Peruri / PDS", sub: "Kontrak Rp 600 M", x: 1060, y: 560, type: "org", flag: true, dossier: "BGN" },
    { id: "danantara", label: "Danantara", sub: "Pendana · USD 900 M", x: 300, y: 710, type: "org", flag: true, dossier: "KMP" },
    { id: "burhan", label: "Burhanuddin Abdullah", sub: "Eks-napi · Ketua Danantara", x: 130, y: 710, type: "person", flag: true, dossier: "MBG" },
    { id: "hashim", label: "Hashim Djojohadikusumo", sub: "Adik Presiden · Utusan Khusus", x: 900, y: 260, type: "person", flag: true, dossier: "MBG" },
    { id: "sjafrie", label: "Sjafrie Sjamsoeddin", sub: "Menhan · Ketua Pembina YPPSDP", x: 320, y: 110, type: "person", flag: true, dossier: "KMP" },
    { id: "musa", label: "Musa Bangun", sub: "Waketum Gerindra · Ketua YPPSDP", x: 680, y: 110, type: "person", flag: true, dossier: "KMP" },
    { id: "shoraya", label: "Shoraya L.", sub: "CEO PT IMI & NSP · Rp 695 M", x: 1060, y: 410, type: "person", flag: true, dossier: "BGN" },
    { id: "setiaji", label: "Setiaji", sub: "DTO Kemenkes · Komut PDS", x: 1180, y: 660, type: "person", flag: true, dossier: "BGN" },
    { id: "dirgayuza", label: "Dirgayuza", sub: "Asisten Khusus Presiden", x: 440, y: 710, type: "person", flag: true, dossier: "KMP" },
  ];

  const edges = [
    ["prabowo", "yppsdp", "Ketua Pembina"],
    ["sjafrie", "yppsdp", "Ketua Pembina ex-officio"],
    ["musa", "yppsdp", "Ketua"],
    ["yppsdp", "agrinas", "99% saham"],
    ["yppsdp", "tmi", "99,8% saham"],
    ["yppsdp", "gsn", "mitra"],
    ["agrinas", "kmp", "kontraktor"],
    ["gsn", "mbg", "mitra SPPG"],
    ["bgn", "mbg", "regulator"],
    ["bgn", "peruri", "kontrak Rp 600 M"],
    ["peruri", "setiaji", "komisaris utama"],
    ["danantara", "kmp", "pendanaan"],
    ["danantara", "agrinas", "pendanaan"],
    ["burhan", "danantara", "ketua tim pakar"],
    ["prabowo", "hashim", "saudara"],
    ["hashim", "gsn", "pengurus"],
    ["prabowo", "gsn", "pendiri"],
    ["shoraya", "bgn", "vendor"],
    ["shoraya", "agrinas", "vendor"],
    ["dirgayuza", "prabowo", "asisten khusus"],
    ["dirgayuza", "agrinas", "eks direktur"],
  ];

  const nById = (id) => nodes.find((n) => n.id === id);
  const selNode = selected ? nById(selected) : null;
  const relatedIds = useMemo(() => {
    if (!selected) return new Set();
    const s = new Set([selected]);
    edges.forEach(([a, b]) => {
      if (a === selected) s.add(b);
      if (b === selected) s.add(a);
    });
    return s;
  }, [selected]);

  return (
    <section className="network-page">
      <div className="dp-crumbs"><Mono>PETA · JARINGAN KEKUASAAN</Mono></div>
      <Rule weight={2} />
      <header className="ap-hero">
        <h1 className="dp-title">Peta Jaringan</h1>
        <p className="dp-lede">
          Simpul merah = red-flag aktif. Klik simpul untuk melihat detail dan
          relasi langsung. Semua edge dapat ditelusuri ke dokumen sumber di
          masing-masing dossier.
        </p>
      </header>
      <div className="net-legend">
        <span><span className="lg-sw person" /> Orang</span>
        <span><span className="lg-sw org" /> Organisasi</span>
        <span><span className="lg-sw project" /> Program</span>
        <span><span className="lg-sw flag" /> Red-flag</span>
      </div>
      <div className="net-wrap">
        <svg viewBox="0 0 1280 820" className="net-svg">
          <defs>
            <pattern id="gridP" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="transparent" />
              <circle cx="0" cy="0" r="0.6" fill="var(--ink-3)" opacity="0.25" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="1280" height="820" fill="url(#gridP)" />
          {edges.map(([a, b, label], i) => {
            const na = nById(a), nb = nById(b);
            const active = !selected || relatedIds.has(a) && relatedIds.has(b);
            const mx = (na.x + nb.x) / 2, my = (na.y + nb.y) / 2;
            return (
              <g key={i} opacity={active ? 1 : 0.12}>
                <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke="var(--ink)" strokeWidth="1" />
                <text x={mx} y={my - 4} textAnchor="middle" className="edge-label">{label}</text>
              </g>
            );
          })}
          {nodes.map((n) => {
            const active = !selected || relatedIds.has(n.id);
            const r = n.type === "person" ? 22 : n.type === "project" ? 28 : 26;
            return (
              <g key={n.id} opacity={active ? 1 : 0.2}
                style={{ cursor: "pointer" }}
                onClick={() => setSelected(selected === n.id ? null : n.id)}>
                {n.type === "person" ? (
                  <circle cx={n.x} cy={n.y} r={r} fill="var(--paper)" stroke={n.flag ? "var(--flag)" : "var(--ink)"} strokeWidth="1.5" />
                ) : n.type === "project" ? (
                  <g>
                    <polygon points={`${n.x - r},${n.y} ${n.x},${n.y - r} ${n.x + r},${n.y} ${n.x},${n.y + r}`}
                      fill="var(--paper)" stroke={n.flag ? "var(--flag)" : "var(--ink)"} strokeWidth="1.5" />
                  </g>
                ) : (
                  <rect x={n.x - r} y={n.y - r} width={r * 2} height={r * 2}
                    fill="var(--paper)" stroke={n.flag ? "var(--flag)" : "var(--ink)"} strokeWidth="1.5" />
                )}
                {n.flag && <circle cx={n.x + r - 4} cy={n.y - r + 4} r="3.5" fill="var(--flag)" />}
                {selected === n.id && (
                  <circle cx={n.x} cy={n.y} r={r + 6} fill="none" stroke="var(--ink)" strokeWidth="1" strokeDasharray="3 3" />
                )}
                <text x={n.x} y={n.y + r + 16} textAnchor="middle" className="node-label">{n.label}</text>
                <text x={n.x} y={n.y + r + 30} textAnchor="middle" className="node-sub">{n.sub}</text>
              </g>
            );
          })}
        </svg>
        {selNode && (
          <div className="net-detail">
            <div className="nd-top">
              <Mono className="nd-type">{selNode.type.toUpperCase()}</Mono>
              <button className="nd-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <h3 className="nd-name">{selNode.label}</h3>
            <div className="nd-sub">{selNode.sub}</div>
            <Rule />
            <Mono className="nd-k">Muncul di</Mono>
            <div className="nd-dossier">{selNode.dossier}</div>
            <Mono className="nd-k">Relasi langsung</Mono>
            <ul className="nd-rel">
              {edges.filter(([a, b]) => a === selNode.id || b === selNode.id).map(([a, b, label], i) => {
                const other = a === selNode.id ? b : a;
                return (
                  <li key={i}>
                    <Mono className="rl-label">{label}</Mono>
                    <span>→</span>
                    <button className="rl-target" onClick={() => setSelected(other)}>{nById(other).label}</button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Method page ────────────────────────────────────────────────────────────
function MethodPage() {
  return (
    <section className="method-page">
      <div className="dp-crumbs"><Mono>METODE · KREDIBILITAS</Mono></div>
      <Rule weight={2} />
      <header className="ap-hero">
        <h1 className="dp-title">Metodologi</h1>
        <p className="dp-lede">
          Semua yang muncul di Koneksi.id harus bisa ditelusuri kembali ke
          dokumen publik. Kalau tidak bisa, itu tidak tayang.
        </p>
      </header>
      <Rule />
      <div className="method-cols">
        <section>
          <Mono className="mc-n">01</Mono>
          <h3>Sumber Primer</h3>
          <ul>
            <li>AHU Online — profil badan hukum, pengurus, pemegang saham yayasan.</li>
            <li>LPSE & SIRUP LKPP — rencana umum pengadaan, paket kontrak, nilai.</li>
            <li>E-Purchasing LKPP — harga katalog vs harga pasar.</li>
            <li>Putusan pengadilan & register KPK — status terpidana, vonis, denda.</li>
            <li>Audit BPK-RI — temuan fiskal dan rekomendasi.</li>
          </ul>
        </section>
        <section>
          <Mono className="mc-n">02</Mono>
          <h3>Sumber Sekunder</h3>
          <ul>
            <li>Liputan investigasi Tempo, Kompas, BBC Indonesia, CNN Indonesia.</li>
            <li>Laporan ICW, Imparsial, CELIOS, The Gecko Project, PBHI.</li>
            <li>Dokumen resmi yayasan (YPPSDP, GSN, IFSR) dan BUMN.</li>
          </ul>
        </section>
        <section>
          <Mono className="mc-n">03</Mono>
          <h3>Deteksi Red-Flag</h3>
          <ul>
            <li>Tumpang tindih pengurus lintas entitas (conflict of interest).</li>
            <li>Rekam jejak hukum pengurus (terpidana aktif/bebas).</li>
            <li>Afiliasi partai politik pengurus yayasan mitra program.</li>
            <li>Pola revolving door antara regulator, kontraktor, dan istana.</li>
            <li>Anomali harga E-Purchasing terhadap harga pasar.</li>
          </ul>
        </section>
        <section>
          <Mono className="mc-n">04</Mono>
          <h3>Yang Kami Tidak Lakukan</h3>
          <ul>
            <li>Tidak memvonis. Ini peta dokumen, bukan putusan hukum.</li>
            <li>Tidak memuat klaim tanpa sumber yang dapat ditelusuri.</li>
            <li>Tidak menerima donasi dari partai, BUMN, atau kontraktor negara.</li>
            <li>Tidak membatasi akses — seluruh dataset tersedia JSON/CSV.</li>
          </ul>
        </section>
      </div>
      <Rule />
      <div className="method-disclaim">
        <Mono>
          DISCLAIMER — Setiap nama, angka, dan relasi dalam platform ini dapat
          dikonfirmasi via tautan sumber di masing-masing dossier. Ketidakakuratan
          data dapat dilaporkan untuk koreksi terbuka. Platform ini bersifat
          nirlaba dan independen.
        </Mono>
      </div>
    </section>
  );
}

// ─── Tweaks panel ────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "paper": "#F4F1EA",
  "ink": "#14110E",
  "flag": "#C72A1C",
  "display": "Fraunces",
  "body": "Instrument Sans",
  "mono": "JetBrains Mono",
  "density": "editorial"
}/*EDITMODE-END*/;

function TweaksPanel({ tweaks, setTweaks, visible }) {
  if (!visible) return null;
  const update = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  };
  const palettes = [
    { name: "Paper", paper: "#F4F1EA", ink: "#14110E", flag: "#C72A1C" },
    { name: "Carbon", paper: "#0E0E0C", ink: "#EDE7D9", flag: "#FF5A3C" },
    { name: "Cold", paper: "#ECEEEA", ink: "#0B1220", flag: "#B42318" },
    { name: "Redacted", paper: "#F3EFE4", ink: "#1A1A1A", flag: "#0B0B0B" },
  ];
  return (
    <div className="tweaks-panel">
      <div className="tp-title"><Mono>TWEAKS</Mono></div>
      <div className="tp-group">
        <Mono className="tp-k">Palet</Mono>
        <div className="tp-palettes">
          {palettes.map((p) => (
            <button key={p.name} className="tp-pal" onClick={() => {
              update("paper", p.paper); update("ink", p.ink); update("flag", p.flag);
            }}>
              <span className="pal-swatch" style={{ background: p.paper, borderColor: p.ink }} />
              <span className="pal-swatch" style={{ background: p.ink }} />
              <span className="pal-swatch" style={{ background: p.flag }} />
              <span className="pal-name">{p.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="tp-group">
        <Mono className="tp-k">Display Font</Mono>
        <div className="tp-row">
          {["Fraunces", "Playfair Display", "DM Serif Display", "Space Grotesk"].map((f) => (
            <button key={f} className={`tp-btn ${tweaks.display === f ? "on" : ""}`}
              onClick={() => update("display", f)}>{f}</button>
          ))}
        </div>
      </div>
      <div className="tp-group">
        <Mono className="tp-k">Body Font</Mono>
        <div className="tp-row">
          {["Instrument Sans", "Inter", "IBM Plex Sans", "Newsreader"].map((f) => (
            <button key={f} className={`tp-btn ${tweaks.body === f ? "on" : ""}`}
              onClick={() => update("body", f)}>{f}</button>
          ))}
        </div>
      </div>
      <div className="tp-group">
        <Mono className="tp-k">Accent Red-Flag</Mono>
        <div className="tp-row">
          {[
            { n: "Brick", v: "#C72A1C" },
            { n: "Flame", v: "#FF5A3C" },
            { n: "Ink", v: "#0B0B0B" },
            { n: "Sign", v: "#B42318" },
          ].map((c) => (
            <button key={c.n} className={`tp-chip ${tweaks.flag === c.v ? "on" : ""}`}
              onClick={() => update("flag", c.v)}>
              <span className="chip-sw" style={{ background: c.v }} /> {c.n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────
function App() {
  const [route, setRoute] = useState(() => {
    try { return localStorage.getItem("koneksi-route") || "home"; } catch { return "home"; }
  });
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [tweaksOn, setTweaksOn] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("koneksi-route", route); } catch {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [route]);

  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === "__activate_edit_mode") setTweaksOn(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOn(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--paper", tweaks.paper);
    r.style.setProperty("--ink", tweaks.ink);
    r.style.setProperty("--flag", tweaks.flag);
    r.style.setProperty("--font-display", `'${tweaks.display}', Georgia, serif`);
    r.style.setProperty("--font-body", `'${tweaks.body}', ui-sans-serif, system-ui, sans-serif`);
    r.style.setProperty("--font-mono", `'${tweaks.mono}', ui-monospace, monospace`);
  }, [tweaks]);

  const dossierIds = DATA.dossiers.map((d) => d.id);
  const page = (() => {
    if (route === "home") return <HomePage setRoute={setRoute} />;
    if (dossierIds.includes(route)) return <DossierPage id={route} setRoute={setRoute} />;
    if (route === "aktor") return <ActorsPage />;
    if (route === "jaringan") return <NetworkPage />;
    if (route === "metode") return <MethodPage />;
    return <HomePage setRoute={setRoute} />;
  })();

  return (
    <div className="shell" data-screen-label={`Route: ${route}`}>
      <Header route={route} setRoute={setRoute} />
      <main className="main">{page}</main>
      <footer className="foot">
        <Rule weight={2} />
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="brand-title small">Koneksi<span className="brand-dot">.</span>id</div>
            <Mono>OPEN-SOURCE DOSSIER · 2026</Mono>
          </div>
          <div className="foot-col">
            <Mono className="fc-k">Dossier</Mono>
            {DATA.dossiers.map((d) => (
              <button key={d.id} onClick={() => setRoute(d.id)}>{d.title}</button>
            ))}
          </div>
          <div className="foot-col">
            <Mono className="fc-k">Telusuri</Mono>
            <button onClick={() => setRoute("aktor")}>Indeks aktor</button>
            <button onClick={() => setRoute("jaringan")}>Peta jaringan</button>
            <button onClick={() => setRoute("metode")}>Metodologi</button>
          </div>
          <div className="foot-col">
            <Mono className="fc-k">Disclaimer</Mono>
            <p>
              Analisis berbasis dokumen publik. Bukan putusan atau tuduhan
              hukum. Koreksi terbuka untuk publik.
            </p>
          </div>
        </div>
      </footer>
      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweaksOn} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

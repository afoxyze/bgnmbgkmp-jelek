// Preview renderer — produces the exact DOM that the Next.js components output.
// No framework; tokens, spacing, and class names are identical to the React versions.

const $ = (sel, root = document) => root.querySelector(sel);
const h = (tag, props = {}, ...children) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (k === "style" && typeof v === "object") Object.assign(el.style, v);
    else if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== null && v !== undefined && v !== false) el.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return el;
};

const SEV = {
  CRITICAL: { fg: "var(--accent-danger)", bg: "var(--accent-danger-bg)" },
  ACTIVE:   { fg: "var(--accent-danger)", bg: "var(--bg-surface-2)" },
  VERIFIED: { fg: "var(--text-primary)",  bg: "var(--bg-surface-2)" },
};

// ── Breadcrumb ───────────────────────────────────────────────────────────────
function renderBreadcrumb(d) {
  return h("nav", { style: {
    display: "flex", gap: "0.75rem", alignItems: "center", padding: "1.5rem 0",
    fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.688rem",
    letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)",
  }},
    h("a", { href: "#", style: { color: "var(--text-tertiary)" } }, "Beranda"),
    h("span", { style: { opacity: 0.5 } }, "/"),
    h("span", {}, "Dossier"),
    h("span", { style: { opacity: 0.5 } }, "/"),
    h("span", { style: { color: "var(--accent-danger)" } }, d.code),
    h("span", { style: { flex: 1 } }),
    h("span", { style: { fontSize: "0.625rem" } }, "Diperbarui " + d.tanggalRiset),
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function renderHero(d) {
  const metaRow = h("div", { style: {
    display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap",
    fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.688rem",
    letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-tertiary)",
    marginBottom: "1.5rem",
  }},
    h("span", { style: { color: "var(--accent-danger)", fontWeight: 700 } }, d.code),
    h("span", { style: { opacity: 0.4 } }, "·"),
    h("span", {}, d.categoryLong),
  );

  const title = h("h1", { style: {
    fontFamily: "'IBM Plex Serif', Georgia, serif",
    fontSize: "clamp(2.25rem, 6.5vw, 4.25rem)", fontWeight: 700,
    lineHeight: 1.02, letterSpacing: "-0.03em", color: "var(--text-primary)",
    margin: "0 0 1rem", maxWidth: "900px", textWrap: "balance",
  }}, d.title);

  const subtitle = h("p", { style: {
    fontFamily: "'IBM Plex Serif', Georgia, serif", fontStyle: "italic",
    fontSize: "clamp(1.125rem, 2vw, 1.5rem)", lineHeight: 1.4,
    color: "var(--text-secondary)", margin: "0 0 2rem", maxWidth: "780px", textWrap: "pretty",
  }}, d.subtitle);

  const ledeP = h("p", { style: {
    fontSize: "1.0625rem", lineHeight: 1.65, color: "var(--text-primary)",
    margin: 0, maxWidth: "720px",
  }});
  ledeP.appendChild(h("span", { style: {
    fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: "3.75rem",
    float: "left", lineHeight: 0.9, padding: "0.25rem 0.5rem 0 0",
    color: "var(--accent-danger)", fontWeight: 700,
  }}, d.lede.charAt(0)));
  ledeP.appendChild(document.createTextNode(d.lede.slice(1)));

  const aside = h("aside", { style: {
    borderLeft: "2px solid var(--accent-danger)", paddingLeft: "1.25rem", alignSelf: "start",
  }},
    h("div", { style: {
      fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem",
      letterSpacing: "0.14em", textTransform: "uppercase",
      color: "var(--text-tertiary)", marginBottom: "0.5rem",
    }}, "Angka Utama"),
    h("div", { style: {
      fontFamily: "'IBM Plex Serif', Georgia, serif",
      fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 700, lineHeight: 1,
      letterSpacing: "-0.02em", color: "var(--accent-danger)", marginBottom: "0.5rem",
    }}, d.anggaranFokus),
    h("div", { style: { fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4 }}, d.anggaranLabel),
    h("div", { style: {
      marginTop: "0.75rem", fontFamily: "'IBM Plex Mono', monospace",
      fontSize: "0.625rem", color: "var(--text-tertiary)", letterSpacing: "0.06em",
    }}, "STATUS: " + d.status),
  );

  const ledeGrid = h("div", { class: "dossier-lede-grid", style: {
    display: "grid", gridTemplateColumns: "minmax(0, 720px) 1fr", gap: "3rem",
  }}, ledeP, aside);

  return h("section", { style: { padding: "2rem 0 3rem", borderBottom: "1px solid var(--border-base)" }},
    metaRow, title, subtitle, ledeGrid,
  );
}

// ── Key facts grid ───────────────────────────────────────────────────────────
function renderFacts(d) {
  const cells = [
    { v: d.facts.entities, k: "Entitas Terpetakan", danger: false },
    { v: d.facts.relations, k: "Relasi Ditemukan", danger: false },
    { v: d.facts.redFlagsHigh, k: "Red Flag — HIGH", danger: true },
    { v: d.facts.redFlagsMedium, k: "Red Flag — MEDIUM", danger: false },
  ];
  const grid = h("div", { class: "dossier-facts-grid", style: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    borderTop: "1px solid var(--text-primary)", borderBottom: "1px solid var(--text-primary)",
  }});
  cells.forEach((c, i) => {
    grid.appendChild(h("div", { style: {
      padding: "1.5rem 1.25rem",
      borderRight: i < cells.length - 1 ? "1px solid var(--border-base)" : "none",
      background: c.danger ? "var(--accent-danger-bg)" : "transparent",
    }},
      h("div", { style: {
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
        fontWeight: 600, lineHeight: 1,
        color: c.danger ? "var(--accent-danger)" : "var(--text-primary)",
        marginBottom: "0.625rem",
      }}, String(c.v)),
      h("div", { style: {
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem",
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: c.danger ? "var(--accent-danger)" : "var(--text-secondary)",
      }}, c.k),
    ));
  });
  return h("section", { style: { padding: "2rem 0 0" }},
    grid,
    h("div", { style: {
      marginTop: "0.75rem", fontFamily: "'IBM Plex Mono', monospace",
      fontSize: "0.625rem", color: "var(--text-tertiary)", letterSpacing: "0.08em",
    }}, "KATEGORI: " + d.categoryLong.toUpperCase()),
  );
}

// ── Section header helper ────────────────────────────────────────────────────
function sectionHeader(title, count, countLabel = "") {
  return h("header", { style: { marginBottom: "1.5rem", display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap" }},
    h("h2", { style: {
      fontFamily: "'IBM Plex Serif', Georgia, serif",
      fontSize: "clamp(1.5rem, 3.2vw, 2.25rem)", fontWeight: 700,
      letterSpacing: "-0.02em", color: "var(--text-primary)", margin: 0,
    }}, title),
    h("span", { style: { flex: 1, height: "1px", background: "var(--border-base)" }}),
    h("span", { style: {
      fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem",
      letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-tertiary)",
    }}, count + " " + countLabel),
  );
}

// ── Findings list ────────────────────────────────────────────────────────────
function renderFindings(d) {
  const ol = h("ol", { style: { listStyle: "none", padding: 0, margin: 0 }});
  d.findings.forEach((f, i) => {
    const last = i === d.findings.length - 1;
    const chips = [];
    (f.relFlags || []).forEach(rf => {
      chips.push(h("span", { style: {
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem",
        letterSpacing: "0.08em", padding: "0.25rem 0.5rem",
        background: "var(--accent-danger)",
        color: "white",
        fontWeight: 700,
      }}, "⚑ " + rf.id.toUpperCase()));
    });
    (f.relEntities || []).forEach(e => {
      chips.push(h("span", { style: {
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem",
        letterSpacing: "0.06em", padding: "0.25rem 0.5rem",
        border: "1px solid var(--border-strong)", color: "var(--text-secondary)",
      }}, e));
    });

    ol.appendChild(h("li", { class: "dossier-finding", style: {
      display: "grid", gridTemplateColumns: "100px minmax(0, 1fr)", gap: "2rem",
      padding: "2rem 0",
      borderBottom: last ? "2px solid var(--text-primary)" : "1px solid var(--border-subtle)",
    }},
      h("div", {},
        h("div", { style: {
          fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: "3rem",
          fontWeight: 500, lineHeight: 1, color: "var(--accent-danger)", marginBottom: "0.5rem",
        }}, String(i + 1).padStart(2, "0")),
        h("div", { style: {
          fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem",
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--text-primary)", fontWeight: 700,
          borderTop: "1px solid var(--text-primary)", paddingTop: "0.5rem",
        }}, f.tag),
      ),
      h("div", {},
        h("h3", { style: {
          fontFamily: "'IBM Plex Serif', Georgia, serif",
          fontSize: "clamp(1.125rem, 2vw, 1.5rem)", fontWeight: 700,
          lineHeight: 1.25, letterSpacing: "-0.015em",
          color: "var(--text-primary)", margin: "0 0 0.75rem", textWrap: "balance",
        }}, f.title),
        h("p", { style: { fontSize: "1rem", lineHeight: 1.65, color: "var(--text-secondary)", margin: "0 0 1rem" }}, f.body),
        chips.length > 0 ? h("div", { style: { display: "flex", gap: "0.5rem", flexWrap: "wrap", paddingTop: "0.5rem" }}, ...chips) : null,
      ),
    ));
  });
  return h("section", { style: { padding: "3rem 0 2rem", borderTop: "1px solid var(--border-base)" }},
    sectionHeader("Temuan Kunci", String(d.findings.length).padStart(2, "0"), "temuan"),
    ol,
  );
}

// ── Timeline ─────────────────────────────────────────────────────────────────
function renderTimeline(d) {
  const grid = h("div", { style: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    borderTop: "1px solid var(--text-primary)",
  }});
  d.timeline.forEach(ev => {
    grid.appendChild(h("article", { style: {
      padding: "1.25rem 1rem 1.5rem",
      borderRight: "1px solid var(--border-base)", borderBottom: "1px solid var(--border-base)",
      position: "relative",
    }},
      h("span", { style: {
        position: "absolute", top: "-5px", left: "1rem",
        width: "9px", height: "9px", background: "var(--accent-danger)",
      }}),
      h("div", { style: {
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem",
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--accent-danger)", fontWeight: 700, marginBottom: "0.625rem",
      }}, ev.date),
      h("p", { style: { fontSize: "0.875rem", lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 0.5rem" }}, ev.event),
      ev.source ? h("div", { style: {
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem",
        color: "var(--text-tertiary)", letterSpacing: "0.06em",
      }}, "src: " + ev.source) : null,
    ));
  });
  return h("section", { style: { padding: "3rem 0", borderTop: "1px solid var(--border-base)" }},
    sectionHeader("Kronologi", d.timeline.length, "peristiwa"),
    grid,
  );
}

// ── Actors ───────────────────────────────────────────────────────────────────
function renderActorColumn(title, entities) {
  const col = h("div", {},
    h("header", { style: {
      display: "flex", alignItems: "baseline", gap: "0.5rem",
      padding: "0.75rem 0", borderBottom: "1.5px solid var(--text-primary)", marginBottom: "0.25rem",
    }},
      h("h3", { style: {
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.688rem",
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--text-primary)", fontWeight: 700, margin: 0,
      }}, title),
      h("span", { style: {
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem", color: "var(--text-tertiary)",
      }}, String(entities.length).padStart(2, "0")),
    ),
  );
  if (entities.length === 0) {
    col.appendChild(h("p", { style: { fontSize: "0.75rem", color: "var(--text-tertiary)", fontStyle: "italic", margin: "0.75rem 0" }}, "—"));
    return col;
  }
  entities.forEach(e => {
    col.appendChild(h("a", { class: "actor-row", href: "#", style: {
      display: "grid", gridTemplateColumns: "1.4fr 1fr auto", gap: "1rem",
      alignItems: "center", padding: "1rem 0.25rem",
      borderBottom: "1px solid var(--border-subtle)", color: "inherit",
    }},
      h("div", {},
        h("div", { class: "a-name", style: {
          fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: "1.0625rem",
          fontWeight: 600, letterSpacing: "-0.01em",
          color: "var(--text-primary)", marginBottom: "0.125rem",
          transition: "color 0.12s",
        }}, e.name),
        e.role ? h("div", { style: { fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.45 }}, e.role) : null,
      ),
      h("div", {},
        e.flag ? h("span", { style: {
          fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem",
          letterSpacing: "0.08em", padding: "0.188rem 0.5rem",
          background: "var(--accent-danger-bg)", color: "var(--accent-danger)",
          fontWeight: 700, border: "1px solid var(--accent-danger)",
        }}, "⚑ RED FLAG") : null,
      ),
      h("span", { style: { fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.75rem", color: "var(--text-tertiary)" }}, "→"),
    ));
  });
  return col;
}

function renderActors(d) {
  return h("section", { style: { padding: "3rem 0", borderTop: "1px solid var(--border-base)" }},
    sectionHeader("Aktor & Entitas", "", "klik untuk detail"),
    h("div", { class: "actor-grid", style: {
      display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "2.5rem",
    }},
      renderActorColumn("Person", d.actors.people),
      renderActorColumn("Organization", d.actors.orgs),
      renderActorColumn("Project", d.actors.projects),
    ),
  );
}

// ── Sources ──────────────────────────────────────────────────────────────────
function renderSources(d) {
  const primary = h("div", { style: {
    fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.75rem",
    color: "var(--text-secondary)", lineHeight: 1.55,
    padding: "1rem 1.25rem", background: "var(--bg-surface-2)",
    borderLeft: "2px solid var(--text-primary)", marginBottom: "1.5rem",
  }},
    h("span", { style: {
      fontSize: "0.625rem", letterSpacing: "0.12em", textTransform: "uppercase",
      color: "var(--text-tertiary)", display: "block", marginBottom: "0.375rem",
    }}, "Sumber utama"),
    d.primarySource,
  );

  const grid = h("div", { style: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.5rem",
  }});
  d.sources.forEach((url, i) => {
    let host = url; try { host = new URL(url).hostname.replace(/^www\./, ""); } catch {}
    grid.appendChild(h("a", { href: url, target: "_blank", rel: "noopener noreferrer", style: {
      display: "block", padding: "0.625rem 0.75rem",
      background: "var(--bg-surface-2)", border: "1px solid var(--border-base)",
      color: "var(--text-secondary)", textDecoration: "none",
      fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6875rem",
      lineHeight: 1.4, transition: "border-color 0.15s, color 0.15s",
    }},
      h("div", { style: { color: "var(--text-tertiary)", fontSize: "0.5625rem", letterSpacing: "0.08em", marginBottom: "0.188rem" }}, "[" + String(i + 1).padStart(2, "0") + "]"),
      h("div", { style: { color: "var(--text-primary)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}, host),
    ));
  });

  const disclaimer = h("p", { style: {
    marginTop: "1.5rem", padding: "1rem 1.25rem",
    background: "var(--accent-danger-bg)", borderLeft: "3px solid var(--accent-danger)",
    fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.688rem",
    lineHeight: 1.6, color: "var(--text-secondary)",
  }}, "DISCLAIMER — Analisis di atas berbasis dokumen publik (AHU, LPSE, SiRUP) dan laporan media terverifikasi. Platform ini bukan tuduhan hukum, melainkan alat bantu pemetaan fakta dokumen untuk mendukung pengawasan publik.");

  return h("section", { style: { padding: "3rem 0", borderTop: "1px solid var(--border-base)" }},
    sectionHeader("Sumber", String(d.sources.length).padStart(2, "0"), "tautan"),
    primary, grid, disclaimer,
  );
}

// ── Related ──────────────────────────────────────────────────────────────────
function renderRelated(currentSlug) {
  const others = DOSSIERS.filter(x => x.slug !== currentSlug);
  if (others.length === 0) return null;
  const grid = h("div", { style: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem",
  }});
  others.forEach(d => {
    grid.appendChild(h("a", { href: "#", class: "related-card", "data-slug": d.slug, style: {
      display: "block", padding: "1.5rem 1.5rem 1.75rem",
      background: "var(--bg-surface)", border: "1px solid var(--border-base)",
      color: "inherit",
    }},
      h("div", { style: {
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem",
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--accent-danger)", fontWeight: 700, marginBottom: "0.75rem",
      }}, d.code),
      h("h3", { style: {
        fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: "1.25rem",
        fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.015em",
        color: "var(--text-primary)", margin: "0 0 0.5rem", textWrap: "balance",
      }}, d.title),
      h("p", { style: { fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: "0 0 1rem" }}, d.subtitle),
      h("div", { style: {
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.688rem",
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: "var(--text-primary)", fontWeight: 700,
        borderTop: "1px solid var(--text-primary)", paddingTop: "0.625rem",
        display: "inline-flex", gap: "0.5rem", alignItems: "center",
      }}, "Buka Dossier →"),
    ));
  });
  return h("section", { style: { padding: "3rem 0 4rem", borderTop: "2px solid var(--text-primary)" }},
    h("header", { style: { marginBottom: "1.5rem" }},
      h("span", { style: {
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem",
        letterSpacing: "0.16em", textTransform: "uppercase",
        color: "var(--accent-danger)", fontWeight: 700,
      }}, "Dossier Lainnya"),
    ),
    grid,
  );
}

// ── Landing-cards mode ───────────────────────────────────────────────────────
function renderLanding() {
  const page = $("#page");
  page.innerHTML = "";
  page.appendChild(h("div", { style: { padding: "3rem 0 1.5rem" }},
    h("div", { style: {
      fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.688rem",
      letterSpacing: "0.14em", textTransform: "uppercase",
      color: "var(--accent-danger)", fontWeight: 700, marginBottom: "0.75rem",
    }}, "Investigasi Aktif"),
    h("h1", { style: {
      fontFamily: "'IBM Plex Serif', Georgia, serif",
      fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700,
      letterSpacing: "-0.025em", color: "var(--text-primary)",
      margin: "0 0 0.5rem", textWrap: "balance",
    }}, "Tiga dossier. Satu jaringan."),
    h("p", { style: {
      fontFamily: "'IBM Plex Serif', Georgia, serif", fontStyle: "italic",
      fontSize: "1.125rem", color: "var(--text-secondary)",
      margin: 0, maxWidth: "640px",
    }}, "Setiap kartu membuka halaman dossier penuh dengan temuan, kronologi, aktor, dan sumber."),
  ));

  const stack = h("div", { style: { display: "flex", flexDirection: "column", gap: "1rem", paddingBottom: "4rem" }});
  DOSSIERS.forEach(d => {
    stack.appendChild(h("a", { href: "#", class: "dossier-index-card", "data-slug": d.slug, style: {
      display: "grid", gridTemplateColumns: "160px minmax(0, 1fr) auto",
      gap: "2rem", alignItems: "center",
      padding: "1.75rem 1.5rem",
      background: "var(--bg-surface)", border: "1px solid var(--border-base)",
      color: "inherit",
    }},
      h("div", {},
        h("div", { style: {
          fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem",
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--text-tertiary)", marginBottom: "0.5rem",
        }}, d.code),
        h("div", { style: {
          fontFamily: "'IBM Plex Serif', Georgia, serif",
          fontSize: "2.25rem", fontWeight: 700, lineHeight: 1,
          letterSpacing: "-0.02em", color: "var(--accent-danger)",
        }}, d.categoryShort),
      ),
      h("div", {},
        h("h3", { style: {
          fontFamily: "'IBM Plex Serif', Georgia, serif",
          fontSize: "clamp(1.25rem, 2.4vw, 1.625rem)", fontWeight: 700,
          lineHeight: 1.2, letterSpacing: "-0.015em",
          color: "var(--text-primary)", margin: "0 0 0.5rem", textWrap: "balance",
        }}, d.title),
        h("p", { style: {
          fontFamily: "'IBM Plex Serif', Georgia, serif", fontStyle: "italic",
          fontSize: "0.9375rem", color: "var(--text-secondary)",
          lineHeight: 1.45, margin: "0 0 0.75rem",
        }}, d.subtitle),
        h("div", { style: {
          fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.688rem",
          letterSpacing: "0.06em", color: "var(--text-tertiary)",
        }, html: '<span style="color: var(--accent-danger); font-weight: 700;">' + d.anggaranFokus + '</span> · ' + d.anggaranLabel }),
      ),
      h("div", { style: {
        fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.688rem",
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: "var(--text-primary)", fontWeight: 700,
        borderTop: "1px solid var(--text-primary)", paddingTop: "0.5rem",
        whiteSpace: "nowrap",
      }}, "Buka →"),
    ));
  });
  page.appendChild(stack);

  // Wire clicks
  page.querySelectorAll(".dossier-index-card").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      setMode("dossier");
      setSlug(el.dataset.slug);
    });
  });
}

// ── Render dossier ───────────────────────────────────────────────────────────
function renderDossier(slug) {
  const d = DOSSIERS.find(x => x.slug === slug) || DOSSIERS[0];
  const page = $("#page");
  page.innerHTML = "";
  page.appendChild(renderBreadcrumb(d));
  page.appendChild(renderHero(d));
  page.appendChild(renderFacts(d));
  page.appendChild(renderFindings(d));
  page.appendChild(renderTimeline(d));
  page.appendChild(renderActors(d));
  page.appendChild(renderSources(d));
  const rel = renderRelated(d.slug);
  if (rel) page.appendChild(rel);

  // Wire related-card clicks
  page.querySelectorAll(".related-card").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      setSlug(el.dataset.slug);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

// ── State / wiring ───────────────────────────────────────────────────────────
let currentSlug = localStorage.getItem("koneksi:slug") || "bgn-peruri";
let currentMode = localStorage.getItem("koneksi:mode") || "dossier";

function setSlug(slug) {
  currentSlug = slug;
  localStorage.setItem("koneksi:slug", slug);
  document.querySelectorAll(".ph-nav button").forEach(b => b.classList.toggle("on", b.dataset.slug === slug));
  if (currentMode === "dossier") renderDossier(slug);
}

function setMode(mode) {
  currentMode = mode;
  localStorage.setItem("koneksi:mode", mode);
  $("#m-dossier").classList.toggle("on", mode === "dossier");
  $("#m-landing").classList.toggle("on", mode === "landing");
  if (mode === "dossier") renderDossier(currentSlug);
  else renderLanding();
}

document.querySelectorAll(".ph-nav button").forEach(b => {
  b.addEventListener("click", () => { setMode("dossier"); setSlug(b.dataset.slug); });
});
$("#m-dossier").addEventListener("click", () => setMode("dossier"));
$("#m-landing").addEventListener("click", () => setMode("landing"));

// Theme toggle
const themeBtn = $("#themeBtn");
const initDark = localStorage.getItem("koneksi:theme") === "dark";
if (initDark) document.documentElement.classList.add("dark");
themeBtn.textContent = initDark ? "☀" : "☾";
themeBtn.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("koneksi:theme", isDark ? "dark" : "light");
  themeBtn.textContent = isDark ? "☀" : "☾";
});

// Boot
setMode(currentMode);
if (currentMode === "dossier") setSlug(currentSlug);

// KeyFactsGrid — 4-up stat strip under the hero. Mirrors landing page StatCell.

import type { DossierFacts, DossierMeta } from "@/lib/dossier";

interface Props {
  facts: DossierFacts;
  meta: DossierMeta;
}

export function KeyFactsGrid({ facts, meta }: Props) {
  const cells = [
    { v: facts.entities.length, k: "Entitas Terpetakan", danger: false },
    { v: facts.totalRelations, k: "Relasi Ditemukan", danger: false },
    { v: facts.redFlagsHigh, k: "Red Flag — HIGH", danger: true },
    { v: facts.redFlagsMedium, k: "Red Flag — MEDIUM", danger: false },
  ];

  return (
    <section style={{ padding: "2rem 0 0" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderTop: "1px solid var(--text-primary)",
          borderBottom: "1px solid var(--text-primary)",
        }}
        className="dossier-facts-grid"
      >
        {cells.map((c, i) => (
          <div
            key={i}
            style={{
              padding: "1.5rem 1.25rem",
              borderRight: i < cells.length - 1 ? "1px solid var(--border-base)" : "none",
              background: c.danger ? "var(--accent-danger-bg)" : "transparent",
            }}
          >
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
                fontWeight: 600,
                lineHeight: 1,
                color: c.danger ? "var(--accent-danger)" : "var(--text-primary)",
                marginBottom: "0.625rem",
              }}
            >
              {c.v.toLocaleString()}
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.625rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: c.danger ? "var(--accent-danger)" : "var(--text-secondary)",
              }}
            >
              {c.k}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 640px) {
          .dossier-facts-grid { grid-template-columns: 1fr 1fr !important; }
          .dossier-facts-grid > div { border-bottom: 1px solid var(--border-base); }
          .dossier-facts-grid > div:nth-child(2n) { border-right: none !important; }
        }
      `}</style>
      <div style={{ marginTop: "0.75rem", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem", color: "var(--text-tertiary)", letterSpacing: "0.08em" }}>
        KATEGORI: {meta.categoryLong.toUpperCase()}
      </div>
    </section>
  );
}

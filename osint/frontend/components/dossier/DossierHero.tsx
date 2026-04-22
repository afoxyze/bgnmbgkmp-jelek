// DossierHero — editorial opening for a single investigation.
// Server component, no client JS. Matches /app/page.tsx typography system.

import type { DossierMeta } from "@/lib/dossier";
import type { DossierFacts } from "@/lib/dossier";

interface Props {
  meta: DossierMeta;
  facts: DossierFacts;
  status: string;
}

export function DossierHero({ meta, facts: _facts, status }: Props) {
  return (
    <section style={{ padding: "2rem 0 3rem", borderBottom: "1px solid var(--border-base)" }}>
      {/* Meta row — code / category / severity */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          flexWrap: "wrap",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.688rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
          marginBottom: "1.5rem",
        }}
      >
        <span style={{ color: "var(--accent-danger)", fontWeight: 700 }}>{meta.code}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>{meta.categoryLong}</span>
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: "'IBM Plex Serif', 'Georgia', serif",
          fontSize: "clamp(2.25rem, 6.5vw, 4.25rem)",
          fontWeight: 700,
          lineHeight: 1.02,
          letterSpacing: "-0.03em",
          color: "var(--text-primary)",
          margin: "0 0 1rem",
          maxWidth: "900px",
          textWrap: "balance",
        }}
      >
        {meta.title}
      </h1>

      {/* Subtitle / deck */}
      <p
        style={{
          fontFamily: "'IBM Plex Serif', 'Georgia', serif",
          fontStyle: "italic",
          fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
          lineHeight: 1.4,
          color: "var(--text-secondary)",
          margin: "0 0 2rem",
          maxWidth: "780px",
          textWrap: "pretty",
        }}
      >
        {meta.subtitle}
      </p>

      {/* Lede — drop-cap first paragraph */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 720px) 1fr", gap: "3rem" }} className="dossier-lede-grid">
        <p
          style={{
            fontSize: "1.0625rem",
            lineHeight: 1.65,
            color: "var(--text-primary)",
            margin: 0,
            maxWidth: "720px",
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Serif', 'Georgia', serif",
              fontSize: "3.75rem",
              float: "left",
              lineHeight: 0.9,
              padding: "0.25rem 0.5rem 0 0",
              color: "var(--accent-danger)",
              fontWeight: 700,
            }}
          >
            {meta.lede.charAt(0)}
          </span>
          {meta.lede.slice(1)}
        </p>

        {/* Budget callout */}
        {meta.anggaranFokus && (
          <aside
            style={{
              borderLeft: "2px solid var(--accent-danger)",
              paddingLeft: "1.25rem",
              alignSelf: "start",
            }}
          >
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.625rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                marginBottom: "0.5rem",
              }}
            >
              Angka Utama
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Serif', 'Georgia', serif",
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "var(--accent-danger)",
                marginBottom: "0.5rem",
              }}
            >
              {meta.anggaranFokus}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              {meta.anggaranLabel}
            </div>
            <div
              style={{
                marginTop: "0.75rem",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.625rem",
                color: "var(--text-tertiary)",
                letterSpacing: "0.06em",
              }}
            >
              STATUS: {status}
            </div>
          </aside>
        )}
      </div>

      <style>{`
        @media (max-width: 820px) {
          .dossier-lede-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
      `}</style>
    </section>
  );
}

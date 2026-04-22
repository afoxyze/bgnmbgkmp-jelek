// RelatedDossiers — bottom "up next" block, deep-links to the other investigations.

import Link from "next/link";
import type { DossierMeta } from "@/lib/dossier";

interface Props { dossiers: readonly DossierMeta[]; }

export function RelatedDossiers({ dossiers }: Props) {
  if (dossiers.length === 0) return null;
  return (
    <section style={{ padding: "3rem 0 4rem", borderTop: "2px solid var(--text-primary)" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.625rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--accent-danger)",
            fontWeight: 700,
          }}
        >
          Dossier Lainnya
        </span>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {dossiers.map((d) => (
          <Link
            key={d.slug}
            href={`/dossier/${d.slug}`}
            style={{
              display: "block",
              padding: "1.5rem 1.5rem 1.75rem",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-base)",
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 0.15s, transform 0.15s",
            }}
            className="related-card"
          >
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.625rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--accent-danger)",
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              {d.code}
            </div>
            <h3
              style={{
                fontFamily: "'IBM Plex Serif', 'Georgia', serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-0.015em",
                color: "var(--text-primary)",
                margin: "0 0 0.5rem",
                textWrap: "balance",
              }}
            >
              {d.title}
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: "0 0 1rem" }}>
              {d.subtitle}
            </p>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.688rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-primary)",
                fontWeight: 700,
                borderTop: "1px solid var(--text-primary)",
                paddingTop: "0.625rem",
                display: "inline-flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              Buka Dossier →
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .related-card:hover { border-color: var(--accent-danger) !important; transform: translateY(-2px); }
      `}</style>
    </section>
  );
}

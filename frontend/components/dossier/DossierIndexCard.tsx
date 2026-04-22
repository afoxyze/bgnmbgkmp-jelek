// DossierIndexCard — landing-page card that deep-links to /dossier/[slug].
// Replaces the InvestigationCard row on the home page (or augments it).

import Link from "next/link";
import type { DossierMeta } from "@/lib/dossier";

interface Props { dossier: DossierMeta; }

export function DossierIndexCard({ dossier }: Props) {
  return (
    <Link
      href={`/dossier/${dossier.slug}`}
      style={{
        display: "grid",
        gridTemplateColumns: "160px minmax(0, 1fr) auto",
        gap: "2rem",
        alignItems: "center",
        padding: "1.75rem 1.5rem",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-base)",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.15s, transform 0.15s",
      }}
      className="dossier-index-card"
    >
      {/* Left column — code + severity */}
      <div>
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
          {dossier.code}
        </div>
        <div
          style={{
            fontFamily: "'IBM Plex Serif', 'Georgia', serif",
            fontSize: "2.25rem",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "var(--accent-danger)",
          }}
        >
          {dossier.categoryShort}
        </div>
      </div>

      {/* Middle column — title + subtitle */}
      <div>
        <h3
          style={{
            fontFamily: "'IBM Plex Serif', 'Georgia', serif",
            fontSize: "clamp(1.25rem, 2.4vw, 1.625rem)",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.015em",
            color: "var(--text-primary)",
            margin: "0 0 0.5rem",
            textWrap: "balance",
          }}
        >
          {dossier.title}
        </h3>
        <p
          style={{
            fontFamily: "'IBM Plex Serif', 'Georgia', serif",
            fontStyle: "italic",
            fontSize: "0.9375rem",
            color: "var(--text-secondary)",
            lineHeight: 1.45,
            margin: "0 0 0.75rem",
          }}
        >
          {dossier.subtitle}
        </p>
        {dossier.anggaranFokus && (
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.688rem",
              letterSpacing: "0.06em",
              color: "var(--text-tertiary)",
            }}
          >
            <span style={{ color: "var(--accent-danger)", fontWeight: 700 }}>{dossier.anggaranFokus}</span>
            &nbsp;·&nbsp;{dossier.anggaranLabel}
          </div>
        )}
      </div>

      {/* Right column — open affordance */}
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.688rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-primary)",
          fontWeight: 700,
          borderTop: "1px solid var(--text-primary)",
          paddingTop: "0.5rem",
          whiteSpace: "nowrap",
        }}
      >
        Buka →
      </div>

      <style>{`
        .dossier-index-card:hover { border-color: var(--accent-danger) !important; transform: translateY(-2px); }
        @media (max-width: 720px) {
          .dossier-index-card { grid-template-columns: 1fr !important; gap: 1rem !important; }
        }
      `}</style>
    </Link>
  );
}

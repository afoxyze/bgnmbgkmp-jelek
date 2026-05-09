// Numbered notes that tie back to entities and flagged public data.

import Link from "next/link";
import { SourceLink } from "@/components/SourceLink";
import type { DossierFinding } from "@/lib/dossier";
import type { Entity, RedFlag } from "@/types/graph";

interface Props {
  findings: readonly DossierFinding[];
  redFlags: readonly RedFlag[];
  entities: readonly Entity[];
}

export function FindingsList({ findings, redFlags, entities }: Props) {
  const entityMap = new Map(entities.map((e) => [e.id, e]));
  const flagMap = new Map(redFlags.map((rf) => [rf.id, rf]));

  return (
    <section style={{ padding: "3rem 0 2rem", borderTop: "1px solid var(--border-base)" }}>
      <header style={{ marginBottom: "2rem", display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap" }}>
        <h2
          style={{
            fontFamily: "'IBM Plex Serif', 'Georgia', serif",
            fontSize: "clamp(1.5rem, 3.2vw, 2.25rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Catatan Utama
        </h2>
        <span style={{ flex: 1, height: "1px", background: "var(--border-base)" }} />
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.625rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
          }}
        >
          {findings.length.toString().padStart(2, "0")} catatan
        </span>
      </header>

      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {findings.map((f, i) => {
          const relEnt = (f.relatedEntityIds ?? []).map((id) => entityMap.get(id)).filter(Boolean) as Entity[];
          const relFlags = (f.relatedRedFlagIds ?? []).map((id) => flagMap.get(id)).filter(Boolean) as RedFlag[];

          // Aggregate source URLs from both the finding's own entities and its red flags,
          // deduplicated, so each claim carries a visible trail to public documents.
          const sourceSet = new Set<string>();
          relEnt.forEach((e) => e.sumber?.forEach((s) => sourceSet.add(s)));
          relFlags.forEach((rf) => rf.sumber?.forEach((s) => sourceSet.add(s)));
          const sources = Array.from(sourceSet);

          const focusIds = relEnt.map((e) => e.id);
          const grafHref = focusIds.length > 0 ? `/graf?focus=${focusIds.join(",")}` : "/graf";

          return (
            <li
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "100px minmax(0, 1fr)",
                gap: "2rem",
                padding: "2rem 0",
                borderBottom: i < findings.length - 1 ? "1px solid var(--border-subtle)" : "2px solid var(--text-primary)",
              }}
              className="dossier-finding"
            >
              <div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Serif', 'Georgia', serif",
                    fontSize: "3rem",
                    fontWeight: 500,
                    lineHeight: 1,
                    color: "var(--accent-danger)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {(i + 1).toString().padStart(2, "0")}
                </div>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.625rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    borderTop: "1px solid var(--text-primary)",
                    paddingTop: "0.5rem",
                  }}
                >
                  {f.tag}
                </div>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "'IBM Plex Serif', 'Georgia', serif",
                    fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                    fontWeight: 700,
                    lineHeight: 1.25,
                    letterSpacing: "-0.015em",
                    color: "var(--text-primary)",
                    margin: "0 0 0.75rem",
                    textWrap: "balance",
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "var(--text-secondary)", margin: "0 0 1rem" }}>
                  {f.body}
                </p>
                {(relEnt.length > 0 || relFlags.length > 0) && (
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", paddingTop: "0.5rem" }}>
                    {relFlags.map((rf) => (
                      <span
                        key={rf.id}
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "0.625rem",
                          letterSpacing: "0.08em",
                          padding: "0.25rem 0.5rem",
                          background: "var(--accent-danger)",
                          color: "white",
                          fontWeight: 700,
                        }}
                      >
                        TANYA {rf.id.toUpperCase()}
                      </span>
                    ))}
                    {relEnt.map((e) => (
                      <span
                        key={e.id}
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "0.625rem",
                          letterSpacing: "0.06em",
                          padding: "0.25rem 0.5rem",
                          border: "1px solid var(--border-strong)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {e.label}
                      </span>
                    ))}
                  </div>
                )}

                {sources.length > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    <div
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "0.625rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--text-tertiary)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Sumber terkait
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: "0.375rem",
                      }}
                    >
                      {sources.map((url, idx) => (
                        <SourceLink key={`${i}-${url}`} url={url} index={idx} />
                      ))}
                    </div>
                  </div>
                )}

                {focusIds.length > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    <Link
                      href={grafHref}
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "0.625rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--text-primary)",
                        textDecoration: "none",
                        borderBottom: "1px solid var(--text-primary)",
                        paddingBottom: "2px",
                        fontWeight: 700,
                      }}
                    >
                      Lihat di graf &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <style>{`
        @media (max-width: 640px) {
          .dossier-finding { grid-template-columns: 1fr !important; gap: 1rem !important; }
        }
      `}</style>
    </section>
  );
}

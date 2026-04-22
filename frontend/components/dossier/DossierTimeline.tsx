// DossierTimeline — chronological events strip.

import type { DossierTimelineEvent } from "@/lib/dossier";

interface Props { events: readonly DossierTimelineEvent[]; }

export function DossierTimeline({ events }: Props) {
  if (events.length === 0) return null;
  return (
    <section style={{ padding: "3rem 0", borderTop: "1px solid var(--border-base)" }}>
      <header style={{ marginBottom: "1.5rem", display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap" }}>
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
          Kronologi
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
          {events.length} peristiwa
        </span>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          borderTop: "1px solid var(--text-primary)",
        }}
      >
        {events.map((ev, i) => (
          <article
            key={i}
            style={{
              padding: "1.25rem 1rem 1.5rem",
              borderRight: "1px solid var(--border-base)",
              borderBottom: "1px solid var(--border-base)",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "-5px",
                left: "1rem",
                width: "9px",
                height: "9px",
                background: "var(--accent-danger)",
              }}
            />
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.625rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--accent-danger)",
                fontWeight: 700,
                marginBottom: "0.625rem",
              }}
            >
              {ev.date}
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.5, color: "var(--text-primary)", margin: "0 0 0.5rem" }}>
              {ev.event}
            </p>
            {ev.source && (
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.625rem",
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.06em",
                }}
              >
                src: {ev.source}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

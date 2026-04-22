// ActorGrid — People / Organizations / Projects split cards, deep-linking to /entitas/[id].

import Link from "next/link";
import type { Entity } from "@/types/graph";

interface Props {
  people: readonly Entity[];
  orgs: readonly Entity[];
  projects: readonly Entity[];
}

function ActorRow({ e }: { e: Entity }) {
  const hasFlag = typeof e.properties["red_flag"] === "string";
  const role = (e.properties["jabatan"] || e.properties["jabatan_pds"] || e.properties["peran"] ||
    e.properties["jenis"] || e.properties["jenis_lembaga"] || e.properties["proyek"] || e.properties["tujuan"] || "") as string;
  return (
    <Link
      href={`/entitas/${encodeURIComponent(e.id)}`}
      style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr auto",
        gap: "1rem",
        alignItems: "center",
        padding: "1rem 0.25rem",
        borderBottom: "1px solid var(--border-subtle)",
        textDecoration: "none",
        color: "inherit",
      }}
      className="actor-row"
    >
      <div>
        <div
          style={{
            fontFamily: "'IBM Plex Serif', 'Georgia', serif",
            fontSize: "1.0625rem",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "var(--text-primary)",
            marginBottom: "0.125rem",
          }}
        >
          {e.label}
        </div>
        {role && (
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>{role}</div>
        )}
      </div>
      <div>
        {hasFlag && (
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.625rem",
              letterSpacing: "0.08em",
              padding: "0.188rem 0.5rem",
              background: "var(--accent-danger-bg)",
              color: "var(--accent-danger)",
              fontWeight: 700,
              border: "1px solid var(--accent-danger)",
            }}
          >
            ⚑ RED FLAG
          </span>
        )}
      </div>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.75rem", color: "var(--text-tertiary)" }}>→</span>
    </Link>
  );
}

function ActorColumn({ title, entities }: { title: string; entities: readonly Entity[] }) {
  return (
    <div>
      <header
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "0.5rem",
          padding: "0.75rem 0",
          borderBottom: "1.5px solid var(--text-primary)",
          marginBottom: "0.25rem",
        }}
      >
        <h3
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.688rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-primary)",
            fontWeight: 700,
            margin: 0,
          }}
        >
          {title}
        </h3>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem", color: "var(--text-tertiary)" }}>
          {entities.length.toString().padStart(2, "0")}
        </span>
      </header>
      {entities.length === 0 ? (
        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontStyle: "italic", margin: "0.75rem 0" }}>—</p>
      ) : (
        entities.map((e) => <ActorRow key={e.id} e={e} />)
      )}
    </div>
  );
}

export function ActorGrid({ people, orgs, projects }: Props) {
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
          Aktor & Entitas
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
          klik untuk detail
        </span>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "2.5rem",
        }}
        className="actor-grid"
      >
        <ActorColumn title="Person" entities={people} />
        <ActorColumn title="Organization" entities={orgs} />
        <ActorColumn title="Project" entities={projects} />
      </div>
      <style>{`
        .actor-row:hover > div:first-child > div:first-child { color: var(--accent-danger); }
        @media (max-width: 900px) {
          .actor-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  );
}

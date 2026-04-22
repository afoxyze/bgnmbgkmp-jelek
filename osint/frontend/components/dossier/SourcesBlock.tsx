// SourcesBlock — collected source URLs + primary source string.

import { SourceLink } from "@/components/SourceLink";

interface Props {
  sources: readonly string[];
  primarySource: string;
}

export function SourcesBlock({ sources, primarySource }: Props) {
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
          Sumber
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
          {sources.length.toString().padStart(2, "0")} tautan
        </span>
      </header>

      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.75rem",
          color: "var(--text-secondary)",
          lineHeight: 1.55,
          padding: "1rem 1.25rem",
          background: "var(--bg-surface-2)",
          borderLeft: "2px solid var(--text-primary)",
          marginBottom: "1.5rem",
        }}
      >
        <span
          style={{
            fontSize: "0.625rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            display: "block",
            marginBottom: "0.375rem",
          }}
        >
          Sumber utama
        </span>
        {primarySource}
      </div>

      {sources.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {sources.map((url, i) => (
            <SourceLink key={url} url={url} index={i} />
          ))}
        </div>
      )}

      <p
        style={{
          marginTop: "1.5rem",
          padding: "1rem 1.25rem",
          background: "var(--accent-danger-bg)",
          borderLeft: "3px solid var(--accent-danger)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.688rem",
          lineHeight: 1.6,
          color: "var(--text-secondary)",
        }}
      >
        DISCLAIMER — Analisis di atas berbasis dokumen publik (AHU, LPSE, SiRUP) dan laporan media
        terverifikasi. Platform ini bukan tuduhan hukum, melainkan alat bantu pemetaan fakta dokumen
        untuk mendukung pengawasan publik.
      </p>
    </section>
  );
}

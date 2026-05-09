// Collected source URLs and primary source string.

import { SourceLink } from "@/components/SourceLink";

interface Props {
  sources: readonly string[];
  primarySource: string;
}

// Split a free-form "primary source" string into parts, and render each part
// as either a clickable link (if it looks like a URL) or plain text.
function renderPrimarySource(raw: string): React.ReactNode {
  const parts = raw.split(/\s*;\s*/).filter(Boolean);
  return (
    <span>
      {parts.map((part, i) => {
        const urlMatch = part.match(/https?:\/\/\S+/);
        const sep = i < parts.length - 1 ? "; " : "";
        if (urlMatch) {
          const url = urlMatch[0];
          const before = part.slice(0, urlMatch.index ?? 0);
          const after = part.slice((urlMatch.index ?? 0) + url.length);
          return (
            <span key={i}>
              {before}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent-danger)", textDecoration: "underline" }}
              >
                {url}
              </a>
              {after}
              {sep}
            </span>
          );
        }
        return <span key={i}>{part}{sep}</span>;
      })}
    </span>
  );
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
        {renderPrimarySource(primarySource)}
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
        CATATAN: Katalog ini berbasis dokumen publik, data pengadaan, dan laporan media.
        Isinya bersifat informatif dan perlu dibaca bersama sumber aslinya.
      </p>
    </section>
  );
}

"use client";

interface SourceLinkProps {
  url: string;
  index: number;
}

export function SourceLink({ url, index }: SourceLinkProps) {
  let displayText = `Sumber ${index + 1}`;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");
    displayText = hostname;
  } catch {
    // malformed URL — keep default
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-[11px] py-2 px-3 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] group transition-all hover:border-[var(--accent-danger)]"
      style={{ color: "var(--text-secondary)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = "#0284c7"; /* sky-600 */
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
      }}
      title={url}
    >
      <svg
        className="w-3 h-3 flex-shrink-0 transition-colors"
        fill="none"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path
          d="M6 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3M9 2h5m0 0v5m0-5L8 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="truncate">{displayText}</span>
    </a>
  );
}

"use client";

import { SEVERITY_COLORS, formatRelationType } from "@/lib/graph-utils";
import { SourceLink } from "@/components/SourceLink";
import type { RedFlag } from "@/types/graph";
import { useMemo, useState } from "react";

interface RedFlagsPanelProps {
  redFlags: readonly RedFlag[];
  onHighlightEntities: (entityIds: readonly string[]) => void;
  highlightedFlagId: string | null;
}

const SEVERITY_WEIGHT = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export function RedFlagsPanel({
  redFlags,
  onHighlightEntities,
  highlightedFlagId,
}: RedFlagsPanelProps) {
  const [openSourceId, setOpenSourceId] = useState<string | null>(null);

  // Sort red flags: High first, then Medium, then Low
  const sortedFlags = useMemo(() => {
    return [...redFlags].sort((a, b) =>
      (SEVERITY_WEIGHT[b.severity] || 0) - (SEVERITY_WEIGHT[a.severity] || 0)
    );
  }, [redFlags]);

  if (redFlags.length === 0) {
    return (
      <div className="p-6 text-sm text-[var(--text-tertiary)] italic">
        Belum ada catatan untuk bagian ini.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {sortedFlags.map((rf) => {
        const colors = SEVERITY_COLORS[rf.severity as keyof typeof SEVERITY_COLORS] || SEVERITY_COLORS.MEDIUM;
        const isActive = highlightedFlagId === rf.id;
        const isSourceOpen = openSourceId === rf.id;
        const hasSources = Array.isArray(rf.sumber) && rf.sumber.length > 0;

        return (
          <div
            key={rf.id}
            className="border-b border-[var(--border-base)] transition-colors"
            style={{ backgroundColor: isActive ? "var(--bg-interactive)" : "transparent" }}
          >
            <button
              onClick={() => onHighlightEntities(rf.entitas_terlibat)}
              className="w-full text-left px-6 py-4 transition-colors relative group"
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "var(--bg-surface)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
              }}
              aria-pressed={isActive}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />}

              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${colors.badge} text-white`}
                    >
                      {rf.severity === "HIGH" ? "TINGGI" : "SEDANG"}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-tertiary)] truncate">
                      {formatRelationType(rf.type)}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                    {rf.deskripsi}
                  </p>
                </div>
                <span className="text-[var(--text-tertiary)] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </span>
              </div>
            </button>

            {hasSources && (
              <div className="px-6 pb-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSourceId(isSourceOpen ? null : rf.id);
                  }}
                  className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)] hover:text-[var(--accent-danger)] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{rf.sumber.length} sumber</span>
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${isSourceOpen ? "rotate-90" : ""}`}>
                    <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {isSourceOpen && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {rf.sumber.map((url, i) => (
                      <SourceLink key={`${rf.id}-${url}`} url={url} index={i} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

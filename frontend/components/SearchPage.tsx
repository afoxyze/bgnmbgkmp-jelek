"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { NodeBadge } from "@/components/NodeBadge";
import {
  ENTITY_TYPE_LABELS,
  NODE_COLORS,
  getRedFlagsForEntity,
  formatPropertyKey,
} from "@/lib/graph-utils";
import type { CaseStudy, Entity, EntityType } from "@/types/graph";

interface SearchPageProps {
  caseStudy: CaseStudy;
}

const ALL_TYPES: EntityType[] = ["Person", "Organization", "Project"];

// Picks the first 2–3 property entries for the card preview (skips red_flag boolean).
function getPreviewProperties(entity: Entity): Array<{ key: string; value: string }> {
  const entries = Object.entries(entity.properties).filter(
    ([k, v]) => k !== "red_flag" && v !== null && v !== undefined && v !== ""
  );
  return entries.slice(0, 3).map(([key, value]) => ({
    key: formatPropertyKey(key),
    value: Array.isArray(value) ? (value as unknown[]).map(String).join(", ") : String(value),
  }));
}

export function SearchPage({ caseStudy }: SearchPageProps) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<EntityType | null>(null);
  const [limit, setLimit] = useState(24);

  // Reset limit when query or filter changes
  useEffect(() => {
    setLimit(24);
  }, [query, activeType]);

  const normalized = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    // 1. Filter by type and query
    const results = caseStudy.entities.filter((e) => {
      const matchesType = !activeType || e.type === activeType;
      const matchesQuery =
        normalized === "" || e.label.toLowerCase().includes(normalized);
      return matchesType && matchesQuery;
    });

    // 2. Sort: Project > Organization > Person, and Red Flags first
    return results.sort((a, b) => {
      // Type Weight: Project=0, Organization=1, Person=2
      const typeWeights: Record<string, number> = { Project: 0, Organization: 1, Person: 2 };
      const weightA = typeWeights[a.type] ?? 99;
      const weightB = typeWeights[b.type] ?? 99;

      if (weightA !== weightB) return weightA - weightB;

      // Red Flags: True (flagged) first
      const hasFlagsA = getRedFlagsForEntity(caseStudy.red_flags, a.id).length > 0;
      const hasFlagsB = getRedFlagsForEntity(caseStudy.red_flags, b.id).length > 0;

      if (hasFlagsA !== hasFlagsB) return hasFlagsA ? -1 : 1;

      // Alphabetical
      return a.label.localeCompare(b.label);
    });
  }, [caseStudy.entities, caseStudy.red_flags, activeType, normalized]);

  const displayed = filtered.slice(0, limit);

  return (
    <div className="content-page p-6">
      <div className="max-w-7xl mx-auto">
        {/* ... existing header ... */}
        <header className="mb-10 border-b pb-8" style={{ borderColor: "var(--border-base)" }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1
                  className="text-3xl font-bold"
                  style={{ fontFamily: "'IBM Plex Serif', serif", color: "var(--text-primary)", letterSpacing: "-0.02em" }}
                >
                  Indeks Entitas
                </h1>
                <span className="text-[10px] px-2 py-0.5 border border-[var(--accent-danger)] text-[var(--accent-danger)] font-mono font-bold rounded">
                  SYSTEM ACTIVE
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)", maxWidth: "600px" }}>
                Database terpusat untuk menelusuri aktor, korporasi, dan proyek strategis dalam ekosistem pertahanan & pangan nasional.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest">
                Last Sync: {caseStudy.metadata.tanggal_riset || "April 2026"}
              </span>
            </div>
          </div>
        </header>

        {/* Search Bar & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Search Input */}
          <div className="lg:col-span-7">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-focus-within:text-[var(--accent-danger)] transition-colors">
                <SearchIcon />
              </div>
              <input
                id="search-input"
                type="search"
                placeholder="INPUT ENTITY NAME / ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 font-mono text-sm rounded-xl outline-none transition-all shadow-inner"
                style={{
                  backgroundColor: "var(--bg-surface-2)",
                  border: "1px solid var(--border-base)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLInputElement).style.borderColor = "var(--accent-danger)";
                  (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 4px rgba(196, 30, 58, 0.05)";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLInputElement).style.borderColor = "var(--border-base)";
                  (e.currentTarget as HTMLInputElement).style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Type Filters */}
          <div className="lg:col-span-5 flex items-center">
            <div className="flex flex-nowrap overflow-x-auto pb-2 lg:pb-0 gap-2 no-scrollbar w-full">
              <button
                onClick={() => setActiveType(null)}
                className={`text-[10px] font-mono font-bold px-3 py-2 rounded-lg border transition-all uppercase tracking-wider whitespace-nowrap ${
                  !activeType 
                    ? "bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--bg-base)]" 
                    : "bg-[var(--bg-surface)] border-[var(--border-base)] text-[var(--text-tertiary)] hover:border-[var(--text-primary)]"
                }`}
              >
                SEMUA
              </button>
              {ALL_TYPES.map((type) => {
                const isActive = activeType === type;
                const color = NODE_COLORS[type];
                return (
                  <button
                    key={type}
                    onClick={() => setActiveType(isActive ? null : type)}
                    className="flex items-center gap-2 text-[10px] font-mono font-bold px-3 py-2 rounded-lg border transition-all uppercase tracking-wider"
                    style={{
                      backgroundColor: isActive ? `${color}20` : "var(--bg-surface)",
                      borderColor: isActive ? color : "var(--border-base)",
                      color: isActive ? color : "var(--text-tertiary)",
                    }}
                    aria-pressed={isActive}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />}
                    {ENTITY_TYPE_LABELS[type]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest">
            Found: <span className="text-[var(--text-primary)] font-bold">{filtered.length}</span> Objects 
            {query && <span> / Query: "{query}"</span>}
          </p>
        </div>

        {/* Results Grid */}
        {filtered.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 align-start">
              {displayed.map((entity) => (
                <EntityCard
                  key={entity.id}
                  entity={entity}
                  caseStudy={caseStudy}
                />
              ))}
            </div>
            
            {filtered.length > limit && (
              <div className="flex justify-center pt-4 pb-12">
                <button
                  onClick={() => setLimit((prev) => prev + 48)}
                  className="px-10 py-4 bg-[var(--bg-surface)] border border-[var(--accent-danger)] text-[var(--accent-danger)] rounded-xl font-mono text-xs font-bold hover:bg-[var(--accent-danger)] hover:text-white transition-all shadow-lg shadow-red-500/10 uppercase tracking-widest"
                >
                  Muat Lebih Banyak ({filtered.length - limit} Entitas Tersisa)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface EntityCardProps {
  entity: Entity;
  caseStudy: CaseStudy;
}

function EntityCard({ entity, caseStudy }: EntityCardProps) {
  const redFlags = getRedFlagsForEntity(caseStudy.red_flags, entity.id);
  const preview = getPreviewProperties(entity);
  const isFlagged = redFlags.length > 0;

  return (
    <Link
      href={`/entitas/${entity.id}`}
      className="investigation-card-hover block rounded-xl p-5 transition-all group"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: isFlagged ? "1px solid var(--accent-danger)" : "1px solid var(--border-base)",
      }}
    >
      <div className="flex flex-col h-full gap-4">
        {/* Card Header: Type & Flags */}
        <div className="flex items-center justify-between">
          <NodeBadge type={entity.type} size="sm" />
          <div className="flex gap-1.5">
            {entity.sumber && entity.sumber.length > 0 && (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] border border-[var(--border-base)]">
                {entity.sumber.length} SRC
              </span>
            )}
            {isFlagged && (
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--accent-danger)] text-white animate-pulse">
                {redFlags.length} RED FLAG
              </span>
            )}
          </div>
        </div>

        {/* Entity Label */}
        <h3
          className="text-base font-bold leading-tight line-clamp-2 group-hover:text-[var(--accent-danger)] transition-colors"
          style={{ color: "var(--text-primary)", fontFamily: "'IBM Plex Serif', serif" }}
        >
          {entity.label}
        </h3>

        {/* Metadata Preview */}
        {preview.length > 0 && (
          <div className="space-y-2 mt-auto">
            <div className="h-px bg-[var(--border-subtle)] w-full" />
            <dl className="flex flex-col gap-1.5">
              {preview.map(({ key, value }) => (
                <div key={key} className="flex flex-col">
                  <dt className="text-[9px] font-mono font-bold text-[var(--text-tertiary)] uppercase tracking-tighter">
                    {key}
                  </dt>
                  <dd className="text-xs text-[var(--text-secondary)] font-medium truncate">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between">
           <span className="text-[9px] font-mono text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity">
             VIEW_DATA_STREAM →
           </span>
           <ChevronRightIcon />
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div
      className="rounded-2xl px-6 py-20 text-center border-2 border-dashed"
      style={{
        backgroundColor: "var(--bg-surface-2)",
        borderColor: "var(--border-base)",
      }}
    >
      <div className="mb-4 flex justify-center text-[var(--text-tertiary)]">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
      <p className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)", fontFamily: "'IBM Plex Serif', serif" }}>
        Data Tidak Ditemukan
      </p>
      <p className="text-sm font-mono text-[var(--text-secondary)] max-w-sm mx-auto">
        {query ? `Entitas "${query}" tidak terdaftar dalam database kami.` : "Silakan pilih minimal satu kategori filter tipe entitas."}
      </p>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 21L16.65 16.65"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="w-4 h-4 text-[var(--text-tertiary)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent-danger)]"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

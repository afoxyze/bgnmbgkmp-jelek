"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Fuse from "fuse.js";
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

// Picks the most informative 1–2 properties for the card preview.
// Priority per entity type — fall back to any two non-empty strings.
const PROPERTY_PRIORITY: Record<EntityType, readonly string[]> = {
  Person: ["jabatan", "partai_politik", "afiliasi", "peran_yayasan", "red_flag"],
  Organization: ["jenis", "bidang_utama", "direktur_utama", "nilai_kontrak", "red_flag"],
  Project: ["nilai_total", "nilai_pagu", "alokasi_anggaran", "jenis_program", "red_flag"],
  LegalCase: ["status", "putusan", "red_flag"],
};

function getPreviewProperties(entity: Entity): Array<{ key: string; value: string }> {
  const order = PROPERTY_PRIORITY[entity.type] ?? [];
  const picked: Array<{ key: string; value: string }> = [];
  const seen = new Set<string>();

  const addIfUsable = (key: string) => {
    if (picked.length >= 2 || seen.has(key)) return;
    const raw = entity.properties[key];
    if (raw === null || raw === undefined || raw === "") return;
    seen.add(key);
    const value = Array.isArray(raw) ? (raw as unknown[]).map(String).join(", ") : String(raw);
    picked.push({ key: formatPropertyKey(key), value });
  };

  // First pass: prioritized keys for this entity type.
  for (const k of order) addIfUsable(k);

  // Second pass: any other non-empty, non-internal string property.
  if (picked.length < 2) {
    for (const [k, v] of Object.entries(entity.properties)) {
      if (k === "red_flag") continue; // handled separately on card via flag count
      if (v === null || v === undefined || v === "") continue;
      addIfUsable(k);
    }
  }

  return picked;
}

export function SearchPage({ caseStudy }: SearchPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeType, setActiveType] = useState<EntityType | null>(() => {
    const t = searchParams.get("type");
    return (ALL_TYPES as string[]).includes(t ?? "") ? (t as EntityType) : null;
  });
  const [limit, setLimit] = useState(24);

  // Autofocus the search input on mount.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Mirror state to the URL so searches are shareable.
  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (activeType) next.set("type", activeType);
    const qs = next.toString();
    const target = qs ? `/cari?${qs}` : "/cari";
    if (typeof window !== "undefined" && window.location.pathname + window.location.search !== target) {
      router.replace(target, { scroll: false });
    }
  }, [router, query, activeType]);

  // Reset limit when query or filter changes
  useEffect(() => {
    setLimit(24);
  }, [query, activeType]);

  const normalized = query.trim();

  // Fuse index is keyed to the entity list. Rebuilt only when the entity
  // list changes, which is effectively once per page load. Searches on:
  // label (primary), id (exact-matches like "person-dadan"), and property
  // values (jabatan, afiliasi, etc.) so typing "DTO" finds Setiaji.
  const fuse = useMemo(() => {
    const indexable = caseStudy.entities.map((e) => ({
      entity: e,
      label: e.label,
      id: e.id,
      type: e.type,
      properties: Object.values(e.properties)
        .filter((v) => typeof v === "string" || typeof v === "number")
        .map(String)
        .join(" "),
    }));
    return new Fuse(indexable, {
      keys: [
        { name: "label", weight: 0.6 },
        { name: "id", weight: 0.15 },
        { name: "properties", weight: 0.25 },
      ],
      threshold: 0.4,          // 0 = exact, 1 = anything. 0.4 is a good balance.
      ignoreLocation: true,    // match anywhere in field, not just the head
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [caseStudy.entities]);

  const filtered = useMemo(() => {
    // Step 1: text filter via Fuse (or identity when query is empty).
    const byText: Entity[] =
      normalized === ""
        ? caseStudy.entities.slice()
        : fuse.search(normalized).map((r) => r.item.entity);

    // Step 2: type filter.
    const typed = activeType ? byText.filter((e) => e.type === activeType) : byText;

    // Step 3: stable sort when not searching. When searching, keep Fuse ordering
    // (by relevance score).
    if (normalized !== "") return typed;

    return typed.slice().sort((a, b) => {
      const typeWeights: Record<string, number> = { Project: 0, Organization: 1, Person: 2 };
      const weightA = typeWeights[a.type] ?? 99;
      const weightB = typeWeights[b.type] ?? 99;
      if (weightA !== weightB) return weightA - weightB;

      const hasFlagsA = getRedFlagsForEntity(caseStudy.red_flags, a.id).length > 0;
      const hasFlagsB = getRedFlagsForEntity(caseStudy.red_flags, b.id).length > 0;
      if (hasFlagsA !== hasFlagsB) return hasFlagsA ? -1 : 1;

      return a.label.localeCompare(b.label);
    });
  }, [caseStudy.entities, caseStudy.red_flags, activeType, normalized, fuse]);

  const displayed = filtered.slice(0, limit);

  return (
    <div className="content-page p-6">
      <div className="max-w-[1160px] mx-auto">
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
                  DATA PUBLIK
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)", maxWidth: "600px" }}>
                Cari nama orang, organisasi, dan proyek yang muncul di
                etalase.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest">
                Update: {caseStudy.metadata.tanggal_riset || "April 2026"}
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
                ref={inputRef}
                type="search"
                placeholder="Cari nama entitas atau ID..."
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
            Ditemukan: <span className="text-[var(--text-primary)] font-bold">{filtered.length}</span> data
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
                  Muat Lebih Banyak ({filtered.length - limit} data tersisa)
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
                {entity.sumber.length} SUMBER
              </span>
            )}
            {isFlagged && (
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--accent-danger)] text-white animate-pulse">
                {redFlags.length} SOROTAN
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
             LIHAT DATA
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
        {query ? `Entitas "${query}" belum ada di data ini.` : "Silakan pilih kategori atau langsung ketik nama yang dicari."}
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

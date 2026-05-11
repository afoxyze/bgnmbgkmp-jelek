// PBP.ID — Entri loader & slug registry
// Server-only. Loads a single case_study_*.json and enriches it with
// pre-computed facts (severity counts, people/orgs split, budget totals).
//
// Registry itself lives in frontend/data/entries.json so that:
//   - non-developers can add entries by editing JSON only
//   - the OG image generator (Node, build-time) reads the exact same file
//   - there is a single source of truth

import { isCaseStudy, type CaseStudy, type Entity, type RedFlag } from "@/types/graph";
import registry from "@/data/entries.json";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface EntryMeta {
  readonly slug: string;
  readonly code: string;           // "PROYEK 01"
  readonly file: string;           // "case_study_bgn_peruri.json"
  readonly title: string;
  readonly subtitle: string;
  readonly lede: string;
  readonly severity: "CRITICAL" | "ACTIVE" | "VERIFIED";
  readonly thread: string;
  readonly categoryShort: string;
  readonly categoryLong: string;
  readonly anggaranFokus?: string;
  readonly anggaranLabel?: string;
  readonly findings: readonly EntryFinding[];
  readonly timeline: readonly EntryTimelineEvent[];
}

export interface EntryFinding {
  readonly tag: string;
  readonly title: string;
  readonly body: string;
  readonly relatedEntityIds?: readonly string[];
  readonly relatedRedFlagIds?: readonly string[];
}

export interface EntryTimelineEvent {
  readonly date: string;
  readonly event: string;
  readonly source?: string;
}

// ─── Registry access ─────────────────────────────────────────────────────────

// Cast the JSON import to the typed registry. The JSON is validated against
// this shape via tsc (with resolveJsonModule), so a malformed entry fails
// build rather than runtime.
export const ENTRY_REGISTRY: readonly EntryMeta[] = registry as readonly EntryMeta[];

export const ENTRY_SLUGS = ENTRY_REGISTRY.map((e) => e.slug);

export function getEntryMeta(slug: string): EntryMeta | null {
  return ENTRY_REGISTRY.find((e) => e.slug === slug) ?? null;
}

// Returns the union of relatedEntityIds across all findings, deduplicated.
// Used to deep-link an entry into /graf?focus=... so the graph opens already
// zoomed to the actors relevant for that specific note.
export function getEntryFocusIds(slug: string): readonly string[] {
  const meta = getEntryMeta(slug);
  if (!meta) return [];
  const seen = new Set<string>();
  for (const f of meta.findings) {
    f.relatedEntityIds?.forEach((id) => seen.add(id));
  }
  return Array.from(seen);
}

// ─── Data loader ─────────────────────────────────────────────────────────────

export interface EntryFacts {
  readonly entities: readonly Entity[];
  readonly people: readonly Entity[];
  readonly orgs: readonly Entity[];
  readonly projects: readonly Entity[];
  readonly redFlags: readonly RedFlag[];
  readonly redFlagsHigh: number;
  readonly redFlagsMedium: number;
  readonly totalRelations: number;
  readonly allSources: readonly string[];
}

export interface LoadedEntry {
  readonly meta: EntryMeta;
  readonly caseStudy: CaseStudy;
  readonly facts: EntryFacts;
}

export async function loadEntry(slug: string): Promise<LoadedEntry | null> {
  const meta = getEntryMeta(slug);
  if (!meta) return null;

  try {
    const { readFile } = await import("fs/promises");
    const { join } = await import("path");
    const filePath = join(process.cwd(), "public", "data", meta.file);
    const raw = await readFile(filePath, "utf-8");
    const data: unknown = JSON.parse(raw);

    if (!isCaseStudy(data)) {
      console.error(`[entry] invalid case study: ${meta.file}`);
      return null;
    }

    const people = data.entities.filter((e) => e.type === "Person");
    const orgs = data.entities.filter((e) => e.type === "Organization");
    const projects = data.entities.filter((e) => e.type === "Project");
    const redFlagsHigh = data.red_flags.filter((rf) => rf.severity === "HIGH").length;
    const redFlagsMedium = data.red_flags.filter((rf) => rf.severity === "MEDIUM").length;

    const sources = new Set<string>();
    data.entities.forEach((e) => e.sumber?.forEach((s) => sources.add(s)));
    data.red_flags.forEach((rf) => rf.sumber?.forEach((s) => sources.add(s)));
    data.relations.forEach((r) => r.sumber?.forEach((s) => sources.add(s)));

    return {
      meta,
      caseStudy: data,
      facts: {
        entities: data.entities,
        people,
        orgs,
        projects,
        redFlags: data.red_flags,
        redFlagsHigh,
        redFlagsMedium,
        totalRelations: data.relations.length,
        allSources: Array.from(sources),
      },
    };
  } catch (err) {
    console.error(`[entry] failed to load ${meta.file}:`, err);
    return null;
  }
}

// Lightweight summaries for the index grid — no file reads.
export function getEntrySummaries(): readonly EntryMeta[] {
  return ENTRY_REGISTRY;
}

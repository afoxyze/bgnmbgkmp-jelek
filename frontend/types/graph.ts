// All TypeScript interfaces matching the case study JSON schema

export type EntityType = "Organization" | "Person" | "Project" | "LegalCase";

export type RedFlagSeverity = "HIGH" | "MEDIUM";

export interface Entity {
  readonly id: string;
  readonly type: EntityType;
  readonly label: string;
  readonly properties: Record<string, unknown>;
  readonly sumber: readonly string[];
}

export interface Relation {
  readonly from: string;
  readonly to: string;
  readonly type: string;
  readonly properties?: Record<string, unknown>;
  readonly sumber?: readonly string[];
}

export interface RedFlag {
  readonly id: string;
  readonly type: string;
  readonly severity: RedFlagSeverity;
  readonly deskripsi: string;
  readonly entitas_terlibat: readonly string[];
  readonly sumber: readonly string[];
}

export interface CaseStudyMetadata {
  readonly tanggal_riset: string;
  readonly sumber: string;
  readonly status: string;
}

export interface CaseStudy {
  readonly metadata: CaseStudyMetadata;
  readonly entities: readonly Entity[];
  readonly relations: readonly Relation[];
  readonly red_flags: readonly RedFlag[];
  readonly investigasi_lanjutan: readonly string[];
}

// Discriminated union for what is currently selected in the graph
export type GraphSelection =
  | { kind: "none" }
  | { kind: "entity"; entity: Entity }
  | { kind: "relation"; relation: Relation; fromEntity: Entity; toEntity: Entity };

// Type guards for runtime validation
export function isCaseStudy(data: unknown): data is CaseStudy {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    Array.isArray(d["entities"]) &&
    Array.isArray(d["relations"]) &&
    Array.isArray(d["red_flags"]) &&
    typeof d["metadata"] === "object" &&
    d["metadata"] !== null
  );
}

import type { Entity, EntityType, RedFlag, Relation } from "@/types/graph";

// Format technical relation types to clear Indonesian labels
export function formatRelationType(type: string): string {
  const mapping: Record<string, string> = {
    BENEFICIAL_OWNER: "Pemilik Manfaat",
    PEMILIK_MANFAAT: "Pemilik Manfaat",
    AWARDED_CONTRACT: "Menerima Kontrak",
    MENERIMA_KONTRAK: "Menerima Kontrak",
    PERSONAL_CONNECTION: "Koneksi Personal",
    KONEKSI_PERSONAL: "Koneksi Personal",
    LEADS: "Pemimpin / Direktur",
    MEMIMPIN: "Pemimpin / Direktur",
    BOARDS: "Dewan Komisaris",
    COMMISSIONER_AT: "Komisaris",
    SUBSIDIARY_OF: "Anak Perusahaan",
    PARENT_OF: "Induk Perusahaan",
    PARTNER_OF: "Mitra Strategis",
    MITRA_DARI: "Mitra Strategis",
    FUNDS: "Penyedia Pendanaan",
    MENDANAI: "Penyedia Pendanaan",
    SUPERVISES: "Pengawas Program",
    MANAGES: "Pengelola Operasional",
    ACQUIRED: "Mengakuisisi",
    FOUNDED: "Mendirikan",
    CONTROLS: "Pengendali Utama",
    OWNS: "Pemegang Saham",
    AFFILIATED_WITH: "Terafiliasi Dengan",
    TECH_PARTNER: "Mitra Teknologi",
    PROCESS_BY: "Verifikator Pengadaan",
    SHARES_FACILITY_WITH: "Berbagi Fasilitas Dengan",
  };

  if (mapping[type]) return mapping[type];

  // Fallback for unknown types: Title Case
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Convert camelCase properties to Title Case
export function formatPropertyKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Node colors per entity type — investigative dark-theme palette
export const NODE_COLORS: Record<string, string> = {
  Person: "#3B82F6",        // blue
  Orang: "#3B82F6",         // blue (alias)
  Organization: "#10B981",  // green
  Perusahaan: "#10B981",    // green (alias)
  Instansi: "#10B981",      // green (alias)
  Yayasan: "#10B981",       // green (alias)
  Project: "#F59E0B",       // amber
  Proyek: "#F59E0B",        // amber (alias)
  LegalCase: "#EF4444",     // red
  KasusHukum: "#EF4444",    // red (alias)
  Default: "#94A3B8",       // slate
};

export function getNodeColor(type: string): string {
  return (NODE_COLORS[type] || NODE_COLORS["Default"]) as string;
}

// Indonesian display labels per entity type
export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  Person: "Individu",
  Organization: "Organisasi",
  Project: "Proyek",
  LegalCase: "Kasus Hukum",
};

// Risk severity color mapping for UI components
export const SEVERITY_COLORS = {
  HIGH: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-600 dark:text-red-400",
    badge: "bg-red-500",
  },
  MEDIUM: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-500",
  },
  LOW: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-500",
  },
};

// Returns a set of all entity IDs mentioned in red flags
export function getRedFlagEntityIds(redFlags: readonly RedFlag[]): Set<string> {
  const ids = new Set<string>();
  for (const rf of redFlags) {
    if (rf.entitas_terlibat) {
      for (const eid of rf.entitas_terlibat) {
        ids.add(eid);
      }
    }
  }
  return ids;
}

// Get red flags specifically involving a given entity ID
export function getRedFlagsForEntity(
  redFlags: readonly RedFlag[],
  entityId: string
): RedFlag[] {
  return redFlags.filter((rf) => rf.entitas_terlibat && rf.entitas_terlibat.includes(entityId));
}

// Get relations specifically involving a given entity ID
export function getRelationsForEntity(
  relations: readonly Relation[],
  entityId: string
): Relation[] {
  return relations.filter((r) => r.from === entityId || r.to === entityId);
}

// Basic search utility for entities
export function findEntityById(
  entities: readonly Entity[],
  id: string
): Entity | undefined {
  return entities.find((e) => e.id === id);
}

// Truncate long labels for node display
export function truncateLabel(label: string, maxLength = 12): string {
  if (label.length <= maxLength) return label;
  return label.slice(0, maxLength - 1) + "…";
}

// Determine if a relation has a red_flag property set to true
export function isRedFlagRelation(relation: Relation): boolean {
  return relation.properties?.["red_flag"] === true || relation.properties?.["red_flag"] === "true";
}

"use client";

import { NodeBadge } from "@/components/NodeBadge";
import { RedFlagsPanel } from "@/components/RedFlagsPanel";
import { SourceLink } from "@/components/SourceLink";
import {
  findEntityById,
  formatPropertyKey,
  formatRelationType,
  getNodeColor,
  getRedFlagsForEntity,
  getRelationsForEntity,
} from "@/lib/graph-utils";
import type {
  CaseStudy,
  Entity,
  GraphSelection,
} from "@/types/graph";

interface DetailSidebarProps {
  caseStudy: CaseStudy;
  selection: GraphSelection;
  onSelectEntity: (entityId: string) => void;
  onHighlightRedFlagEntities: (entityIds: readonly string[]) => void;
  highlightedFlagId: string | null;
}

export function DetailSidebar({
  caseStudy,
  selection,
  onSelectEntity,
  onHighlightRedFlagEntities,
  highlightedFlagId,
}: DetailSidebarProps) {
  return (
    <aside
      className="flex flex-col h-full overflow-hidden"
      style={{
        backgroundColor: "var(--bg-sidebar)",
      }}
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {selection.kind === "none" && (
          <OverviewPanel caseStudy={caseStudy} />
        )}
        {selection.kind === "entity" && (
          <EntityPanel
            entity={selection.entity}
            caseStudy={caseStudy}
            onSelectEntity={onSelectEntity}
          />
        )}
        {selection.kind === "relation" && (
          <RelationPanel
            relation={selection}
            onSelectEntity={onSelectEntity}
          />
        )}
      </div>

      {/* Red Flags — pinned at bottom */}
      <div style={{ borderTop: "1px solid var(--border-base)" }} className="flex-shrink-0 bg-[var(--bg-surface)]">
        <div className="px-6 py-3 flex items-center gap-2 border-b border-[var(--border-base)]">
          <span className="text-[11px] font-bold text-red-500 uppercase tracking-[0.15em]">
            Panel Investigasi
          </span>
          <span className="ml-auto text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
            {caseStudy.red_flags.length} KASUS
          </span>
        </div>
        <div className="max-h-64 overflow-y-auto pb-4 bg-[var(--bg-surface-2)]">
          <RedFlagsPanel
            redFlags={caseStudy.red_flags}
            onHighlightEntities={onHighlightRedFlagEntities}
            highlightedFlagId={highlightedFlagId}
          />
        </div>
      </div>
    </aside>
  );
}

// ─── Shared UI Components ───────────────────────────────────────────────────

function PanelHeader({ 
  title, 
  subtitle, 
  badge, 
  isDanger = false 
}: { 
  title: string; 
  subtitle?: string; 
  badge?: React.ReactNode;
  isDanger?: boolean;
}) {
  return (
    <div 
      className="p-6 border-b sticky top-0 z-20 shadow-sm" 
      style={{ 
        backgroundColor: "var(--bg-surface)", // SOLID background to prevent scroll bleed
        borderColor: isDanger ? "var(--accent-danger-border)" : "var(--border-base)"
      }}
    >
      {/* Subtle danger tint overlay that doesn't compromise background solidity */}
      {isDanger && <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />}
      
      <div className="relative z-10">
        {subtitle && (
          <div className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${isDanger ? 'text-red-500' : 'text-[var(--text-tertiary)]'}`}>
            {subtitle}
          </div>
        )}
        {badge && <div className="mb-3">{badge}</div>}
        <h2 
          className={`text-2xl font-bold leading-tight ${isDanger ? 'text-red-600 dark:text-red-400' : 'text-[var(--text-primary)]'}`}
          style={{ fontFamily: "'IBM Plex Serif', serif" }}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] uppercase tracking-[0.15em] font-bold" style={{ color: "var(--text-tertiary)" }}>
      {children}
    </span>
  );
}

function StatCard({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <div
      className={`rounded-xl px-3 py-4 text-center border transition-colors ${danger ? 'bg-red-500/5 border-red-500/20' : 'bg-[var(--bg-surface-2)] border-[var(--border-base)]'}`}
    >
      <div className={`text-2xl font-mono font-bold ${danger ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>
        {value}
      </div>
      <div className={`text-[10px] uppercase tracking-widest mt-1 ${danger ? 'text-red-600/70 font-bold' : 'text-[var(--text-secondary)]'}`}>
        {label}
      </div>
    </div>
  );
}

// ─── Panels ──────────────────────────────────────────────────────────────────

function OverviewPanel({ caseStudy }: { caseStudy: CaseStudy }) {
  const highCount = caseStudy.red_flags.filter((rf) => rf.severity === "HIGH").length;
  const medCount = caseStudy.red_flags.filter((rf) => rf.severity === "MEDIUM").length;

  return (
    <div className="flex flex-col">
      <PanelHeader 
        title="Audit Jaringan & Pengadaan Strategis" 
        subtitle={`UPDATE: ${caseStudy.metadata.tanggal_riset}`}
        badge={
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-amber-700 bg-amber-500/20 border border-amber-500/30">
            {caseStudy.metadata.status}
          </span>
        }
      />
      
      <div className="p-6 flex flex-col gap-8">
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Relasi" value={caseStudy.relations.length} />
          <StatCard label="Entitas" value={caseStudy.entities.length} />
          <StatCard label="Indikasi" value={caseStudy.red_flags.length} danger />
        </div>

        <div className="p-5 rounded-xl border bg-[var(--bg-surface)] shadow-sm" style={{ borderColor: "var(--border-base)" }}>
          <SectionLabel>Pemetaan Risiko</SectionLabel>
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-danger)] shadow-[0_0_8px_var(--accent-danger)] flex-shrink-0" />
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Risiko Tinggi (HIGH)
              </span>
              <span className="ml-auto text-sm text-[var(--accent-danger)] font-mono font-bold">
                {highCount}
              </span>
              </div>
              <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-warning)] shadow-[0_0_8px_var(--accent-warning)] flex-shrink-0" />
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Risiko Sedang (MEDIUM)
              </span>
              <span className="ml-auto text-sm text-[var(--accent-warning)] font-mono font-bold">
                {medCount}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs leading-relaxed text-blue-600 dark:text-blue-400">
          <strong>Tip Interaksi:</strong> Klik simpul atau garis relasi pada graf untuk melihat profil detail.
        </div>
      </div>
    </div>
  );
}

function EntityPanel({ entity, caseStudy, onSelectEntity }: { entity: Entity; caseStudy: CaseStudy; onSelectEntity: (id: string) => void }) {
  const entityRedFlags = getRedFlagsForEntity(caseStudy.red_flags, entity.id);
  const connectedRelations = getRelationsForEntity(caseStudy.relations, entity.id);
  const uniqueConnected = connectedRelations.flatMap(r => r.from === entity.id ? [r.to] : [r.from])
    .map(id => findEntityById(caseStudy.entities, id))
    .filter((e, i, arr): e is Entity => !!e && arr.findIndex(x => x?.id === e.id) === i);

  return (
    <div className="flex flex-col">
      <PanelHeader 
        title={entity.label} 
        subtitle="DETAIL PROFIL ENTITAS" 
        badge={<NodeBadge type={entity.type} />} 
      />

      <div className="p-6 flex flex-col gap-8">
        {entityRedFlags.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <SectionLabel>Indikasi Masalah</SectionLabel>
            </div>
            <div className="flex flex-col gap-3">
              {entityRedFlags.map(rf => (
                <div key={rf.id} className={`p-4 rounded-xl border ${rf.severity === "HIGH" ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${rf.severity === "HIGH" ? 'bg-red-500' : 'bg-amber-500'} text-white`}>{rf.severity}</span>
                    <span className="text-[11px] font-mono text-[var(--text-secondary)] truncate">{formatRelationType(rf.type)}</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${rf.severity === "HIGH" ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'}`}>{rf.deskripsi}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <SectionLabel>Profil Entitas</SectionLabel>
          <dl className="mt-4 grid grid-cols-1 gap-4 bg-[var(--bg-surface-2)] p-5 rounded-xl border border-[var(--border-base)]">
            {Object.entries(entity.properties).filter(([k]) => k !== "red_flag").map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1 border-b border-[var(--border-base)] pb-3 last:border-0 last:pb-0">
                <dt className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-tertiary)]">{formatPropertyKey(key)}</dt>
                <dd className="text-sm font-medium leading-relaxed text-[var(--text-primary)]">{formatPropertyValue(value)}</dd>
              </div>
            ))}
          </dl>
        </div>

        {uniqueConnected.length > 0 && (
          <div>
            <SectionLabel>Jaringan Relasi ({uniqueConnected.length})</SectionLabel>
            <div className="mt-3 flex flex-col gap-1 bg-[var(--bg-surface-2)] p-2 rounded-xl border border-[var(--border-base)]">
              {uniqueConnected.map(c => (
                <button key={c.id} onClick={() => onSelectEntity(c.id)} className="flex items-center gap-3 text-left py-2 px-3 rounded-lg hover:bg-[var(--bg-surface)] transition-all group">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getNodeColor(c.type) }} />
                  <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] truncate">{c.label}</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 text-[var(--text-tertiary)]">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(entity.sumber) && entity.sumber.length > 0 && (
          <div>
            <SectionLabel>Dokumen Sumber</SectionLabel>
            <div className="mt-3 flex flex-col gap-2">{entity.sumber.map((url, i) => <SourceLink key={url} url={url} index={i} />)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function RelationPanel({ relation, onSelectEntity }: { relation: Extract<GraphSelection, { kind: "relation" }>; onSelectEntity: (id: string) => void }) {
  const { relation: rel, fromEntity, toEntity } = relation;
  const isRedFlag = rel.properties?.red_flag === true || rel.properties?.red_flag === "true";

  return (
    <div className="flex flex-col">
      <PanelHeader 
        title={formatRelationType(rel.type)} 
        subtitle="TIPE RELASI" 
        isDanger={isRedFlag} 
      />

      <div className="p-6 flex flex-col gap-8">
        <div className="p-4 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-base)] flex flex-col gap-3">
          <div>
            <SectionLabel>Dari (Sumber)</SectionLabel>
            <button onClick={() => onSelectEntity(fromEntity.id)} className="block w-full text-left text-sm font-medium mt-1 text-sky-600 dark:text-sky-400 hover:underline">{fromEntity.label}</button>
          </div>
          <div className="flex justify-center text-[var(--text-tertiary)]">↓</div>
          <div>
            <SectionLabel>Ke (Target)</SectionLabel>
            <button onClick={() => onSelectEntity(toEntity.id)} className="block w-full text-left text-sm font-medium mt-1 text-sky-600 dark:text-sky-400 hover:underline">{toEntity.label}</button>
          </div>
        </div>

        {rel.properties && Object.keys(rel.properties).length > 0 && (
          <div>
            <SectionLabel>Konteks Relasi</SectionLabel>
            <dl className="mt-4 grid grid-cols-1 gap-4 bg-[var(--bg-surface-2)] p-5 rounded-xl border border-[var(--border-base)]">
              {Object.entries(rel.properties).filter(([k]) => k !== "red_flag").map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1 border-b border-[var(--border-base)] pb-3 last:border-0 last:pb-0">
                  <dt className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-tertiary)]">{formatPropertyKey(key)}</dt>
                  <dd className="text-sm font-medium text-[var(--text-primary)]">{formatPropertyValue(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {Array.isArray(rel.sumber) && rel.sumber.length > 0 && (
          <div>
            <SectionLabel>Dokumen Sumber</SectionLabel>
            <div className="mt-3 flex flex-col gap-2">{rel.sumber.map((url, i) => <SourceLink key={url} url={url} index={i} />)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatPropertyValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  if (Array.isArray(value)) return value.map(String).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

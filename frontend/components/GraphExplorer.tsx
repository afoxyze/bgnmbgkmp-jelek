"use client";

import { DetailSidebar } from "@/components/DetailSidebar";
import { GraphViewer } from "@/components/GraphViewer";
import type { CaseStudy, GraphSelection } from "@/types/graph";
import { useState, useEffect, useCallback } from "react";
import { findEntityById } from "@/lib/graph-utils";

interface GraphExplorerProps {
  caseStudy: CaseStudy;
  isDark: boolean;
}

export function GraphExplorer({ caseStudy, isDark }: GraphExplorerProps) {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [graphStable, setGraphStable] = useState(false);
  const [selection, setSelection] = useState<GraphSelection>({ kind: "none" });
  const [highlightedEntityIds, setHighlightedEntityIds] = useState<ReadonlySet<string>>(new Set());
  const [focusNodeIds, setFocusNodeIds] = useState<readonly string[]>([]);
  const [highlightedFlagId, setHighlightedFlagId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGraphReady = useCallback(() => {
    setGraphStable(true);
  }, []);

  const handleSelectionChange = useCallback((next: GraphSelection) => {
    setSelection(next);
    setHighlightedEntityIds(new Set());
    setHighlightedFlagId(null);
  }, []);

  const handleSelectEntityById = useCallback((entityId: string) => {
    const entity = findEntityById(caseStudy.entities, entityId);
    if (entity) {
      setSelection({ kind: "entity", entity });
    }
  }, [caseStudy.entities]);

  const handleHighlightRedFlagEntities = useCallback((entityIds: readonly string[]) => {
    const ids = new Set(entityIds);
    setHighlightedEntityIds(ids);

    const matchingFlag = caseStudy.red_flags.find((rf) =>
      rf.entitas_terlibat.every((id) => ids.has(id)) &&
      rf.entitas_terlibat.length === entityIds.length
    );
    setHighlightedFlagId(matchingFlag?.id ?? null);
  }, [caseStudy.red_flags]);

  const SIDEBAR_WIDTH = 400;

  if (!mounted) return null;

  return (
    <div className="flex h-full w-full overflow-hidden bg-[var(--bg-base)] relative flex-row items-stretch">
      
      {/* 1. LEFT: THE GRAPH */}
      <main className="flex-1 relative min-w-0 h-full bg-[var(--bg-base)] z-0">
        <GraphViewer
          caseStudy={caseStudy}
          onSelectionChange={handleSelectionChange}
          highlightedEntityIds={highlightedEntityIds}
          focusNodeIds={focusNodeIds}
          isDark={isDark}
          sidebarOpen={sidebarOpen}
          onReady={handleGraphReady}
        />
        
        {!graphStable && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-base)]">
            <div className="w-10 h-10 border-2 rounded-full animate-spin border-[var(--border-strong)] border-t-[var(--accent-danger)]" />
            <p className="mt-4 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em]">Sinkronisasi Jaringan...</p>
          </div>
        )}
      </main>

      {/* 2. RIGHT: SIDEBAR (Sliding Container) */}
      <aside 
        className="hidden md:block flex-shrink-0 relative z-10 bg-[var(--bg-sidebar)] transition-all duration-300 ease-in-out border-l border-[var(--border-base)] overflow-hidden"
        style={{ 
          width: sidebarOpen ? `${SIDEBAR_WIDTH}px` : '0px',
        }}
      >
        <div style={{ width: `${SIDEBAR_WIDTH}px`, height: '100%' }}>
          <DetailSidebar
            caseStudy={caseStudy}
            selection={selection}
            onSelectEntity={handleSelectEntityById}
            onHighlightRedFlagEntities={handleHighlightRedFlagEntities}
            highlightedFlagId={highlightedFlagId}
          />
        </div>
      </aside>

      {/* 3. FLOATING TOGGLE BUTTON */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden md:flex fixed top-1/2 -translate-y-1/2 z-[100] w-6 h-12 items-center justify-center rounded-l-xl bg-[var(--bg-surface-2)] border border-[var(--border-base)] border-r-0 shadow-xl transition-all hover:bg-[var(--bg-interactive-hover)] cursor-pointer"
        style={{ 
          right: sidebarOpen ? `${SIDEBAR_WIDTH}px` : '0px',
          transition: 'right 0.3s ease-in-out'
        }}
        aria-label={sidebarOpen ? "Tutup panel detail" : "Buka panel detail"}
      >
        <span className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 12l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {/* 4. MOBILE OVERLAY */}
      <div className="md:hidden">
        <div 
          className={`fixed bottom-0 left-0 right-0 bg-[var(--bg-surface)] shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.3)] z-[1000] rounded-t-3xl transition-all duration-500 ease-out border-t border-[var(--border-base)] ${
            sidebarOpen ? 'h-[85vh]' : (selection.kind !== 'none' ? 'h-48' : 'h-14')
          }`}
        >
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex flex-col items-center py-3 active:bg-[var(--bg-interactive-active)] rounded-t-3xl"
          >
            <div className="w-12 h-1.5 bg-[var(--border-strong)] rounded-full mb-1" />
            {!sidebarOpen && selection.kind === 'none' && (
              <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
                Ketuk untuk Panel Investigasi
              </span>
            )}
          </button>
          <div className="h-full overflow-y-auto pb-20">
            <DetailSidebar
              caseStudy={caseStudy}
              selection={selection}
              onSelectEntity={handleSelectEntityById}
              onHighlightRedFlagEntities={handleHighlightRedFlagEntities}
              highlightedFlagId={highlightedFlagId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

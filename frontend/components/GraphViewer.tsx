"use client";

import {
  getRedFlagEntityIds,
  isRedFlagRelation,
  getNodeColor,
  formatRelationType,
  truncateLabel,
} from "@/lib/graph-utils";
import type {
  CaseStudy,
  Entity,
  GraphSelection,
  Relation,
} from "@/types/graph";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface CyTheme {
  bg: string;
  edgeColor: string;
  edgeLabel: string;
  nodeLabel: string;
  nodeTextBg: string;
  selectedNodeBorder: string;
  selectedEdge: string;
}

const GRAPH_THEME: Record<"light" | "dark", CyTheme> = {
  light: {
    bg: "#F8FAFC",
    edgeColor: "#CBD5E1",
    edgeLabel: "#334155",
    nodeLabel: "#334155",
    nodeTextBg: "#ffffff",
    selectedNodeBorder: "#000000",
    selectedEdge: "#F59E0B",
  },
  dark: {
    bg: "#020617",
    edgeColor: "#334155",
    edgeLabel: "#64748b",
    nodeLabel: "#94a3b8",
    nodeTextBg: "#0f172a",
    selectedNodeBorder: "#ffffff",
    selectedEdge: "#FBBF24",
  },
};

interface GraphViewerProps {
  caseStudy: CaseStudy;
  onSelectionChange: (selection: GraphSelection) => void;
  highlightedEntityIds: ReadonlySet<string>;
  focusNodeIds?: readonly string[];
  isDark: boolean;
  sidebarOpen: boolean;
  onReady?: () => void;
}

export function GraphViewer({
  caseStudy,
  onSelectionChange,
  highlightedEntityIds,
  focusNodeIds,
  isDark,
  sidebarOpen,
  onReady,
}: GraphViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const redFlagIds = useMemo(() => getRedFlagEntityIds(caseStudy.red_flags), [caseStudy.red_flags]);
  const theme = isDark ? GRAPH_THEME.dark : GRAPH_THEME.light;

  const buildStyle = useCallback((t: CyTheme) => {
    return [
      {
        selector: "node",
        style: {
          "background-color": "data(color)",
          "background-opacity": 0.8,
          label: "data(label)",
          color: t.nodeLabel,
          "font-size": "data(fontSize)",
          "font-weight": 600,
          "font-family": "Inter, system-ui, sans-serif",
          "text-valign": "bottom" as const,
          "text-margin-y": 12,
          "text-wrap": "wrap",
          "text-max-width": "120px",
          "line-height": 1.2,
          "text-outline-color": t.bg,
          "text-outline-width": 2,
          "text-outline-opacity": 1,
          width: "data(size)",
          height: "data(size)",
          "border-width": 3,
          "border-color": "data(color)",
          "border-opacity": 1,
          "underlay-color": "data(color)",
          "underlay-padding": "8px",
          "underlay-opacity": 0.15,
          "underlay-shape": "ellipse",
          "z-index": 1,
          "text-events": "yes",
          "overlay-padding": "6px",
          "overlay-color": "#ffffff",
          "overlay-opacity": 0,
          "transition-property": "background-color, line-color, target-arrow-color, width, height, border-width",
          "transition-duration": 250,
        },
      },
      {
        selector: "node[?hasFlag]",
        style: {
          "border-width": 4,
          "border-color": "#EF4444",
          "border-opacity": 1,
          "underlay-color": "#EF4444",
          "underlay-padding": "12px",
          "underlay-opacity": 0.4,
        },
      },
      {
        selector: "node:selected",
        style: {
          "border-width": 4,
          "border-color": t.selectedNodeBorder,
          "border-opacity": 1,
          "background-opacity": 1,
          "underlay-color": t.selectedNodeBorder,
          "underlay-padding": "15px",
          "underlay-opacity": 0.3,
        },
      },
      {
        selector: "edge",
        style: {
          width: "data(width)",
          "line-color": "data(lineColor)",
          "target-arrow-color": "data(lineColor)",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier",
          label: "data(label)",
          "font-size": "8px",
          color: t.edgeLabel,
          "text-rotation": "autorotate",
          "text-background-opacity": 1,
          "text-background-color": t.bg,
          "text-background-padding": "4px",
          "line-opacity": 0.6,
        },
      },
      {
        selector: "edge[?isRedFlag]",
        style: {
          "line-color": "#EF4444",
          "target-arrow-color": "#EF4444",
          "line-style": "dashed",
          "line-dash-pattern": [6, 3],
          width: 2.5,
          "line-opacity": 0.9,
        },
      },
      {
        selector: "node:selected",
        style: {
          "border-width": 6,
          "border-color": t.selectedNodeBorder,
          "border-opacity": 1,
          "background-opacity": 1,
          "z-index": 100,
        },
      },
      {
        selector: "edge:selected",
        style: {
          width: 4,
          "line-color": "data(lineColor)",
          "target-arrow-color": "data(lineColor)",
          "line-opacity": 1,
          "z-index": 100,
        },
      },
    ];
  }, []);

  const elements = useMemo(() => {
    const nodeIds = new Set(caseStudy.entities.map((e) => e.id));
    const degrees: Record<string, number> = {};
    caseStudy.relations.forEach(rel => {
      if (nodeIds.has(rel.from) && nodeIds.has(rel.to)) {
        degrees[rel.from] = (degrees[rel.from] || 0) + 1;
        degrees[rel.to] = (degrees[rel.to] || 0) + 1;
      }
    });

    const nodes = caseStudy.entities.map((entity: Entity) => {
      const degree = degrees[entity.id] || 0;
      const size = Math.min(50, 25 + (degree * 4));
      const hasFlag = redFlagIds.has(entity.id) || (typeof entity.properties["red_flag"] === "string" && (entity.properties["red_flag"] as string).length > 0);

      return {
        data: {
          id: entity.id,
          label: entity.label,
          fullLabel: entity.label,
          color: getNodeColor(entity.type),
          size: size,
          fontSize: Math.min(12, 9 + (degree * 0.5)),
          hasFlag: hasFlag,
        },
      };
    });

    const edges = caseStudy.relations
      .filter((rel) => nodeIds.has(rel.from) && nodeIds.has(rel.to))
      .map((rel: Relation, idx: number) => {
        const isRedFlag = isRedFlagRelation(rel);
        
        // Semantic Edge Styling based on relation type
        let lineColor = theme.edgeColor;
        let width = 1.5;

        const type = rel.type.toUpperCase();
        if (type.includes("OWNER") || type.includes("OWNS") || type.includes("CONTROLS") || type.includes("PARENT")) {
          lineColor = isDark ? "#60A5FA" : "#3B82F6"; // Blue for ownership
          width = 2.2;
        } else if (type.includes("CONTRACT") || type.includes("FUNDS") || type.includes("MENDANAI")) {
          lineColor = isDark ? "#34D399" : "#10B981"; // Green for finance/contracts
          width = 2.2;
        } else if (type.includes("CONNECTION") || type.includes("AFFILIATED")) {
          lineColor = isDark ? "#94A3B8" : "#64748B"; // Slate for personal connections
          width = 1.2;
        }

        return {
          data: {
            id: `edge-${idx}`,
            source: rel.from,
            target: rel.to,
            label: formatRelationType(rel.type),
            relationType: rel.type,
            isRedFlag: isRedFlag,
            lineColor: isRedFlag ? "#EF4444" : lineColor,
            width: width,
          },
        };
      });

    return [...nodes, ...edges];
  }, [caseStudy, redFlagIds, theme.edgeColor, isDark]);

  // Handle elements change
  useEffect(() => {
    if (!cyRef.current || !isLoaded) return;
    
    const cy = cyRef.current;
    
    // Stop any existing layouts or animations to prevent 'notify' error
    cy.stop();

    cy.batch(() => {
      cy.elements().remove();
      cy.add(elements);
    });

    const layout = cy.layout({ 
      name: "cose", 
      animate: true,
      animationDuration: 1000,
      padding: 30,
      nodeOverlap: 50,
      componentSpacing: 150,
      refresh: 20,
      fit: true,
      idealEdgeLength: (edge: any) => 150,
      edgeElasticity: (edge: any) => 100,
      nodeRepulsion: (node: any) => 1000000,
      nestingFactor: 1.2,
      gravity: 0.1,
      initialTemp: 300,
      coolingFactor: 0.99,
      minTemp: 1.0,
      randomize: false
    });
    
    layout.run();
  }, [elements, isLoaded]);

  // Initial Mount
  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;
    let cyInstance: any = null;

    const init = async () => {
      try {
        const cytoscape = (await import("cytoscape")).default;
        if (destroyed || !containerRef.current) return;

        cyInstance = cytoscape({
          container: containerRef.current,
          elements: elements,
          style: buildStyle(theme) as any[],
          minZoom: 0.05,
          maxZoom: 3,
        });

        cyInstance.on("tap", "node", (evt: any) => {
          if (destroyed) return;
          const entity = caseStudy.entities.find((e) => e.id === evt.target.id());
          if (entity) onSelectionChange({ kind: "entity", entity });
        });

        cyInstance.on("tap", "edge", (evt: any) => {
          if (destroyed) return;
          const data = evt.target.data();
          const relation = caseStudy.relations.find(r => r.from === data.source && r.to === data.target && r.type === data.relationType);
          const fromEntity = caseStudy.entities.find(e => e.id === data.source);
          const toEntity = caseStudy.entities.find(e => e.id === data.target);
          if (relation && fromEntity && toEntity) {
            onSelectionChange({ kind: "relation", relation, fromEntity, toEntity });
          }
        });

        cyInstance.on("tap", (evt: any) => {
          if (destroyed) return;
          if (evt.target === cyInstance) onSelectionChange({ kind: "none" });
        });

        cyRef.current = cyInstance;

        const layout = cyInstance.layout({ 
          name: "cose", 
          animate: true,
          animationDuration: 1000,
          padding: 30,
          nodeOverlap: 50,
          componentSpacing: 150,
          refresh: 20,
          fit: true,
          idealEdgeLength: (edge: any) => 150,
          edgeElasticity: (edge: any) => 100,
          nodeRepulsion: (node: any) => 1000000,
          nestingFactor: 1.2,
          gravity: 0.1,
          initialTemp: 300,
          coolingFactor: 0.99,
          minTemp: 1.0,
          randomize: true
        });

        layout.one("layoutstop", () => {
          if (destroyed) return;
          setIsLoaded(true);
          if (onReady) onReady();
        });

        layout.run();
      } catch (err) {
        console.error("Cytoscape init error:", err);
      }
    };

    init();

    return () => {
      destroyed = true;
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cyRef.current && isLoaded) {
      cyRef.current.style(buildStyle(theme) as any[]);
    }
  }, [theme, isLoaded, buildStyle]);

  useEffect(() => {
    if (cyRef.current && isLoaded) {
      const timer = setTimeout(() => {
        cyRef.current.resize();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [sidebarOpen, isLoaded]);

  function handleFitGraph() {
    if (cyRef.current) cyRef.current.fit(undefined, 30);
  }

  return (
    <div className="relative w-full h-full" style={{ backgroundColor: theme.bg }}>
      <div ref={containerRef} className="w-full h-full" />
      
      {isLoaded && (
        <>
          {/* Zoom Control */}
          <button
            onClick={handleFitGraph}
            className="absolute bottom-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-surface)] shadow-lg border border-[var(--border-base)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-20"
            title="Reset Zoom"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          {/* Legend Panel */}
          <div className="absolute bottom-6 left-6 rounded-2xl p-4 bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-base)] shadow-xl hidden md:flex flex-col gap-3 z-20 min-w-[160px]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1 text-center">Legenda Investigasi</span>
            
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase block border-b border-[var(--border-base)] pb-1">Entitas</span>
              {[
                ["Individu", "#3B82F6"],
                ["Organisasi", "#10B981"],
                ["Proyek", "#F59E0B"],
                ["Kasus Hukum", "#EF4444"],
              ].map(([label, color]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                  <span className="text-[11px] font-medium text-[var(--text-secondary)]">{label}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mt-1">
              <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase block border-b border-[var(--border-base)] pb-1">Kategori Relasi</span>
              <div className="flex items-center gap-3">
                <div className="w-6 h-1 rounded-full shadow-sm" style={{ backgroundColor: "#3B82F6" }} />
                <span className="text-[11px] font-medium text-[var(--text-secondary)]">Kepemilikan & Kendali</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-1 rounded-full shadow-sm" style={{ backgroundColor: "#10B981" }} />
                <span className="text-[11px] font-medium text-[var(--text-secondary)]">Kontrak & Pendanaan</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-1 rounded-full shadow-sm" style={{ backgroundColor: "#64748B" }} />
                <span className="text-[11px] font-medium text-[var(--text-secondary)]">Afiliasi & Koneksi</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 border-t-2 border-dashed border-[#EF4444]" />
                <span className="text-[11px] font-bold text-red-500">Red Flag (Risiko)</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

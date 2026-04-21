"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NodeBadge } from "@/components/NodeBadge";
import { SourceLink } from "@/components/SourceLink";
import {
  formatPropertyKey,
  formatRelationType,
  getRedFlagsForEntity,
  getRelationsForEntity,
  findEntityById,
  SEVERITY_COLORS,
  NODE_COLORS,
} from "@/lib/graph-utils";
import type { CaseStudy, Entity, RedFlag, Relation } from "@/types/graph";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  source: string;
  summary: string;
  url: string;
  linked_entities: string[];
}

interface EntityDetailPageProps {
  entity: Entity;
  caseStudy: CaseStudy;
}

export function EntityDetailPage({ entity, caseStudy }: EntityDetailPageProps) {
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  
  const redFlags = getRedFlagsForEntity(caseStudy.red_flags, entity.id);
  const relations = getRelationsForEntity(caseStudy.relations, entity.id);

  useEffect(() => {
    fetch("/data/news_links.json")
      .then(res => res.json())
      .then((data: NewsItem[]) => {
        const filtered = data.filter(news => 
          news.linked_entities.some(le => le.toUpperCase() === entity.label.toUpperCase())
        );
        setRelatedNews(filtered);
      })
      .catch(err => console.error("Error loading news:", err));
  }, [entity.label]);

  // Resolve connected entities with their relation context
  const connectedItems = relations.map((r) => {
    const otherId = r.from === entity.id ? r.to : r.from;
    const direction = r.from === entity.id ? "out" : "in";
    const other = findEntityById(caseStudy.entities, otherId);
    return { relation: r, other, direction } as const;
  }).filter((item): item is { relation: Relation; other: Entity; direction: "in" | "out" } =>
    item.other !== undefined
  );

  const properties = Object.entries(entity.properties).filter(
    ([k]) => k !== "red_flag"
  );

  return (
    <div className="content-page">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-6 text-xs" aria-label="Navigasi halaman">
          <Link href="/" className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">Beranda</Link>
          <BreadcrumbSep />
          <Link href="/cari" className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">Cari</Link>
          <BreadcrumbSep />
          <span className="truncate max-w-[200px] text-[var(--text-secondary)]">{entity.label}</span>
        </nav>

        {/* Entity header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <NodeBadge type={entity.type} />
            {redFlags.length > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded font-medium text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20">
                {redFlags.length} indikasi
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold leading-tight text-[var(--text-primary)]">
            {entity.label}
          </h1>
        </div>

        <div className="flex flex-col gap-10">
          {/* Profil */}
          {properties.length > 0 && (
            <Section title="Profil">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {properties.map(([key, value]) => (
                  <div key={key} className="border-b border-[var(--border-subtle)] pb-2 md:border-0 md:pb-0">
                    <dt className="text-[10px] uppercase tracking-wider font-bold mb-0.5 text-[var(--text-tertiary)]">
                      {formatPropertyKey(key)}
                    </dt>
                    <dd className="text-sm leading-relaxed text-[var(--text-primary)]">
                      {formatPropertyValue(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          {/* Relasi */}
          {connectedItems.length > 0 && (
            <Section title="Relasi">
              <div className="flex flex-col gap-2">
                {connectedItems.map(({ relation, other, direction }) => (
                  <RelationRow
                    key={`${relation.from}-${relation.to}-${relation.type}`}
                    relation={relation}
                    entity={other}
                    direction={direction}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* RED FLAG */}
          {redFlags.length > 0 && (
            <Section title="RED FLAG">
              <div className="flex flex-col gap-3">
                {redFlags.map((rf) => (
                  <RedFlagCard key={rf.id} redFlag={rf} />
                ))}
              </div>
            </Section>
          )}

          {/* Berita Terkait (SMOKING GUNS) */}
          {relatedNews.length > 0 && (
            <Section title="Berita Terkait">
              <div className="flex flex-col gap-4">
                {relatedNews.map((news) => (
                  <a 
                    key={news.id} 
                    href={news.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-4 rounded-xl border bg-[var(--bg-surface)] hover:border-[var(--accent-danger)] transition-all group"
                    style={{ borderColor: "var(--border-base)" }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-[10px] font-bold text-[var(--accent-danger)] uppercase tracking-widest">{news.source} · {news.date}</div>
                      <svg className="w-3 h-3 text-gray-500 group-hover:text-[var(--accent-danger)] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-danger)] transition-colors mb-2 leading-tight">
                      {news.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {news.summary}
                    </p>
                  </a>
                ))}
              </div>
            </Section>
          )}

          {/* Sumber */}
          {Array.isArray(entity.sumber) && entity.sumber.length > 0 && (
            <Section title="Sumber Data Primer">
              <div className="flex flex-col gap-0.5">
                {entity.sumber.map((url, i) => (
                  <SourceLink key={url} url={url} index={i} />
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-[var(--border-base)]">
          <Link href="/cari" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Kembali ke pencarian
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-5 text-[var(--text-tertiary)] border-b border-[var(--border-subtle)] pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

interface RelationRowProps {
  relation: Relation;
  entity: Entity;
  direction: "in" | "out";
}

function RelationRow({ relation, entity, direction }: RelationRowProps) {
  const color = NODE_COLORS[entity.type];
  const label = direction === "out"
    ? `→ ${formatRelationType(relation.type)}`
    : `← ${formatRelationType(relation.type)}`;

  return (
    <Link
      href={`/entitas/${entity.id}`}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-base)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-raised)] transition-all group"
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase font-bold mb-0.5 text-[var(--text-tertiary)]">{label}</p>
        <p className="text-sm font-bold text-[var(--text-primary)] truncate">{entity.label}</p>
      </div>
      <svg className="w-4 h-4 text-[var(--text-tertiary)] transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </Link>
  );
}

function RedFlagCard({ redFlag }: { redFlag: RedFlag }) {
  const colors = SEVERITY_COLORS[redFlag.severity];
  return (
    <div className={`px-5 py-4 rounded-xl border ${colors.bg} ${colors.border} shadow-sm`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
          {redFlag.severity}
        </span>
        <span className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">
          {formatRelationType(redFlag.type)}
        </span>
      </div>
      <p className={`text-sm leading-relaxed font-medium ${colors.text}`}>
        {redFlag.deskripsi}
      </p>
      {Array.isArray(redFlag.sumber) && redFlag.sumber.length > 0 && (
        <div className="mt-4 flex flex-col gap-1">
          {redFlag.sumber.map((url, i) => (
            <SourceLink key={url} url={url} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function BreadcrumbSep() {
  return <svg className="w-3 h-3 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 12 12"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function formatPropertyValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  if (Array.isArray(value)) return (value as unknown[]).map(String).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

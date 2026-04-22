// KONEKSI.ID — /dossier/[slug] page
// Server component. Renders a single investigation dossier.

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { loadDossier, DOSSIER_SLUGS, getDossierSummaries } from "@/lib/dossier";
import { SITE_CONFIG } from "@/lib/constants";
import { DossierHero } from "@/components/dossier/DossierHero";
import { KeyFactsGrid } from "@/components/dossier/KeyFactsGrid";
import { FindingsList } from "@/components/dossier/FindingsList";
import { DossierTimeline } from "@/components/dossier/DossierTimeline";
import { ActorGrid } from "@/components/dossier/ActorGrid";
import { SourcesBlock } from "@/components/dossier/SourcesBlock";
import { RelatedDossiers } from "@/components/dossier/RelatedDossiers";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return DOSSIER_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dossier = await loadDossier(slug);
  if (!dossier) return { title: `${SITE_CONFIG.NAME} — Dossier tidak ditemukan` };
  return {
    title: `${dossier.meta.title} — ${SITE_CONFIG.NAME}`,
    description: dossier.meta.lede.slice(0, 180),
  };
}

export default async function DossierPage({ params }: PageProps) {
  const { slug } = await params;
  const dossier = await loadDossier(slug);
  if (!dossier) notFound();

  const others = getDossierSummaries().filter((d) => d.slug !== slug);

  return (
    <main className="content-page" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 clamp(1rem, 3vw, 2rem)" }}>
        {/* Breadcrumb */}
        <nav
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
            padding: "1.5rem 0",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.688rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
          }}
        >
          <Link href="/" style={{ color: "var(--text-tertiary)", textDecoration: "none" }}>Beranda</Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <span>Dossier</span>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: "var(--accent-danger)" }}>{dossier.meta.code}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: "0.625rem" }}>
            Diperbarui {dossier.caseStudy.metadata.tanggal_riset}
          </span>
        </nav>

        <DossierHero meta={dossier.meta} facts={dossier.facts} status={dossier.caseStudy.metadata.status} />
        <KeyFactsGrid facts={dossier.facts} meta={dossier.meta} />
        <FindingsList findings={dossier.meta.findings} redFlags={dossier.facts.redFlags} entities={dossier.facts.entities} />
        <DossierTimeline events={dossier.meta.timeline} />
        <ActorGrid people={dossier.facts.people} orgs={dossier.facts.orgs} projects={dossier.facts.projects} />
        <SourcesBlock sources={dossier.facts.allSources} primarySource={dossier.caseStudy.metadata.sumber} />
        <RelatedDossiers dossiers={others} />
      </div>
    </main>
  );
}

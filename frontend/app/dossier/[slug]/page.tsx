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
  if (!dossier) {
    return {
      title: "Catatan tidak ditemukan",
      robots: { index: false, follow: false },
    };
  }

  const url = `${SITE_CONFIG.URL}/dossier/${slug}`;
  const title = dossier.meta.title;
  const description = dossier.meta.lede.slice(0, 180);
  const ogImage = `/og/dossier-${slug}.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_CONFIG.NAME,
      title: `${title} - ${SITE_CONFIG.NAME}`,
      description,
      locale: "id_ID",
      publishedTime: dossier.caseStudy.metadata.tanggal_riset,
      modifiedTime: dossier.caseStudy.metadata.tanggal_riset,
      tags: [dossier.meta.categoryLong, dossier.meta.categoryShort, dossier.meta.thread],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${SITE_CONFIG.NAME}`,
      description,
      images: [ogImage],
    },
  };
}

export default async function DossierPage({ params }: PageProps) {
  const { slug } = await params;
  const dossier = await loadDossier(slug);
  if (!dossier) notFound();

  const others = getDossierSummaries().filter((d) => d.slug !== slug);

  // JSON-LD structured data for search engines.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: dossier.meta.title,
    description: dossier.meta.lede,
    datePublished: dossier.caseStudy.metadata.tanggal_riset,
    dateModified: dossier.caseStudy.metadata.tanggal_riset,
    author: { "@type": "Organization", name: SITE_CONFIG.NAME, url: SITE_CONFIG.URL },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.NAME,
      url: SITE_CONFIG.URL,
      logo: { "@type": "ImageObject", url: `${SITE_CONFIG.URL}/og-image.png` },
    },
    mainEntityOfPage: `${SITE_CONFIG.URL}/dossier/${slug}`,
    keywords: [
      dossier.meta.categoryLong,
      dossier.meta.categoryShort,
      dossier.meta.thread,
    ].join(", "),
    isBasedOn: dossier.facts.allSources,
  };

  return (
    <main className="content-page" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 clamp(1rem, 3vw, 2rem)" }}>
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
          <span>Catatan</span>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: "var(--accent-danger)" }}>{dossier.meta.code}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: "0.625rem" }}>
            Diperbarui {dossier.caseStudy.metadata.tanggal_riset}
          </span>
        </nav>

        <DossierHero meta={dossier.meta} facts={dossier.facts} status={dossier.caseStudy.metadata.status} lastUpdated={dossier.caseStudy.metadata.tanggal_riset} />
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

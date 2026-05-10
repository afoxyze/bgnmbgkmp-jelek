import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { loadEntry, ENTRY_SLUGS, getEntrySummaries } from "@/lib/entry";
import { SITE_CONFIG } from "@/lib/constants";
import { EntryHero } from "@/components/entry/EntryHero";
import { KeyFactsGrid } from "@/components/entry/KeyFactsGrid";
import { FindingsList } from "@/components/entry/FindingsList";
import { EntryTimeline } from "@/components/entry/EntryTimeline";
import { ActorGrid } from "@/components/entry/ActorGrid";
import { SourcesBlock } from "@/components/entry/SourcesBlock";
import { RelatedEntries } from "@/components/entry/RelatedEntries";
import { ShareButtons } from "@/components/ShareButtons";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ENTRY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await loadEntry(slug);
  if (!entry) {
    return {
      title: "Entri tidak ditemukan",
      robots: { index: false, follow: false },
    };
  }

  const url = `${SITE_CONFIG.URL}/etalase/${slug}`;
  const title = entry.meta.title;
  const description = entry.meta.lede.slice(0, 180);
  const ogImage = `/og/entry-${slug}.png`;

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
      publishedTime: entry.caseStudy.metadata.tanggal_riset,
      modifiedTime: entry.caseStudy.metadata.tanggal_riset,
      tags: [entry.meta.categoryLong, entry.meta.categoryShort, entry.meta.thread],
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

export default async function EntriPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await loadEntry(slug);
  if (!entry) notFound();

  const others = getEntrySummaries().filter((d) => d.slug !== slug);

  // JSON-LD structured data for search engines.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.meta.title,
    description: entry.meta.lede,
    datePublished: entry.caseStudy.metadata.tanggal_riset,
    dateModified: entry.caseStudy.metadata.tanggal_riset,
    author: { "@type": "Organization", name: SITE_CONFIG.NAME, url: SITE_CONFIG.URL },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.NAME,
      url: SITE_CONFIG.URL,
      logo: { "@type": "ImageObject", url: `${SITE_CONFIG.URL}/og-image.png` },
    },
    mainEntityOfPage: `${SITE_CONFIG.URL}/etalase/${slug}`,
    keywords: [
      entry.meta.categoryLong,
      entry.meta.categoryShort,
      entry.meta.thread,
    ].join(", "),
    isBasedOn: entry.facts.allSources,
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
          <span>Etalase</span>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: "var(--accent-danger)" }}>{entry.meta.code}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: "0.625rem" }}>
            Diperbarui {entry.caseStudy.metadata.tanggal_riset}
          </span>
        </nav>

        <EntryHero meta={entry.meta} facts={entry.facts} status={entry.caseStudy.metadata.status} lastUpdated={entry.caseStudy.metadata.tanggal_riset} />
        <div className="py-6 border-b border-[var(--border-base)]">
          <ShareButtons
            url={`${SITE_CONFIG.URL}/etalase/${slug}`}
            title={entry.meta.title}
            description={entry.meta.subtitle}
          />
        </div>
        <KeyFactsGrid facts={entry.facts} meta={entry.meta} />
        <FindingsList findings={entry.meta.findings} redFlags={entry.facts.redFlags} entities={entry.facts.entities} />
        <EntryTimeline events={entry.meta.timeline} />
        <ActorGrid people={entry.facts.people} orgs={entry.facts.orgs} projects={entry.facts.projects} />
        <SourcesBlock sources={entry.facts.allSources} primarySource={entry.caseStudy.metadata.sumber} />
        <RelatedEntries entries={others} />
      </div>
    </main>
  );
}

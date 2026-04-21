import { GraphPage } from "@/components/GraphPage";

/**
 * Server page component for the graph explorer.
 * No data fetching here to prevent SSR-related text flashes.
 * The Client component (GraphPage) handles data fetching via API.
 */
export default function Page() {
  return <GraphPage caseStudy={null} />;
}

import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Peta SPPG",
  description:
    "Peta sebaran 27.000+ Satuan Pelayanan Pemenuhan Gizi (SPPG) program Makan Bergizi Gratis. Data resmi BGN.",
};

export default function SPPGLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Prefetch the large dataset as soon as the SPPG route is mounted.
          Browser can fetch it in parallel with HTML/JS rather than waiting
          for the client component's useEffect to fire. */}
      <link rel="preload" as="fetch" href="/data/sppg_points.json" crossOrigin="anonymous" />
      <Suspense fallback={null}>{children}</Suspense>
    </>
  );
}

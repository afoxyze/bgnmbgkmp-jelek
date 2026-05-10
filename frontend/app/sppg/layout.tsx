import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peta SPPG",
  description:
    "Peta sebaran 27.000+ Satuan Pelayanan Pemenuhan Gizi (SPPG) program Makan Bergizi Gratis. Data resmi BGN.",
};

export default function SPPGLayout({ children }: { children: React.ReactNode }) {
  return children;
}

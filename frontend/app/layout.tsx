import type { Metadata } from "next";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";
import Script from "next/script";

export const metadata: Metadata = {
  title: "KONEKSI.ID — Pemetaan Relasi Bisnis-Politik",
  description:
    "Platform OSINT untuk visualisasi relasi bisnis-politik di balik proyek pemerintah Indonesia.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

// Inline script removed and moved to public/theme-init.js for React 19 compatibility

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    // suppressHydrationWarning: the inline script mutates className before
    // hydration; React would otherwise warn about the server/client mismatch.
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;0,600;0,700;1,400;1,600&family=IBM+Plex+Mono:wght@400;500&family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&display=swap"
          rel="stylesheet"
        />
        {/* Run before React hydrates — prevents flash of wrong theme and FOUC. */}
        <Script id="theme-init" src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}

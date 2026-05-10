import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClientShell } from "@/components/ClientShell";
import { SITE_CONFIG } from "@/lib/constants";
import Script from "next/script";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.URL),
  title: {
    default: `${SITE_CONFIG.NAME} - ${SITE_CONFIG.TAGLINE}`,
    template: `%s - ${SITE_CONFIG.NAME}`,
  },
  description: SITE_CONFIG.DESCRIPTION,
  keywords: SITE_CONFIG.KEYWORDS,
  applicationName: SITE_CONFIG.NAME,
  authors: [{ name: SITE_CONFIG.NAME }],
  creator: SITE_CONFIG.NAME,
  publisher: SITE_CONFIG.NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon.svg" }],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_CONFIG.URL,
    siteName: SITE_CONFIG.NAME,
    title: `${SITE_CONFIG.NAME} - ${SITE_CONFIG.TAGLINE}`,
    description: SITE_CONFIG.DESCRIPTION,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.NAME} - ${SITE_CONFIG.TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.NAME} - ${SITE_CONFIG.TAGLINE}`,
    description: SITE_CONFIG.DESCRIPTION,
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: SITE_CONFIG.URL,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
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
        <Script id="theme-init" src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}

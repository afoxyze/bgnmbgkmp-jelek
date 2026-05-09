"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme-context";
import { SITE_CONFIG } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "BERANDA" },
  { href: "/dossier", label: "CATATAN" },
  { href: "/graf", label: "GRAF" },
  { href: "/cari", label: "CARI" },
  { href: "/tentang", label: "TENTANG" },
  { href: "/sppg", label: "SPPG" },
] as const;

export function Header() {
  const pathname = usePathname();
  const { isDark, toggle } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mencegah menu terbuka saat ukuran layar berubah ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 flex-shrink-0 h-14 flex items-center px-4 md:px-5 z-[50000]"
      style={{
        backgroundColor: "var(--bg-header)",
        borderBottom: "1px solid var(--border-header)",
        boxShadow: "0 1px 0 rgba(15, 23, 42, 0.02)",
      }}
    >
      <div className="w-full flex items-center justify-between relative z-[50001]">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="text-[15px] font-black tracking-tight transition-all hover:opacity-75 active:scale-95 text-[var(--text-primary)] whitespace-nowrap"
          >
            {SITE_CONFIG.NAME}
          </Link>
          <span
            className="hidden lg:inline text-[10px] pl-3 border-l border-[var(--border-strong)] text-[var(--text-tertiary)] uppercase tracking-[0.14em] font-mono font-bold truncate"
          >
            {SITE_CONFIG.TAGLINE}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 mx-4">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className="px-3 py-2 rounded-md transition-all hover:bg-[var(--bg-interactive-hover)] active:scale-95"
                style={{
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  backgroundColor: isActive ? "var(--bg-surface-2)" : "transparent",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/exports/koneksi_id_sppg_data.csv"
            className="hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border-base)] bg-[var(--bg-surface)] text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)] hover:text-[var(--accent-danger)] hover:border-[var(--accent-danger)] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-danger)]" />
            Unduh Data
          </Link>
          <ThemeToggle isDark={isDark} onToggle={toggle} />
          
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-interactive-hover)] active:scale-90 active:bg-[var(--bg-interactive-active)] cursor-pointer transition-transform"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 top-14 z-[49999] bg-[var(--bg-header)] flex flex-col p-4 animate-in fade-in slide-in-from-top-2 duration-200 md:hidden shadow-2xl overflow-y-auto"
          style={{ height: "calc(100dvh - 3.5rem)" }}
        >
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className="px-4 py-4 rounded-lg text-center border transition-all active:scale-95"
                  style={{
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    backgroundColor: isActive ? "var(--bg-surface-2)" : "var(--bg-surface)",
                    borderColor: isActive ? "var(--accent-danger)" : "var(--border-base)",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
          
          <div className="mt-auto pb-10 text-center space-y-4 pt-8">
            <Link
              href="/exports/koneksi_id_sppg_data.csv"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border border-[var(--accent-danger)] text-[var(--accent-danger)] font-mono text-[10px] font-bold uppercase tracking-[0.12em]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-danger)]" />
              Unduh Data
            </Link>
            <p className="text-[10px] text-[var(--text-tertiary)] font-bold tracking-widest opacity-40 uppercase">
              {SITE_CONFIG.TAGLINE}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

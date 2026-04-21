"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme-context";
import { SITE_CONFIG } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "BERANDA" },
  { href: "/graf", label: "GRAF" },
  { href: "/cari", label: "CARI" },
  { href: "/tentang", label: "TENTANG" },
  { href: "/sppg", label: "SPPG" },
] as const;

export function Header() {
  const pathname = usePathname();
  const { isDark, toggle } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [liveStats, setLiveStats] = useState<{TOTAL_ENTITIES: number, TOTAL_RED_FLAGS: number} | null>(null);

  // Load dynamic stats from API
  useEffect(() => {
    fetch("/api/casestudy")
      .then(res => res.json())
      .then(data => {
        if (data.stats) {
          setLiveStats({
            TOTAL_ENTITIES: data.stats.TOTAL_ENTITIES,
            TOTAL_RED_FLAGS: data.stats.TOTAL_RED_FLAGS
          });
        }
      })
      .catch(err => console.error("Failed to fetch header stats:", err));
  }, []);

  // Mencegah menu terbuka saat ukuran layar berubah ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const statsDisplay = liveStats 
    ? `${liveStats.TOTAL_ENTITIES} ENTITAS · ${liveStats.TOTAL_RED_FLAGS} RED FLAGS`
    : "... ENTITAS · ... RED FLAGS";

  return (
    <header
      className="sticky top-0 flex-shrink-0 h-12 flex items-center px-4 z-[50000]"
      style={{
        backgroundColor: "var(--bg-header)",
        borderBottom: "1px solid var(--border-header)",
      }}
    >
      <div className="w-full flex items-center justify-between relative z-[50001]">
        <div className="flex items-baseline gap-2">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-sm font-bold tracking-tight transition-all hover:opacity-70 active:scale-95 text-[var(--text-primary)] whitespace-nowrap"
          >
            {SITE_CONFIG.NAME}
          </Link>
          <span
            className="hidden lg:inline text-[10px] pl-2 border-l border-[var(--border-strong)] text-[var(--text-tertiary)] uppercase tracking-tight"
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
                className="px-2.5 py-1 rounded transition-all hover:bg-[var(--bg-interactive-hover)] active:scale-95"
                style={{
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  backgroundColor: isActive ? "var(--bg-surface-2)" : "transparent",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle isDark={isDark} onToggle={toggle} />
          
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-interactive-hover)] active:scale-90 active:bg-[var(--bg-interactive-active)] cursor-pointer transition-transform"
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            )}
          </button>
          
          <div className="hidden md:block text-[9px] px-2 py-1 ml-2 rounded font-mono font-bold uppercase border border-[var(--border-base)] bg-[var(--bg-surface-2)] text-[var(--text-secondary)] whitespace-nowrap">
            {statsDisplay}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 top-12 z-[49999] bg-[var(--bg-header)] flex flex-col p-4 animate-in fade-in slide-in-from-top-2 duration-200 md:hidden shadow-2xl overflow-y-auto"
          style={{ height: "calc(100dvh - 3rem)" }}
        >
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-5 rounded-2xl text-center border transition-all active:scale-95"
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
          
          <div className="mt-auto pb-10 text-center space-y-4">
            <div className="text-[10px] font-mono font-bold text-[var(--text-tertiary)] uppercase tracking-widest px-4 py-4 bg-[var(--bg-surface-2)] rounded-2xl border border-[var(--border-base)]">
              {statsDisplay}
            </div>
            <p className="text-[10px] text-[var(--text-tertiary)] font-bold tracking-widest opacity-40 uppercase">
              Audit Jaringan Kekuasaan
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

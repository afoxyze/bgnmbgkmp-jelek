"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

interface InvestigationCardProps {
  thread: string;
  judul: string;
  poin: string[];
  entitas: number;
  redFlags: number;
  status: string;
  source: string;
  variant?: "hero" | "normal";
}

export function InvestigationCard({
  thread,
  judul,
  poin,
  entitas,
  redFlags,
  status,
  source,
  variant = "normal",
}: InvestigationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isHero = variant === "hero";

  // GSAP Animation Logic
  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    
    // Kill any existing animations on this card to prevent queuing
    gsap.killTweensOf(cardRef.current);
    const title = cardRef.current.querySelector("h3");
    if (title) gsap.killTweensOf(title);

    // Instant Layer Priority
    gsap.set(cardRef.current, { zIndex: 50 });
    
    // Rapid Entrance
    gsap.to(cardRef.current, {
      y: -8,
      borderColor: "var(--accent-danger)",
      boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.2)",
      duration: 0.1,
      ease: "power2.out",
      overwrite: true
    });

    if (title) {
      gsap.to(title, {
        color: "var(--accent-danger)",
        duration: 0.1,
        overwrite: true
      });
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    // Instant kill for rapid exit
    gsap.killTweensOf(cardRef.current);
    const title = cardRef.current.querySelector("h3");
    if (title) gsap.killTweensOf(title);

    // Faster return to base state to clear path for next card
    gsap.to(cardRef.current, {
      y: 0,
      borderColor: "var(--border-base)",
      boxShadow: "none",
      duration: 0.1, // Even faster exit
      ease: "power1.inOut",
      overwrite: true,
      onComplete: () => {
        if (cardRef.current) gsap.set(cardRef.current, { zIndex: 1 });
      }
    });

    if (title) {
      gsap.to(title, {
        color: "var(--text-primary)",
        duration: 0.1,
        overwrite: true
      });
    }
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: isHero ? "2.5rem" : "2rem",
        gap: "1.5rem",
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-base)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        // Clean start state
        transform: "translateY(0)"
      }}
    >
      {/* Background Decor for Hero */}
      {isHero && (
        <div style={{ 
          position: "absolute", 
          top: "-20px", 
          right: "-20px", 
          width: "200px", 
          height: "200px", 
          opacity: 0.03,
          pointerEvents: "none"
        }}>
          <MiniGraphVisual />
        </div>
      )}

      {/* Header Metadata */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", pointerEvents: "none" }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span style={{ 
            fontFamily: "'IBM Plex Mono', monospace", 
            fontSize: "0.75rem", 
            color: "var(--text-tertiary)",
            fontWeight: 500
          }}>
            {thread}
          </span>
          <span style={{ 
            fontFamily: "'IBM Plex Mono', monospace", 
            fontSize: "0.625rem", 
            backgroundColor: status === "CRITICAL" ? "var(--accent-danger)" : "var(--text-primary)", 
            color: "white", 
            padding: "2px 6px", 
            borderRadius: "2px",
            letterSpacing: "0.05em" 
          }}>
            {status}
          </span>
        </div>
        <div style={{ 
          fontFamily: "'IBM Plex Mono', monospace", 
          fontSize: "0.625rem", 
          color: "var(--text-tertiary)",
          textAlign: "right",
          maxWidth: "200px",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          REF: {source}
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "'IBM Plex Serif', serif",
          fontSize: isHero ? "clamp(1.5rem, 4vw, 2rem)" : "1.25rem",
          fontWeight: 700,
          lineHeight: 1.2,
          color: "var(--text-primary)",
          margin: 0,
          letterSpacing: "-0.01em",
          pointerEvents: "none"
        }}
      >
        {judul}
      </h3>

      {/* Bullet Points */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", pointerEvents: "none" }}>
        {poin.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{ color: "var(--accent-danger)", fontSize: "1.25rem", lineHeight: 1, marginTop: "-2px" }}>•</span>
            <p style={{ 
              fontSize: "0.875rem", 
              color: "var(--text-secondary)", 
              lineHeight: 1.5,
              margin: 0
            }}>
              {p}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div style={{ 
        marginTop: "0.5rem", 
        paddingTop: "1.25rem", 
        borderTop: "1px solid var(--border-subtle)", 
        display: "flex", 
        gap: "1.5rem",
        pointerEvents: "none"
      }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Entitas</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.875rem", fontWeight: 600 }}>{entitas}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.625rem", color: "var(--accent-danger)", textTransform: "uppercase" }}>Red Flags</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.875rem", fontWeight: 600, color: "var(--accent-danger)" }}>{redFlags}</span>
        </div>
      </div>
    </article>
  );
}

function MiniGraphVisual() {
  return (
    <svg width="200" height="200" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="50" cy="50" r="3" fill="currentColor" />
      <circle cx="20" cy="30" r="2" fill="currentColor" />
      <circle cx="80" cy="30" r="2" fill="currentColor" />
      <circle cx="30" cy="80" r="2" fill="currentColor" />
      <circle cx="70" cy="80" r="2" fill="currentColor" />
      <line x1="50" y1="50" x2="20" y2="30" />
      <line x1="50" y1="50" x2="80" y2="30" />
      <line x1="50" y1="50" x2="30" y2="80" />
      <line x1="50" y1="50" x2="70" y2="80" />
      <line x1="20" y1="30" x2="80" y2="30" />
    </svg>
  );
}

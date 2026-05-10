"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Global keyboard shortcuts. Mounted once at the shell level.
 *
 *   /      → jump to /cari and focus the search input
 *   g e    → go to /etalase
 *   g g    → go to /graf
 *   g s    → go to /sppg
 *   g h    → go to home
 *   ?      → (reserved) help overlay
 *
 * Ignored while typing in an input, textarea, or contentEditable to avoid
 * hijacking normal typing. Gmail-style g-prefix has a 1s timeout.
 */
export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    let gPending = false;
    let gTimer: ReturnType<typeof setTimeout> | null = null;

    const isTyping = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (target.isContentEditable) return true;
      return false;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(e.target)) return;

      // "/" shortcut: jump to search.
      if (e.key === "/" && !gPending) {
        e.preventDefault();
        router.push("/cari");
        return;
      }

      // g-prefix navigation.
      if (gPending) {
        gPending = false;
        if (gTimer) clearTimeout(gTimer);
        gTimer = null;
        if (e.key === "e") {
          e.preventDefault();
          router.push("/etalase");
        } else if (e.key === "g") {
          e.preventDefault();
          router.push("/graf");
        } else if (e.key === "s") {
          e.preventDefault();
          router.push("/sppg");
        } else if (e.key === "h") {
          e.preventDefault();
          router.push("/");
        }
        return;
      }

      if (e.key === "g") {
        gPending = true;
        gTimer = setTimeout(() => {
          gPending = false;
          gTimer = null;
        }, 1000);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (gTimer) clearTimeout(gTimer);
    };
  }, [router]);

  return null;
}

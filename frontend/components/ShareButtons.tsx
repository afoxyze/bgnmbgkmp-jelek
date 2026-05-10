"use client";

import { useCallback, useEffect, useState } from "react";

// Share panel for entry and entity pages. No external SDKs; all shares are
// plain URL constructions so the component is static-export safe.
//
// Indonesian audience skew: WhatsApp > Twitter/X > Copy Link. Ordering
// reflects that. Web Share API is preferred on mobile where available.

interface ShareButtonsProps {
  url: string;           // absolute URL including origin
  title: string;         // used as share text prefix
  description?: string;  // optional: appended to share text where supported
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const shareText = description ? `${title} — ${description}` : title;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail in insecure contexts or with missing permission.
      // Fallback: select-and-prompt via a throwaway input.
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } finally {
        document.body.removeChild(input);
      }
    }
  }, [url]);

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({ title, text: shareText, url });
    } catch {
      // User cancelled or the share sheet is unavailable; silent.
    }
  }, [title, shareText, url]);

  const twitterHref =
    "https://twitter.com/intent/tweet?" +
    new URLSearchParams({ text: shareText, url }).toString();
  const waHref =
    "https://wa.me/?" +
    new URLSearchParams({ text: `${shareText} ${url}` }).toString();
  const linkedInHref =
    "https://www.linkedin.com/sharing/share-offsite/?" +
    new URLSearchParams({ url }).toString();

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Bagikan halaman">
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-tertiary)] mr-1">
        Bagikan
      </span>

      <ShareLink href={waHref} label="WhatsApp">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.449A11.822 11.822 0 0012.004 0C5.383 0 0 5.383 0 12c0 2.13.558 4.21 1.617 6.046L0 24l6.168-1.617A11.99 11.99 0 0012.004 24C18.625 24 24 18.617 24 12c0-3.205-1.25-6.22-3.48-8.551zM12.004 21.79c-1.925 0-3.808-.52-5.46-1.5l-.39-.234-3.62.95.97-3.528-.254-.406A9.905 9.905 0 012.126 12C2.126 6.57 6.574 2.125 12.004 2.125c2.652 0 5.145 1.035 7.02 2.914 1.88 1.875 2.914 4.371 2.914 7.02-.008 5.43-4.453 9.73-9.934 9.73zm5.457-7.453c-.3-.152-1.773-.875-2.047-.977-.273-.1-.476-.148-.68.148-.203.301-.777.977-.953 1.18-.175.203-.351.226-.652.074-.3-.149-1.266-.466-2.41-1.485-.891-.79-1.493-1.766-1.668-2.066-.175-.3-.02-.46.131-.609.137-.137.3-.352.45-.528.152-.175.203-.301.301-.5.1-.203.05-.375-.023-.527-.074-.152-.676-1.633-.926-2.23-.246-.598-.496-.52-.676-.528l-.574-.012c-.203 0-.527.074-.804.375-.274.3-1.055 1.023-1.055 2.5 0 1.476 1.08 2.898 1.23 3.102.15.203 2.125 3.246 5.152 4.55.722.312 1.285.496 1.723.633.723.23 1.383.199 1.906.12.578-.085 1.774-.726 2.023-1.424.25-.7.25-1.297.176-1.426-.074-.125-.277-.2-.578-.352z"/>
        </svg>
        WhatsApp
      </ShareLink>

      <ShareLink href={twitterHref} label="Twitter">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X / Twitter
      </ShareLink>

      <ShareLink href={linkedInHref} label="LinkedIn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        LinkedIn
      </ShareLink>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-base)] bg-[var(--bg-surface)] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)]"
        aria-label="Salin tautan"
      >
        {copied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Tersalin
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Salin Link
          </>
        )}
      </button>

      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-base)] bg-[var(--bg-surface)] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)] md:hidden"
          aria-label="Bagikan melalui aplikasi lain"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Lainnya
        </button>
      )}
    </div>
  );
}

function ShareLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Bagikan ke ${label}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-base)] bg-[var(--bg-surface)] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)] no-underline transition-colors hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)]"
    >
      {children}
    </a>
  );
}

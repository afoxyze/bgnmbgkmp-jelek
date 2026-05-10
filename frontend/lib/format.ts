// Lightweight date formatting helpers.
// All dates in data/ are ISO strings like "2026-04-12" or occasionally just
// month labels. These helpers degrade gracefully to the raw string when the
// input is not a proper ISO date.

/**
 * Indonesian relative time label: "hari ini", "kemarin", "3 hari lalu",
 * "2 minggu lalu", "5 bulan lalu", "2 tahun lalu".
 * Falls back to the raw input when it cannot be parsed as a date.
 */
export function timeAgoId(input: string, now: Date = new Date()): string {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;

  // Compare day-only to avoid timezone quirks around midnight.
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((today.getTime() - target.getTime()) / (24 * 60 * 60 * 1000));

  if (diffDays < 0) return formatIsoDateId(input);
  if (diffDays === 0) return "hari ini";
  if (diffDays === 1) return "kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) {
    const weeks = Math.round(diffDays / 7);
    return weeks === 1 ? "seminggu lalu" : `${weeks} minggu lalu`;
  }
  if (diffDays < 365) {
    const months = Math.round(diffDays / 30);
    return months === 1 ? "sebulan lalu" : `${months} bulan lalu`;
  }
  const years = Math.round(diffDays / 365);
  return years === 1 ? "setahun lalu" : `${years} tahun lalu`;
}

/**
 * Format "2026-04-12" as "12 April 2026" (Indonesian long form).
 * Returns the input unchanged if parsing fails.
 */
export function formatIsoDateId(input: string): string {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Classify IRCTC status strings like "CNF/B2/45", "RAC 12", "GNWL 23", "CAN".
export const STATUS = {
  confirmed: { label: "Confirmed", short: "CNF", tone: "green" },
  rac: { label: "RAC", short: "RAC", tone: "amber" },
  waitlist: { label: "Waitlisted", short: "WL", tone: "red" },
  cancelled: { label: "Cancelled", short: "CAN", tone: "zinc" },
  unknown: { label: "Status", short: "—", tone: "zinc" },
};

export function classify(text) {
  const s = String(text || "").toUpperCase().trim();
  if (!s) return "unknown";
  if (s.startsWith("CAN") || s.includes("CANCEL")) return "cancelled";
  if (s.startsWith("RAC")) return "rac";
  if (/WL/.test(s)) return "waitlist";
  if (s.startsWith("CNF") || s.startsWith("CONFIRM") || /^[A-Z]{1,3}\d{0,2}\/\d+/.test(s)) return "confirmed";
  return "unknown";
}

export const passengerStatus = (p) => classify(p?.currentStatus || p?.currentStatusDetails);

/** Overall trip status: the "worst" passenger decides the headline. */
export function tripSummary(trip) {
  const list = trip?.passengerList || [];
  if (!list.length) return { kind: "unknown", text: "No passenger data" };
  const counts = list.reduce((acc, p) => {
    const k = passengerStatus(p);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const n = list.length;
  for (const kind of ["waitlist", "rac", "cancelled", "confirmed"]) {
    if (!counts[kind]) continue;
    if (counts[kind] === n) {
      const text = { confirmed: n > 1 ? "All confirmed" : "Confirmed", rac: "RAC", waitlist: "Waitlisted", cancelled: "Cancelled" }[kind];
      return { kind, text: kind === "waitlist" || kind === "rac" ? `${text} · ${list[0].currentStatusDetails || ""}`.replace(/ · $/, "") : text };
    }
    return { kind, text: `${counts.confirmed || 0}/${n} confirmed` };
  }
  return { kind: "unknown", text: list[0].currentStatusDetails || "Status unavailable" };
}

export const toneClasses = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20",
  red: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20",
  zinc: "bg-zinc-100 text-zinc-700 ring-zinc-500/20 dark:bg-zinc-400/10 dark:text-zinc-300 dark:ring-zinc-400/20",
};

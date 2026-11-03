import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

const FORMATS = [
  "MMM D, YYYY h:mm:ss A",
  "MMM D, YYYY",
  "DD-MM-YYYY HH:mm",
  "DD-MM-YYYY",
  "YYYY-MM-DD HH:mm:ss",
  "YYYY-MM-DD",
];

/** Parse the many date shapes the PNR API returns. Returns a dayjs or null. */
export function parseDate(value) {
  if (!value) return null;
  for (const f of FORMATS) {
    const d = dayjs(value, f, true);
    if (d.isValid()) return d;
  }
  const d = dayjs(value);
  return d.isValid() ? d : null;
}

const hasTime = (d) => d && (d.hour() !== 0 || d.minute() !== 0);

export const fmtTime = (v) => {
  const d = parseDate(v);
  return hasTime(d) ? d.format("HH:mm") : "";
};
export const fmtDay = (v) => parseDate(v)?.format("ddd, D MMM") ?? "—";
export const fmtFull = (v) => parseDate(v)?.format("ddd, D MMM YYYY") ?? "—";

export function journeyDay(trip) {
  return parseDate(trip?.dateOfJourney) || parseDate(trip?.arrivalDate);
}

export function isUpcoming(trip) {
  const d = parseDate(trip?.arrivalDate) || journeyDay(trip);
  if (!d) return true; // unknown date: keep it visible
  return !d.endOf("day").isBefore(dayjs());
}

/** "Today", "Tomorrow", "In 4 days", "3 days ago" */
export function countdown(trip) {
  const d = journeyDay(trip);
  if (!d) return "";
  const diff = d.startOf("day").diff(dayjs().startOf("day"), "day");
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return diff > 0 ? `In ${diff} days` : `${-diff} days ago`;
}

export const timeAgo = (iso) => (iso ? dayjs(iso).fromNow() : "");

export function sortTrips(trips, upcoming) {
  const ts = (t) => journeyDay(t)?.valueOf() ?? 0;
  return [...trips].sort((a, b) => (upcoming ? ts(a) - ts(b) : ts(b) - ts(a)));
}

export function humanDuration(sec) {
  if (!sec) return "";
  const h = Math.floor(sec / 3600);
  const m = Math.ceil((sec % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m} min`;
}

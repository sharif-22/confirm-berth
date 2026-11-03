import { humanDuration } from "../lib/date";

export default function QuotaPill({ quota, compact = false }) {
  if (!quota) return null;
  const { remaining, limit, authenticated, resetsInSec } = quota;
  const tone =
    remaining === 0
      ? "text-rose-700 bg-rose-50 ring-rose-600/20 dark:text-rose-300 dark:bg-rose-500/10"
      : remaining <= 1
        ? "text-amber-800 bg-amber-50 ring-amber-600/20 dark:text-amber-300 dark:bg-amber-400/10"
        : "text-zinc-700 bg-zinc-100 ring-zinc-900/5 dark:text-zinc-300 dark:bg-zinc-800 dark:ring-white/10";

  const label = authenticated
    ? `${remaining}/${limit} today`
    : compact
      ? `${remaining}/${limit} free`
      : `${remaining} of ${limit} free checks`;

  const title =
    remaining === 0 && resetsInSec
      ? `Resets in ${humanDuration(resetsInSec)}`
      : `${remaining} PNR lookups left${authenticated ? " today" : ""}. Rechecking a PNR within 15 minutes is free.`;

  return (
    <span
      title={title}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${tone}`}
    >
      {!authenticated && limit <= 10 && (
        <span className="hidden gap-0.5 xs:flex" aria-hidden="true">
          {Array.from({ length: limit }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i < remaining ? "bg-current" : "bg-current opacity-25"}`}
            />
          ))}
        </span>
      )}
      {label}
    </span>
  );
}

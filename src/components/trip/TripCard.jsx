import { LuChevronRight } from "react-icons/lu";
import StatusBadge from "../ui/StatusBadge";
import Spinner from "../ui/Spinner";
import { countdown, fmtTime, journeyDay } from "../../lib/date";
import { tripSummary } from "../../lib/status";

function Station({ code, time, align = "left" }) {
  return (
    <div className={`min-w-0 ${align === "right" ? "text-right" : ""}`}>
      <p className="truncate text-base font-bold tracking-tight">{code || "—"}</p>
      <p className="text-xs tabular-nums text-zinc-500">{time || " "}</p>
    </div>
  );
}

export default function TripCard({ trip, onOpen, busy, past = false }) {
  const day = journeyDay(trip);
  const summary = tripSummary(trip);
  const when = countdown(trip);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group flex w-full gap-4 rounded-2xl bg-white p-4 text-left ring-1 ring-zinc-900/5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-900/5 hover:ring-emerald-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 sm:p-5 dark:bg-zinc-900 dark:ring-white/10 dark:hover:ring-emerald-400/40 ${past ? "opacity-80 hover:opacity-100" : ""}`}
    >
      {/* date block */}
      <div
        className={`flex w-14 shrink-0 flex-col items-center justify-center rounded-xl py-2 sm:w-16 ${past ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"}`}
      >
        <span className="text-[11px] font-semibold uppercase tracking-wide">{day?.format("MMM") ?? "—"}</span>
        <span className="text-2xl font-bold leading-tight">{day?.format("D") ?? "?"}</span>
        <span className="text-[11px] font-medium">{day?.format("ddd") ?? ""}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 truncate font-semibold">
            {trip.trainName || "Train"}
            <span className="font-medium text-zinc-500"> · {trip.trainNumber}</span>
          </p>
          <StatusBadge kind={summary.kind}>{summary.text}</StatusBadge>
        </div>

        <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <Station code={trip.boardingPoint || trip.sourceStation} time={fmtTime(trip.dateOfJourney)} />
          <div className="flex w-12 items-center sm:w-20" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full border border-zinc-400" />
            <span className="h-px flex-1 border-t border-dashed border-zinc-300 dark:border-zinc-700" />
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
          </div>
          <Station code={trip.destinationStation || trip.reservationUpto} time={fmtTime(trip.arrivalDate)} align="right" />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
          <span className="tabular-nums">PNR {trip.pnrNumber}</span>
          {trip.journeyClass && <span>· {trip.journeyClass}</span>}
          {trip.chartStatus && <span className="hidden xs:inline">· {trip.chartStatus}</span>}
          <span className="ml-auto inline-flex items-center gap-1 font-medium text-zinc-600 dark:text-zinc-400">
            {busy ? (
              <>
                <Spinner className="h-3.5 w-3.5" /> Updating
              </>
            ) : (
              when
            )}
            <LuChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </button>
  );
}

export function TripCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-zinc-900/5 sm:p-5 dark:bg-zinc-900 dark:ring-white/10">
      <div className="h-[74px] w-14 animate-pulse rounded-xl bg-zinc-100 sm:w-16 dark:bg-zinc-800" />
      <div className="flex-1 space-y-3">
        <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-8 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

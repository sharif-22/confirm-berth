import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { LuChevronDown, LuChevronUp, LuRadio, LuRefreshCw } from "react-icons/lu";
import Spinner from "../ui/Spinner";
import { liveApi, toApiError } from "../../apis/client";
import { journeyDay, timeAgo } from "../../lib/date";
import { usePnr } from "../../store/PnrStore";

// Results kept for this browser session, so reopening a trip doesn't spend another check.
const memo = new Map();

const hhmm = (iso) => (iso ? dayjs(iso).format("HH:mm") : "");
const plus = (iso, min) => (iso && Number.isFinite(min) ? dayjs(iso).add(min, "minute").toISOString() : iso);

function lateText(min) {
  if (min === null || min === undefined) return "Status unknown";
  if (min <= 0) return "On time";
  if (min < 60) return `${min} min late`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min late` : `${h} h late`;
}

function tone(min) {
  if (min === null || min === undefined) return "text-zinc-700 dark:text-zinc-300";
  if (min <= 5) return "text-emerald-700 dark:text-emerald-400";
  if (min <= 30) return "text-amber-700 dark:text-amber-400";
  return "text-rose-700 dark:text-rose-400";
}

/** Where the train is, in one line. */
function whereNow(d) {
  const loc = d.currentLocation;
  if (d.status === "not-started") return "Hasn't left its origin yet";
  if (!loc) return "Location not reported yet";
  const at = `${loc.stationName || loc.stationCode} (${loc.stationCode})`;
  if (loc.status === "at-station") return `At ${at}`;
  const next = d.nextHalt?.stationName;
  const km = loc.distanceFromLastStationKm;
  return `Left ${at}${km ? `, ${Math.round(km)} km on` : ""}${next ? `, heading to ${next}` : ""}`;
}

function stopTimes(s, passed, delay) {
  const sched = s.scheduledArrival || s.scheduledDeparture;
  const actual = s.actualArrival || (!s.scheduledArrival ? s.actualDeparture : null);
  const late = passed ? (s.delayArrival ?? s.delayDeparture ?? null) : delay;
  const expected = actual || (late > 0 ? plus(sched, late) : null);
  return { sched, expected, late, actual: Boolean(actual) };
}

function Stop({ s, state, delay, tag }) {
  const passed = state === "passed";
  const { sched, expected, late, actual } = stopTimes(s, passed, delay);
  return (
    <li className="relative flex gap-3 pb-3 last:pb-0">
      <span className="relative mt-1 flex h-3 w-3 shrink-0 items-center justify-center" aria-hidden="true">
        {state === "current" && <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500/50 motion-reduce:hidden" />}
        <span
          className={`relative h-3 w-3 rounded-full ${
            state === "current"
              ? "bg-emerald-600"
              : passed
                ? "bg-emerald-600/70"
                : "border-2 border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900"
          }`}
        />
      </span>
      <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`truncate text-sm ${state === "current" || tag ? "font-semibold" : "font-medium"} ${passed && !tag ? "text-zinc-500" : ""}`}>
            {s.stationName || s.stationCode} <span className="font-normal text-zinc-500">{s.stationCode}</span>
          </p>
          <p className="text-xs text-zinc-500">
            {tag && <span className="mr-1.5 rounded bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{tag}</span>}
            {s.platform ? `Platform ${s.platform}` : ""}
          </p>
        </div>
        <div className="shrink-0 text-right text-sm tabular-nums">
          {expected && expected !== sched ? (
            <>
              <p className={`font-semibold ${late > 5 ? "text-rose-700 dark:text-rose-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                {hhmm(expected)}
                <span className="sr-only">{actual ? " actual" : " expected"}</span>
              </p>
              <p className="text-xs text-zinc-400 line-through">{hhmm(sched)}</p>
            </>
          ) : (
            <p className={passed ? "text-zinc-500" : "font-medium"}>{hhmm(sched)}</p>
          )}
        </div>
      </div>
    </li>
  );
}

export default function LiveStatus({ trip }) {
  const { user, login, authBusy } = usePnr();
  const day = journeyDay(trip);
  const date = day?.format("YYYY-MM-DD");
  const from = (trip.boardingPoint || trip.sourceStation || "").toUpperCase();
  const to = (trip.destinationStation || trip.reservationUpto || "").toUpperCase();
  const key = `${trip.trainNumber}:${date}:${from}`;
  const offset = day ? day.startOf("day").diff(dayjs().startOf("day"), "day") : null;
  const inWindow = offset !== null && offset <= 1 && offset >= -4;

  const [state, setState] = useState(() => memo.get(key) || { phase: "idle" });
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setState(memo.get(key) || { phase: "idle" });
    setShowAll(false);
  }, [key]);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, phase: "loading", error: null }));
    try {
      const res = await liveApi.status(trip.trainNumber, { date, from });
      const next = { phase: "ok", data: res.data, fetchedAt: res.fetchedAt, quota: res.quota };
      memo.set(key, next);
      setState(next);
    } catch (e) {
      const err = toApiError(e);
      setState((s) => ({ ...s, phase: s.data ? "ok" : "error", error: err, quota: err.quota || s.quota }));
    }
  }, [trip.trainNumber, date, from, key]);

  const d = state.data;
  const view = useMemo(() => {
    if (!d) return null;
    const route = d.route || [];
    const cur = d.currentLocation?.sequence ?? null;
    const delay = d.delayMinutes ?? null;
    const stateOf = (s) =>
      d.status === "not-started"
        ? "upcoming"
        : cur !== null && s.sequence === cur
          ? "current"
          : s.actualDeparture || (cur !== null && s.sequence < cur)
            ? "passed"
            : "upcoming";
    const idx = Math.max(0, route.findIndex((s) => s.sequence === cur));
    const board = route.find((s) => s.stationCode === from);
    const alight = route.find((s) => s.stationCode === to);
    const cancelled =
      /cancel/i.test(d.status || "") || (d.exceptions || []).some((x) => /cancel/i.test(JSON.stringify(x)));
    return { route, delay, stateOf, idx, board, alight, cancelled };
  }, [d, from, to]);

  if (!trip.trainNumber || !day) return null;

  if (!inWindow) {
    if (offset < -4) return null;
    return (
      <div className="flex items-center gap-3 rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400">
        <LuRadio className="h-4 w-4 shrink-0" />
        Live running status opens the day before you travel ({day.subtract(1, "day").format("ddd, D MMM")}).
      </div>
    );
  }

  const quotaLine = state.quota
    ? `${state.quota.remaining} of ${state.quota.limit} live checks left today`
    : "Uses one live check. Rechecking within 3 minutes is free.";

  return (
    <div className="rounded-lg ring-1 ring-zinc-900/5 dark:ring-white/10">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <LuRadio className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Live running status
        </h3>
        {state.phase !== "idle" && d && (
          <button
            onClick={load}
            disabled={state.phase === "loading"}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 disabled:opacity-60 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {state.phase === "loading" ? <Spinner className="h-3.5 w-3.5" /> : <LuRefreshCw className="h-3.5 w-3.5" />}
            Refresh
          </button>
        )}
      </div>

      <div className="px-4 py-3">
        {/* not loaded yet */}
        {!d && state.phase !== "error" && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">See where train {trip.trainNumber} is and when it reaches {from || "your station"}.</p>
            <button
              onClick={load}
              disabled={state.phase === "loading"}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
            >
              {state.phase === "loading" ? <Spinner /> : <LuRadio className="h-4 w-4" />}
              {state.phase === "loading" ? "Locating train…" : "Show live status"}
            </button>
          </div>
        )}

        {/* error with nothing to show */}
        {!d && state.phase === "error" && (
          <div className="space-y-3">
            <p className="text-sm text-rose-700 dark:text-rose-400">{state.error?.message}</p>
            <div className="flex gap-2">
              {state.error?.reason === "QUOTA" && !user ? (
                <button onClick={login} disabled={authBusy} className="rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70">
                  Log in for more checks
                </button>
              ) : (
                !["QUOTA", "OUT_OF_WINDOW", "LIVE_BUDGET", "NOT_CONFIGURED"].includes(state.error?.reason) && (
                  <button onClick={load} className="rounded-lg bg-zinc-100 px-3.5 py-2 text-sm font-semibold hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                    Try again
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* live data */}
        {d && view && (
          <div className="space-y-4">
            <div>
              <p className={`text-lg font-bold ${view.cancelled ? "text-rose-700 dark:text-rose-400" : d.status === "not-started" ? "" : tone(view.delay)}`}>
                {view.cancelled ? "Cancelled" : d.status === "not-started" ? "Not started yet" : lateText(view.delay)}
              </p>
              <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                {whereNow(d)}
                {d.currentLocation?.speedKmh ? `, ${Math.round(d.currentLocation.speedKmh)} km/h` : ""}
              </p>
            </div>

            {(view.board || view.alight) && (
              <dl className="grid grid-cols-2 gap-2">
                {[
                  ["Leaves " + from, view.board, true],
                  ["Reaches " + to, view.alight, false],
                ].map(([label, s, dep]) => {
                  if (!s) return <div key={label} />;
                  const passed = view.stateOf(s) === "passed";
                  const sched = dep ? s.scheduledDeparture || s.scheduledArrival : s.scheduledArrival || s.scheduledDeparture;
                  const actual = dep ? s.actualDeparture : s.actualArrival;
                  const late = passed ? (dep ? s.delayDeparture : s.delayArrival) ?? view.delay : view.delay;
                  const shown = actual || (late > 0 ? plus(sched, late) : sched);
                  return (
                    <div key={label} className="rounded-lg bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/60">
                      <dt className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
                      <dd className="mt-0.5 flex items-baseline gap-2">
                        <span className={`text-base font-bold tabular-nums ${late > 5 ? "text-rose-700 dark:text-rose-400" : ""}`}>{hhmm(shown)}</span>
                        {shown !== sched && <span className="text-xs text-zinc-400 line-through tabular-nums">{hhmm(sched)}</span>}
                      </dd>
                      <dd className="text-xs text-zinc-500">
                        {actual ? (dep ? "Departed" : "Arrived") : late > 0 ? "Expected" : "Scheduled"}
                        {s.platform ? ` · PF ${s.platform}` : ""}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            )}

            {view.route.length > 0 && (
              <div>
                <ol className="max-h-[22rem] overflow-y-auto pr-1">
                  {(showAll ? view.route : view.route.slice(Math.max(0, view.idx - 1), Math.max(0, view.idx - 1) + 5)).map((s) => (
                    <Stop
                      key={s.sequence}
                      s={s}
                      state={view.stateOf(s)}
                      delay={view.delay}
                      tag={s.stationCode === from ? "You board" : s.stationCode === to ? "You get off" : null}
                    />
                  ))}
                </ol>
                {view.route.length > 5 && (
                  <button
                    onClick={() => setShowAll((v) => !v)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    {showAll ? <LuChevronUp className="h-3.5 w-3.5" /> : <LuChevronDown className="h-3.5 w-3.5" />}
                    {showAll ? "Show fewer stops" : `Show all ${view.route.length} stops`}
                  </button>
                )}
              </div>
            )}

            {state.error && <p className="text-xs text-rose-700 dark:text-rose-400">{state.error.message}</p>}
          </div>
        )}
      </div>

      <p className="border-t border-zinc-100 px-4 py-2.5 text-xs text-zinc-500 dark:border-zinc-800">
        {d ? `Updated ${timeAgo(d.lastUpdatedAt || state.fetchedAt)} · ` : ""}
        {quotaLine}
        {d && (
          <>
            {" · "}
            <a href="https://railradar.in" target="_blank" rel="noreferrer" className="hover:text-emerald-600">RailRadar</a>
          </>
        )}
      </p>
    </div>
  );
}

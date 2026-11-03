import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { LuCloud } from "react-icons/lu";
import SearchCard from "../components/SearchCard";
import TripCard, { TripCardSkeleton } from "../components/trip/TripCard";
import TripSheet from "../components/trip/TripSheet";
import EmptyState from "../components/EmptyState";
import LimitDialog from "../components/LimitDialog";
import { usePnr } from "../store/PnrStore";
import { isUpcoming, sortTrips } from "../lib/date";

export default function Home() {
  const { trips, user, busy, lookup, login, authBusy } = usePnr();
  const [tab, setTab] = useState("upcoming");
  const [openPnr, setOpenPnr] = useState(null);
  const [searching, setSearching] = useState(false);

  const { upcoming, past } = useMemo(
    () => ({
      upcoming: sortTrips(trips.filter(isUpcoming), true),
      past: sortTrips(trips.filter((t) => !isUpcoming(t)), false),
    }),
    [trips],
  );

  const openTrip = trips.find((t) => t.pnrNumber === openPnr) || null;
  const closeSheet = useCallback(() => setOpenPnr(null), []);

  const show = (trip) => {
    setTab(isUpcoming(trip) ? "upcoming" : "past");
    setOpenPnr(trip.pnrNumber);
  };

  const handleSearch = async (pnr) => {
    const existing = trips.find((t) => t.pnrNumber === pnr);
    if (existing) {
      // Already saved: open it straight away and refresh in the background.
      show(existing);
      if (isUpcoming(existing)) lookup(pnr, { refresh: true });
      return true;
    }
    setSearching(true);
    const res = await lookup(pnr);
    setSearching(false);
    if (res.ok) {
      show(res.trip);
      toast.success("Trip saved");
    }
    return res.ok;
  };

  const list = tab === "upcoming" ? upcoming : past;
  const loading = user === undefined && trips.length === 0;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16">
      {/* hero */}
      <section className="pb-6 pt-8 sm:pt-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Will your berth <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">confirm?</span>
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Check live PNR status and keep every upcoming journey in one place.
        </p>
      </section>

      <SearchCard onSubmit={handleSearch} loading={searching} />

      {/* guest sync nudge */}
      {user === null && trips.length > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-200">
          <LuCloud className="h-5 w-5 shrink-0" />
          <p className="flex-1">Trips are saved on this device only.</p>
          <button
            onClick={login}
            disabled={authBusy}
            className="shrink-0 font-semibold underline-offset-4 hover:underline disabled:opacity-60"
          >
            Log in to sync
          </button>
        </div>
      )}

      {/* tabs */}
      <div role="tablist" aria-label="Trips" className="mt-8 grid grid-cols-2 gap-1 rounded-2xl bg-zinc-200/60 p-1 dark:bg-zinc-800/60">
        {[
          ["upcoming", "Upcoming", upcoming.length],
          ["past", "Past", past.length],
        ].map(([key, label, count]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${tab === key ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-white" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"}`}
          >
            {label}
            <span className={`rounded px-2 py-0.5 text-xs tabular-nums ${tab === key ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-zinc-300/60 dark:bg-zinc-700"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* list */}
      <section className="mt-4 space-y-3" role="tabpanel">
        {loading ? (
          <>
            <TripCardSkeleton />
            <TripCardSkeleton />
          </>
        ) : list.length === 0 ? (
          <EmptyState variant={tab} />
        ) : (
          list.map((trip) => (
            <TripCard
              key={trip.pnrNumber}
              trip={trip}
              past={tab === "past"}
              busy={Boolean(busy[trip.pnrNumber])}
              onOpen={() => setOpenPnr(trip.pnrNumber)}
            />
          ))
        )}
      </section>

      <TripSheet trip={openTrip} open={Boolean(openTrip)} onClose={closeSheet} />
      <LimitDialog />
    </main>
  );
}

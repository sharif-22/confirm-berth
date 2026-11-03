import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { LuCheck, LuCopy, LuRefreshCw, LuShare2, LuTrash2, LuX } from "react-icons/lu";
import Modal from "../ui/Modal";
import StatusBadge from "../ui/StatusBadge";
import Spinner from "../ui/Spinner";
import ShareCard from "./ShareCard";
import { usePnr } from "../../store/PnrStore";
import { countdown, fmtDay, fmtFull, fmtTime, isUpcoming, timeAgo } from "../../lib/date";
import { classify, passengerStatus, tripSummary } from "../../lib/status";

const APP_URL = "https://confirm-berth.vercel.app";

function Detail({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/60">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-semibold">{value}</dd>
    </div>
  );
}

export default function TripSheet({ trip, open, onClose }) {
  const { lookup, removeTrip, busy } = usePnr();
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sharing, setSharing] = useState(false);
  const shareRef = useRef(null);

  useEffect(() => {
    if (!open) setConfirmDelete(false);
  }, [open]);

  if (!trip) return null;
  const isBusy = Boolean(busy[trip.pnrNumber]);
  const summary = tripSummary(trip);
  const from = trip.boardingPoint || trip.sourceStation;
  const to = trip.destinationStation || trip.reservationUpto;
  const upcoming = isUpcoming(trip);

  const copyPnr = async () => {
    try {
      await navigator.clipboard.writeText(trip.pnrNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy");
    }
  };

  const refresh = async () => {
    const res = await lookup(trip.pnrNumber, { refresh: true });
    if (res.ok) toast.success(res.fromCache ? "Already up to date" : "Status refreshed");
  };

  const share = async () => {
    setSharing(true);
    const text = `PNR ${trip.pnrNumber} · ${trip.trainName} (${trip.trainNumber})\n${from} → ${to} on ${fmtFull(trip.dateOfJourney)}\nStatus: ${summary.text}\n\nCheck yours: ${APP_URL}`;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(shareRef.current, { backgroundColor: null, scale: 2 });
      const blob = await new Promise((r) => canvas.toBlob(r, "image/png"));
      const file = blob && new File([blob], `pnr-${trip.pnrNumber}.png`, { type: "image/png" });

      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: `PNR ${trip.pnrNumber}`, text, files: [file] });
      } else if (navigator.share) {
        await navigator.share({ title: `PNR ${trip.pnrNumber}`, text });
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      }
    } catch (e) {
      if (e?.name !== "AbortError") toast.error("Sharing failed. Try again.");
    } finally {
      setSharing(false);
    }
  };

  const remove = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    onClose();
    if (await removeTrip(trip.pnrNumber)) toast.success("Trip removed");
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="trip-title">
      {/* header */}
      <div className="px-5 pb-4 pt-3 sm:px-6 sm:pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <button
              onClick={copyPnr}
              className="group inline-flex items-center gap-1.5 rounded-md text-xs font-semibold tabular-nums text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              title="Copy PNR"
            >
              PNR {trip.pnrNumber}
              {copied ? <LuCheck className="h-3.5 w-3.5 text-emerald-600" /> : <LuCopy className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />}
            </button>
            <h2 id="trip-title" className="mt-1 truncate text-xl font-bold tracking-tight">
              {trip.trainName}
            </h2>
            <p className="text-sm text-zinc-500">
              {trip.trainNumber} · {fmtDay(trip.dateOfJourney)} · <span className="font-medium text-zinc-700 dark:text-zinc-300">{countdown(trip)}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        {/* status hero */}
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 dark:from-zinc-800/60 dark:to-zinc-800/30">
          <div>
            <p className="text-xs font-medium text-zinc-500">Current status</p>
            <p className="mt-0.5 text-lg font-bold">{summary.text}</p>
          </div>
          <StatusBadge kind={summary.kind} size="lg" />
        </div>

        {/* route */}
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div>
            <p className="text-2xl font-extrabold tracking-tight">{from}</p>
            <p className="text-sm tabular-nums text-zinc-500">{fmtTime(trip.dateOfJourney) || fmtDay(trip.dateOfJourney)}</p>
          </div>
          <div className="flex flex-col items-center text-[11px] text-zinc-400">
            <span className="mb-1">{trip.distance ? `${trip.distance} km` : ""}</span>
            <span className="h-px w-16 border-t-2 border-dashed border-zinc-300 sm:w-24 dark:border-zinc-700" />
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold tracking-tight">{to}</p>
            <p className="text-sm tabular-nums text-zinc-500">{fmtTime(trip.arrivalDate) || fmtDay(trip.arrivalDate)}</p>
          </div>
        </div>
      </div>

      {/* passengers */}
      <section className="border-t border-zinc-100 px-5 py-4 sm:px-6 dark:border-zinc-800">
        <h3 className="text-sm font-semibold">
          Passengers <span className="font-normal text-zinc-500">({trip.passengerList?.length || 0})</span>
        </h3>
        <ul className="mt-3 space-y-2">
          {(trip.passengerList || []).map((p, i) => {
            const now = passengerStatus(p);
            const booked = classify(p.bookingStatus || p.bookingStatusDetails);
            const improved = booked !== now && now === "confirmed";
            return (
              <li key={i} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 ring-1 ring-zinc-900/5 dark:ring-white/10">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Passenger {p.passengerSerialNumber || i + 1}</p>
                  {p.bookingStatusDetails && (
                    <p className="truncate text-xs text-zinc-500">
                      Booked: {p.bookingStatusDetails}
                      {improved && <span className="ml-1 font-semibold text-emerald-600 dark:text-emerald-400">↑ upgraded</span>}
                    </p>
                  )}
                </div>
                <StatusBadge kind={now}>{p.currentStatusDetails || undefined}</StatusBadge>
              </li>
            );
          })}
        </ul>
      </section>

      {/* details */}
      <section className="border-t border-zinc-100 px-5 py-4 sm:px-6 dark:border-zinc-800">
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Detail label="Class" value={trip.journeyClass} />
          <Detail label="Quota" value={trip.quota} />
          <Detail label="Chart" value={trip.chartStatus} />
          <Detail label="Fare" value={trip.ticketFare || trip.bookingFare ? `₹${trip.ticketFare || trip.bookingFare}` : ""} />
          <Detail label="Booked on" value={trip.bookingDate ? fmtFull(trip.bookingDate) : ""} />
          <Detail label="Boarding" value={trip.boardingPoint} />
        </dl>
      </section>

      {/* actions */}
      <div className="sticky bottom-0 border-t border-zinc-100 bg-white/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:px-6 dark:border-zinc-800 dark:bg-zinc-900/95">
        <p className="mb-2.5 text-xs text-zinc-500">
          {trip.lastFetchedAt ? `Updated ${timeAgo(trip.lastFetchedAt)}` : "Saved earlier"}
          {!upcoming && " · This journey has passed"}
        </p>
        <div className="flex gap-2">
          {upcoming && (
            <button
              onClick={refresh}
              disabled={isBusy}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
            >
              {isBusy ? <Spinner /> : <LuRefreshCw className="h-4 w-4" />}
              {isBusy ? "Refreshing…" : "Refresh"}
            </button>
          )}
          <button
            onClick={share}
            disabled={sharing}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-200 disabled:opacity-70 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            {sharing ? <Spinner /> : <LuShare2 className="h-4 w-4" />} Share
          </button>
          <button
            onClick={remove}
            onBlur={() => setConfirmDelete(false)}
            aria-label={confirmDelete ? "Tap again to remove this trip" : "Remove trip"}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${confirmDelete ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-zinc-100 text-zinc-600 hover:bg-rose-50 hover:text-rose-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-rose-500/10"}`}
          >
            <LuTrash2 className="h-4 w-4" />
            {confirmDelete && <span>Remove?</span>}
          </button>
        </div>
      </div>

      <ShareCard ref={shareRef} trip={trip} />
    </Modal>
  );
}

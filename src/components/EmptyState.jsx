import { LuHistory, LuTicket } from "react-icons/lu";

export default function EmptyState({ variant = "upcoming" }) {
  const upcoming = variant === "upcoming";
  const Icon = upcoming ? LuTicket : LuHistory;
  return (
    <div className="rounded-3xl border-2 border-dashed border-zinc-200 px-6 py-12 text-center dark:border-zinc-800">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:text-emerald-400 dark:ring-white/10">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="mt-4 font-semibold">{upcoming ? "No upcoming trips yet" : "No past trips"}</h3>
      <p className="mx-auto mt-1 max-w-xs text-sm text-zinc-500">
        {upcoming
          ? "Enter a PNR above and we'll keep it here so you can check its status anytime."
          : "Trips move here automatically once the journey date has passed."}
      </p>
    </div>
  );
}

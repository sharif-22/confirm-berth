import { FcGoogle } from "react-icons/fc";
import { LuClock, LuSparkles } from "react-icons/lu";
import Modal from "./ui/Modal";
import Spinner from "./ui/Spinner";
import { usePnr } from "../store/PnrStore";
import { humanDuration } from "../lib/date";

export default function LimitDialog() {
  const { limitHit, dismissLimit, user, login, authBusy } = usePnr();
  const open = Boolean(limitHit);
  const reset = humanDuration(limitHit?.resetsInSec);
  const guest = !user;

  return (
    <Modal open={open} onClose={dismissLimit} labelledBy="limit-title">
      <div className="px-6 pb-6 pt-4 text-center sm:pt-8">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">
          {guest ? <LuSparkles className="h-7 w-7" /> : <LuClock className="h-7 w-7" />}
        </span>
        <h2 id="limit-title" className="mt-4 text-xl font-bold tracking-tight">
          {guest ? `You've used your ${limitHit?.limit ?? 5} free checks` : "Daily limit reached"}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          {guest
            ? "Log in with Google to get more checks every day, and keep your trips synced across all your devices."
            : `You've used all ${limitHit?.limit ?? ""} lookups for today.`}
          {reset && ` ${guest ? "Free checks" : "They"} reset in ${reset}.`}
        </p>
        <p className="mt-2 text-xs text-zinc-500">Saved trips stay viewable, and a PNR checked in the last 15 minutes can still be opened.</p>

        <div className="mt-6 flex flex-col gap-2">
          {guest && (
            <button
              onClick={login}
              disabled={authBusy}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              {authBusy ? <Spinner /> : <FcGoogle className="h-5 w-5" />}
              Continue with Google
            </button>
          )}
          <button
            onClick={dismissLimit}
            className="h-11 rounded-xl text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {guest ? "Maybe later" : "Got it"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

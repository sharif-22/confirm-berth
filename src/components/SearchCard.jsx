import { useRef, useState } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import Spinner from "./ui/Spinner";

export default function SearchCard({ onSubmit, loading }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setValue(e.target.value.replace(/\D/g, "").slice(0, 10));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (value.length !== 10) {
      setError(
        value.length === 0
          ? "Enter your 10-digit PNR number."
          : `A PNR has 10 digits — you've entered ${value.length}.`,
      );
      inputRef.current?.focus();
      return;
    }
    const ok = await onSubmit(value);
    if (ok) setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl bg-white p-4 shadow-xl shadow-emerald-900/5 ring-1 ring-zinc-900/5 sm:p-5 dark:bg-zinc-900 dark:shadow-black/20 dark:ring-white/10"
    >
      <div className="flex items-baseline justify-between">
        <label htmlFor="pnr" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          PNR number
        </label>
        <span
          className={`text-xs font-medium tabular-nums ${value.length === 10 ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}
          aria-live="polite"
        >
          {value.length}/10
        </span>
      </div>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            id="pnr"
            name="pnr"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            enterKeyHint="search"
            placeholder="e.g. 4512345678"
            value={value}
            onChange={handleChange}
            aria-invalid={Boolean(error)}
            aria-describedby="pnr-help"
            className={`h-14 w-full rounded-2xl bg-zinc-50 px-4 pr-11 text-xl font-semibold tabular-nums tracking-[0.18em] text-zinc-900 outline-none ring-1 ring-inset transition placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-zinc-400 focus:bg-white focus:ring-2 dark:bg-zinc-800/60 dark:text-white dark:focus:bg-zinc-800 ${error ? "ring-rose-400 focus:ring-rose-500" : "ring-zinc-200 focus:ring-emerald-500 dark:ring-zinc-700"}`}
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                setValue("");
                setError("");
                inputRef.current?.focus();
              }}
              aria-label="Clear"
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-zinc-400 hover:bg-zinc-200/70 hover:text-zinc-600 dark:hover:bg-zinc-700"
            >
              <LuX className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-wait disabled:opacity-80"
        >
          {loading ? <Spinner className="h-5 w-5" /> : <LuSearch className="h-5 w-5" />}
          {loading ? "Checking…" : "Check status"}
        </button>
      </div>

      <p id="pnr-help" className={`mt-2.5 text-xs ${error ? "font-medium text-rose-600 dark:text-rose-400" : "text-zinc-500"}`}>
        {error || "Find it on your e-ticket or booking SMS. Rechecking the same PNR within 15 minutes is free."}
      </p>
    </form>
  );
}

import { Link } from "react-router-dom";
import Logo from "../components/ui/Logo";

export default function PageNotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-zinc-50 px-6 text-center text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div>
        <div className="flex justify-center"><Logo size="lg" /></div>
        <p className="mt-6 text-sm font-semibold text-emerald-600">404</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Wrong platform</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">This page doesn&apos;t exist. Let&apos;s get you back on track.</p>
        <Link to="/" className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
          Back to the station
        </Link>
      </div>
    </main>
  );
}

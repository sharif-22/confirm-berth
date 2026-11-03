import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { LuLogOut, LuMoon } from "react-icons/lu";
import { usePnr } from "../store/PnrStore";
import Logo from "./ui/Logo";
import Spinner from "./ui/Spinner";
import QuotaPill from "./QuotaPill";

function Avatar({ user, className = "h-9 w-9" }) {
  const [failed, setFailed] = useState(false);
  if (user.picture && !failed) {
    return (
      <img
        src={user.picture}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`${className} rounded-full object-cover ring-2 ring-white dark:ring-zinc-800`}
      />
    );
  }
  return (
    <span
      className={`${className} grid place-items-center rounded-full bg-emerald-600 text-sm font-bold text-white ring-2 ring-white dark:ring-zinc-800`}
    >
      {(user.name || user.email || "?").charAt(0).toUpperCase()}
    </span>
  );
}

function ThemeSwitch({ theme, setTheme }) {
  const dark = theme === "dark";
  return (
    <button
      role="menuitemcheckbox"
      aria-checked={dark}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      <LuMoon className="h-4 w-4" />
      <span className="flex-1">Dark mode</span>
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 rounded-md transition-colors ${dark ? "bg-emerald-600" : "bg-zinc-300 dark:bg-zinc-700"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded bg-white shadow-sm transition-all ${dark ? "left-[1.125rem]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

function UserMenu({ user, onLogout, theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-lg p-1 pr-1 transition hover:bg-zinc-100 dark:hover:bg-zinc-800 sm:pr-3"
      >
        <Avatar user={user} />
        <span className="hidden max-w-[10rem] truncate text-sm font-semibold sm:block">
          {user.name?.split(" ")[0]}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 w-64 animate-pop-in overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-zinc-900/10 dark:bg-zinc-900 dark:ring-white/10"
        >
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Avatar user={user} className="h-10 w-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-zinc-500">{user.email}</p>
            </div>
          </div>
          <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
          <ThemeSwitch theme={theme} setTheme={setTheme} />
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <LuLogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { user, quota, login, logout, authBusy, theme, setTheme } = usePnr();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-900/5 bg-white/80 backdrop-blur-lg dark:border-white/5 dark:bg-zinc-950/80">
      <nav className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-2.5 rounded-lg">
          <Logo />
          <span className="text-lg font-bold tracking-tight">
            Confirm
            <span className="text-emerald-600 dark:text-emerald-400">
              Berth
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:block">
            <QuotaPill quota={quota} />
          </span>
          <span className="sm:hidden">
            <QuotaPill quota={quota} compact />
          </span>

          {user === undefined ? (
            <span className="h-9 w-9 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          ) : user ? (
            <UserMenu
              user={user}
              onLogout={logout}
              theme={theme}
              setTheme={setTheme}
            />
          ) : (
            <button
              onClick={login}
              disabled={authBusy}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-zinc-800 shadow-sm ring-1 ring-zinc-900/10 transition hover:bg-zinc-50 disabled:opacity-60 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-zinc-800"
            >
              {authBusy ? <Spinner /> : <FcGoogle className="h-4 w-4" />}
              <span>Log in</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

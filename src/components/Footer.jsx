export default function Footer() {
  return (
    <footer className="border-t border-zinc-900/5 dark:border-white/5">
      <div className="mx-auto flex max-w-3xl flex-col gap-1 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:justify-between">
        <p>
          Made with ❤ by{" "}
          <a className="font-medium text-zinc-700 hover:text-emerald-600 dark:text-zinc-300" href="https://github.com/sharif-22" target="_blank" rel="noreferrer">
            Sharif
          </a>{" "}
          ·{" "}
          <a className="font-medium text-zinc-700 hover:text-emerald-600 dark:text-zinc-300" href="https://github.com/sharif-22/confirm-berth" target="_blank" rel="noreferrer">
            Contribute on GitHub
          </a>
        </p>
        <p>Not affiliated with IRCTC or Indian Railways · © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}

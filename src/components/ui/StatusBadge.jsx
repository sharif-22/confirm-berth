import { STATUS, toneClasses } from "../../lib/status";

export default function StatusBadge({ kind = "unknown", children, size = "sm" }) {
  const tone = STATUS[kind]?.tone || "zinc";
  const pad = size === "lg" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md font-semibold ring-1 ring-inset ${pad} ${toneClasses[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" aria-hidden="true" />
      {children ?? STATUS[kind]?.label}
    </span>
  );
}

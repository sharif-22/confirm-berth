import { LuTrain } from "react-icons/lu";

export default function Logo({ size = "md" }) {
  const box = size === "lg" ? "h-12 w-12 rounded-2xl" : "h-9 w-9 rounded-xl";
  const icon = size === "lg" ? "h-6 w-6" : "h-5 w-5";
  return (
    <span
      className={`grid shrink-0 place-items-center bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-sm shadow-emerald-600/30 ${box}`}
    >
      <LuTrain className={icon} aria-hidden="true" />
    </span>
  );
}

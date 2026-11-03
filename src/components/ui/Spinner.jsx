import { LuLoader2 } from "react-icons/lu";

export default function Spinner({ className = "h-4 w-4" }) {
  return <LuLoader2 className={`animate-spin ${className}`} aria-hidden="true" />;
}

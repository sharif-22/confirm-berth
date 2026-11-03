import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/** Bottom sheet on phones, centered dialog on larger screens. Esc / backdrop closes. */
export default function Modal({ open, onClose, labelledBy, children, className = "" }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lastFocused = document.activeElement;
    const t = setTimeout(() => panelRef.current?.focus(), 20);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lastFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 animate-fade-in bg-zinc-950/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`relative max-h-[92dvh] w-full animate-sheet-up overflow-y-auto overscroll-contain rounded-t-3xl bg-white shadow-2xl outline-none sm:max-w-lg sm:animate-pop-in sm:rounded-3xl dark:bg-zinc-900 ${className}`}
      >
        <div className="sticky top-0 z-10 flex justify-center pt-2 sm:hidden" aria-hidden="true">
          <span className="h-1.5 w-10 rounded-sm bg-zinc-300/80 dark:bg-zinc-700" />
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

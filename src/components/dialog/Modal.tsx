import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Announced as the dialog's accessible name. */
  title: string;
  children: ReactNode;
  className?: string;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

/**
 * Minimal accessible dialog — scroll lock, Escape, focus trap, focus restore.
 * Hand-rolled rather than pulling in Radix for one component; swap for
 * `@radix-ui/react-dialog` if the app grows more dialog surface.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  /* Callers pass an inline arrow, so `onClose` has a new identity every
     render. Held in a ref so the effect below can depend on `open` alone —
     with `onClose` in the deps, every keystroke tore the effect down and its
     cleanup stole focus back to the trigger, letting you type one character
     at a time. */
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    // Focus the first meaningful control once
    const raf = requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const items = [
        ...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      restoreRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <div
        onClick={onClose}
        className="absolute inset-0 animate-[fadeIn_200ms_ease-out] bg-stone-900/50 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          /* Body scroll is locked while this is open, so a form taller than the
             screen has to scroll inside the panel — otherwise its Save button
             is unreachable on a phone. `svh` tracks the mobile URL bar, and
             `overscroll-contain` stops the page behind scrolling instead. */
          "bg-cream-50 relative max-h-[90svh] w-full max-w-md animate-[fadeIn_250ms_ease-out] overflow-y-auto overscroll-contain rounded-t-3xl p-6 shadow-xl sm:rounded-3xl sm:p-8",
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="hover:bg-maroon-50 absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full text-stone-500 transition-colors hover:text-stone-800"
        >
          <X className="h-5 w-5" />
        </button>

        {children}
      </div>
    </div>
  );
}

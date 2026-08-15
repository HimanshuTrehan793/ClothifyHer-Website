import { useLocation, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  /** Where to go when there's no history to pop. */
  fallback?: string;
  label?: string;
  className?: string;
}

/**
 * Returns to the previous screen. `location.key` is "default" only for the
 * first entry in the history stack — someone who opened the URL directly or
 * followed a shared link — and going back there would leave the site, so we
 * send them to `fallback` instead.
 */
export function BackButton({
  fallback = "/",
  label = "Back",
  className,
}: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <button
      type="button"
      onClick={() =>
        location.key === "default" ? navigate(fallback) : navigate(-1)
      }
      className={cn(
        "hover:text-maroon-800 -ml-1 inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}

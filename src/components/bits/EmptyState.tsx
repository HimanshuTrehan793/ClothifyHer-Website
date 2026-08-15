import { Link } from "react-router";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { BackButton } from "./BackButton";

interface EmptyStateProps {
  icon: ComponentType<LucideProps>;
  title: string;
  message: string;
  action: { label: string; href: string };
  /** Set false for screens that already show a back control above. */
  showBack?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  showBack = true,
}: EmptyStateProps) {
  return (
    <>
      {/* Left-aligned above the centred block — every empty screen is a place
          you can land directly, so it always needs a way out. */}
      {showBack && (
        <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 lg:px-10">
          <BackButton />
        </div>
      )}

      <div className="mx-auto flex max-w-sm flex-col items-center px-6 pt-10 pb-20 text-center">
        <span className="bg-maroon-50 grid h-20 w-20 place-items-center rounded-full">
          <Icon className="text-maroon-700 h-8 w-8" strokeWidth={1.5} />
        </span>
        <h2 className="mt-6 font-serif text-2xl text-stone-900">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">{message}</p>
        <Link
          to={action.href}
          className="bg-maroon-800 hover:bg-maroon-900 mt-7 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03]"
        >
          {action.label}
        </Link>
      </div>
    </>
  );
}

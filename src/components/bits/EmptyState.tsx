import { Link } from "react-router";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

interface EmptyStateProps {
  icon: ComponentType<LucideProps>;
  title: string;
  message: string;
  action: { label: string; href: string };
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
}: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-6 py-20 text-center">
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
  );
}

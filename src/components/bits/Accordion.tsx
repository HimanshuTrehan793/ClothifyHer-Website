import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen }: AccordionProps) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div className="border-b border-stone-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-stone-800"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-stone-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="animate-[fadeIn_200ms_ease-out] pb-4 text-sm leading-relaxed text-stone-600">
          {children}
        </div>
      )}
    </div>
  );
}

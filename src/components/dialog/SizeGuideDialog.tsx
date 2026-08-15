import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { cn } from "@/lib/utils";
import { FitDiagram } from "@/components/bits/FitDiagram";
import { chartFor, toUnit, type Unit } from "@/utils/sizeCharts";

interface SizeGuideDialogProps {
  open: boolean;
  onClose: () => void;
  /** Chooses the chart: `bottom-wear` gets waist/hips/length. */
  category: string;
  selectedSize: string | null;
  /** Applies the chosen size back to the product page. */
  onConfirm: (size: string) => void;
}

export function SizeGuideDialog({
  open,
  onClose,
  category,
  selectedSize,
  onConfirm,
}: SizeGuideDialogProps) {
  const chart = chartFor(category);
  const [unit, setUnit] = useState<Unit>("in");
  const [picked, setPicked] = useState<string | null>(selectedSize);

  // Reopen should reflect whatever is currently chosen on the page.
  useEffect(() => {
    if (open) setPicked(selectedSize);
  }, [open, selectedSize]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${chart.noun} size chart`}
      className="flex max-h-[88svh] max-w-lg flex-col p-0 sm:p-0"
    >
      {/* ── Header: title, fit diagram, unit toggle ─────────────────── */}
      <div className="shrink-0 px-5 pt-5">
        <h2 className="text-maroon-800 pr-10 font-serif text-2xl">
          {chart.noun} Size Chart
        </h2>

        <div className="mt-2">
          <FitDiagram kind={chart.kind} />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm text-stone-600">
            Garment measurements (In {unit === "in" ? "Inches" : "Cm"})
          </p>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
      </div>

      {/* ── Table: header pinned, body scrolls ─────────────────────── */}
      <div className="mt-3 min-h-0 flex-1 overflow-y-auto px-5">
        <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
          <colgroup>
            <col className="w-10" />
            <col />
            {chart.columns.map((c) => (
              <col key={c.id} />
            ))}
          </colgroup>

          <thead>
            <tr>
              <Th />
              <Th>Size</Th>
              {chart.columns.map((c) => (
                <Th key={c.id}>{c.label}</Th>
              ))}
            </tr>
          </thead>

          <tbody>
            {chart.rows.map((r, i) => {
              const isPicked = picked === r.size;

              return (
                <tr
                  key={r.size}
                  onClick={() => setPicked(r.size)}
                  className={cn(
                    "hover:bg-maroon-50 cursor-pointer",
                    i % 2 === 1 && "bg-cream-100/60",
                    isPicked && "bg-maroon-50 hover:bg-maroon-50",
                  )}
                >
                  <Td>
                    <input
                      type="radio"
                      name="size-chart"
                      checked={isPicked}
                      onChange={() => setPicked(r.size)}
                      aria-label={`Select size ${r.size}`}
                      className="accent-maroon-800 h-4 w-4"
                    />
                  </Td>
                  <Td className="font-semibold text-stone-900">{r.size}</Td>
                  {chart.columns.map((c) => (
                    <Td key={c.id} className="text-stone-600">
                      {toUnit(r.values[c.id], unit)}
                    </Td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Confirm ─────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-stone-200 p-4">
        <button
          type="button"
          disabled={!picked}
          onClick={() => picked && onConfirm(picked)}
          className="bg-maroon-800 hover:bg-maroon-900 h-12 w-full rounded-full text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          Confirm {chart.noun} Size
        </button>
      </div>
    </Modal>
  );
}

function UnitToggle({
  unit,
  onChange,
}: {
  unit: Unit;
  onChange: (u: Unit) => void;
}) {
  return (
    <div className="bg-maroon-50 relative grid w-fit shrink-0 grid-cols-2 rounded-full">
      {/* Sliding pill sits behind the labels so the swap animates. */}
      <span
        aria-hidden
        className={cn(
          "bg-maroon-800 absolute inset-y-0 left-0 w-1/2 rounded-full transition-transform duration-300 ease-out",
          unit === "cm" && "translate-x-full",
        )}
      />
      {(["in", "cm"] as Unit[]).map((u) => (
        <button
          key={u}
          type="button"
          onClick={() => onChange(u)}
          aria-pressed={unit === u}
          className={cn(
            "relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-300",
            unit === u ? "text-white" : "text-maroon-800",
          )}
        >
          {u === "in" ? "Inches" : "Cm"}
        </button>
      ))}
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th
      scope="col"
      className="sticky top-0 z-10 border-b border-stone-200 bg-stone-100 px-1 py-3 text-center text-xs font-semibold text-stone-500"
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-1 py-3.5 text-center", className)}>{children}</td>
  );
}

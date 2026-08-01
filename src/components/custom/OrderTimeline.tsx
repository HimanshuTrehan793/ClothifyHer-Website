import { Check, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FULFILMENT_STEPS, type Order } from "@/interfaces/order";

/**
 * Vertical stepper for doc §15. A cancelled order stops the happy path dead
 * rather than rendering four greyed-out steps that will never happen.
 */
export function OrderTimeline({ order }: { order: Order }) {
  const timeOf = (status: string) =>
    order.events.find((e) => e.status === status)?.at;

  if (order.status === "cancelled") {
    const confirmedAt = timeOf("confirmed");
    const cancelledAt = timeOf("cancelled");

    return (
      <ol className="space-y-0">
        <Step
          done
          label="Order Confirmed"
          hint="We've received your order"
          at={confirmedAt}
        />
        <Step
          done
          tone="cancelled"
          label="Cancelled"
          hint={order.cancelledReason ?? "This order was cancelled"}
          at={cancelledAt}
          last
        />
      </ol>
    );
  }

  const currentIndex = FULFILMENT_STEPS.findIndex(
    (s) => s.status === order.status,
  );

  return (
    <ol className="space-y-0">
      {FULFILMENT_STEPS.map((step, i) => (
        <Step
          key={step.status}
          done={i <= currentIndex}
          current={i === currentIndex}
          label={step.label}
          hint={step.hint}
          at={timeOf(step.status)}
          last={i === FULFILMENT_STEPS.length - 1}
        />
      ))}
    </ol>
  );
}

function Step({
  done,
  current,
  tone = "normal",
  label,
  hint,
  at,
  last,
}: {
  done: boolean;
  current?: boolean;
  tone?: "normal" | "cancelled";
  label: string;
  hint: string;
  at?: string;
  last?: boolean;
}) {
  const cancelled = tone === "cancelled";

  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors",
            cancelled
              ? "border-stone-300 bg-stone-100 text-stone-500"
              : done
                ? "border-maroon-800 bg-maroon-800 text-white"
                : "border-stone-300 bg-white text-stone-300",
          )}
        >
          {cancelled ? (
            <XCircle className="h-4 w-4" />
          ) : done ? (
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
          )}
        </span>

        {!last && (
          <span
            className={cn(
              "w-0.5 flex-1",
              done && !cancelled ? "bg-maroon-800" : "bg-stone-200",
            )}
          />
        )}
      </div>

      <div className={cn("pb-7", last && "pb-0")}>
        <p
          className={cn(
            "text-sm font-semibold",
            done ? "text-stone-900" : "text-stone-400",
          )}
        >
          {label}
          {current && (
            <span className="bg-maroon-50 text-maroon-800 ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase">
              Now
            </span>
          )}
        </p>
        <p className="mt-0.5 text-xs text-stone-500">{hint}</p>
        {at && <p className="mt-1 text-xs text-stone-400">{at}</p>}
      </div>
    </li>
  );
}

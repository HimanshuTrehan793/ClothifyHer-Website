import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/interfaces/order";

const STYLES: Record<OrderStatus, { label: string; className: string }> = {
  confirmed: { label: "Confirmed", className: "bg-blue-50 text-blue-700" },
  packed: { label: "Packed", className: "bg-blue-50 text-blue-700" },
  shipped: { label: "Shipped", className: "bg-amber-50 text-amber-700" },
  "out-for-delivery": {
    label: "Out for Delivery",
    className: "bg-amber-50 text-amber-700",
  },
  delivered: { label: "Delivered", className: "bg-green-50 text-green-700" },
  cancelled: { label: "Cancelled", className: "bg-stone-100 text-stone-500" },
  returned: { label: "Returned", className: "bg-stone-100 text-stone-500" },
};

export function OrderStatusPill({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  const style = STYLES[status];
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold",
        style.className,
        className,
      )}
    >
      {style.label}
    </span>
  );
}

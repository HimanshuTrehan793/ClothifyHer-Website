import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/interfaces/order";

const STYLES: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: "Awaiting Payment",
    className: "bg-amber-50 text-amber-700",
  },
  accepted: { label: "Confirmed", className: "bg-blue-50 text-blue-700" },
  processing: { label: "Processing", className: "bg-blue-50 text-blue-700" },
  packed: { label: "Packed", className: "bg-blue-50 text-blue-700" },
  shipped: { label: "Shipped", className: "bg-amber-50 text-amber-700" },
  out_for_delivery: {
    label: "Out for Delivery",
    className: "bg-amber-50 text-amber-700",
  },
  delivered: { label: "Delivered", className: "bg-green-50 text-green-700" },
  cancelled: { label: "Cancelled", className: "bg-stone-100 text-stone-500" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700" },
  returned: { label: "Returned", className: "bg-stone-100 text-stone-500" },
  refunded: { label: "Refunded", className: "bg-stone-100 text-stone-500" },
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

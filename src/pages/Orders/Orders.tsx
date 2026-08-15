import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { ChevronRight, Lock, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/bits/EmptyState";
import { OrderStatusPill } from "@/components/bits/OrderStatusPill";
import { SiteFooter } from "@/components/common/SiteFooter";
import { BackButton } from "@/components/bits/BackButton";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { openLogin, selectIsAuthenticated } from "@/features/auth/authSlice";
import { formatDate, formatPrice } from "@/utils/format";
import { useGetOrdersQuery } from "@/features/orders/orderApi";
import type { OrderStatus } from "@/interfaces/order";

const IN_PROGRESS: OrderStatus[] = [
  "pending",
  "accepted",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
];
const CLOSED: OrderStatus[] = [
  "cancelled",
  "rejected",
  "returned",
  "refunded",
];

const TABS: {
  id: string;
  label: string;
  match: (s: OrderStatus) => boolean;
}[] = [
  { id: "all", label: "All", match: () => true },
  {
    id: "active",
    label: "In Progress",
    match: (s) => IN_PROGRESS.includes(s),
  },
  { id: "delivered", label: "Delivered", match: (s) => s === "delivered" },
  {
    id: "cancelled",
    label: "Cancelled",
    match: (s) => CLOSED.includes(s),
  },
];

/** One page covers a normal order history; the tabs group several statuses,
    so filtering happens here rather than through the `?status=` param. */
const PAGE_SIZE = 50;

export default function Orders() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [tab, setTab] = useState("all");

  const { data, isLoading } = useGetOrdersQuery(
    { limit: PAGE_SIZE },
    { skip: !isAuthenticated },
  );
  const allOrders = data?.items ?? [];

  /* Orders are account data — there is nothing sensible to show a guest. */
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Your Orders — ClothifyHer</title>
        </Helmet>

        <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 lg:px-10">
          <BackButton />
        </div>

        <div className="mx-auto flex max-w-sm flex-col items-center px-6 pt-10 pb-20 text-center">
          <span className="bg-maroon-50 grid h-20 w-20 place-items-center rounded-full">
            <Lock className="text-maroon-700 h-8 w-8" strokeWidth={1.5} />
          </span>
          <h1 className="mt-6 font-serif text-2xl text-stone-900">
            Sign in to see your orders
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-500">
            We'll send a one-time code to your mobile number — no password
            needed.
          </p>
          <button
            type="button"
            onClick={() => dispatch(openLogin("account"))}
            className="bg-maroon-800 hover:bg-maroon-900 mt-7 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03]"
          >
            Sign in
          </button>
        </div>

        <SiteFooter />
      </>
    );
  }

  const active = TABS.find((t) => t.id === tab) ?? TABS[0];
  const orders = allOrders.filter((o) => active.match(o.status));

  return (
    <>
      <Helmet>
        <title>{`Your Orders (${allOrders.length}) — ClothifyHer`}</title>
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-10">
        <BackButton fallback="/" className="mb-4" />

        <h1 className="font-serif text-3xl text-stone-900">Your Orders</h1>
        <p className="mt-1 text-sm text-stone-500">
          Track, return or buy again
        </p>

        <div
          role="tablist"
          aria-label="Filter orders"
          className="hide-scrollbar mt-6 flex gap-2 overflow-x-auto border-b border-stone-200 pb-3"
        >
          {TABS.map((t) => {
            const count = allOrders.filter((o) => t.match(o.status)).length;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  tab === t.id
                    ? "bg-maroon-800 text-white"
                    : "hover:bg-maroon-50 text-stone-600",
                )}
              >
                {t.label}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <ul className="mt-6 space-y-4" aria-hidden>
            {Array.from({ length: 3 }, (_, i) => (
              <li
                key={i}
                className="h-32 animate-pulse rounded-2xl bg-stone-200"
              />
            ))}
          </ul>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Nothing here yet"
            message={
              tab === "all"
                ? "You haven't placed an order with us yet."
                : "No orders in this state right now."
            }
            action={{ label: "Start Shopping", href: "/#trending" }}
          />
        ) : (
          <ul className="mt-6 space-y-4">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/orders/${order.id}`}
                  className="hover:border-maroon-200 block rounded-2xl border border-stone-200 bg-white p-4 transition-colors sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Order #{order.orderNumber}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-500">
                        Placed {formatDate(order.placedAt)}
                      </p>
                    </div>
                    <OrderStatusPill status={order.status} />
                  </div>

                  {/* Thumbnails read faster than a list of titles. */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 3).map((item) => (
                        <img
                          key={item.id}
                          src={item.image}
                          alt=""
                          loading="lazy"
                          className="h-14 w-11 rounded-lg border-2 border-white object-cover"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <span className="grid h-14 w-11 place-items-center rounded-lg border-2 border-white bg-stone-100 text-xs font-semibold text-stone-500">
                          +{order.items.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-stone-700">
                        {order.items[0]?.title ?? "Order"}
                        {order.items.length > 1 &&
                          ` + ${order.items.length - 1} more`}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-stone-900">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-stone-300" />
                  </div>

                  {order.status === "out_for_delivery" &&
                    order.expectedDelivery && (
                      <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                        Arriving {formatDate(order.expectedDelivery)}
                      </p>
                    )}
                  {order.status === "delivered" && order.deliveredAt && (
                    <p className="mt-3 text-xs text-green-700">
                      Delivered on {formatDate(order.deliveredAt)}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <SiteFooter />
    </>
  );
}

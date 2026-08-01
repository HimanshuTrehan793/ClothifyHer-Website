import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router";
import {
  ChevronRight,
  Download,
  HeadphonesIcon,
  MapPin,
  PackageX,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";
import { EmptyState } from "@/components/bits/EmptyState";
import { OrderStatusPill } from "@/components/bits/OrderStatusPill";
import { PriceTag } from "@/components/bits/PriceTag";
import { OrderTimeline } from "@/components/custom/OrderTimeline";
import { SiteFooter } from "@/components/common/SiteFooter";
import { formatPrice } from "@/utils/format";
import { findOrder } from "@/utils/mockOrders";
import type { PaymentMethod } from "@/interfaces/order";

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  upi: "UPI",
  card: "Credit / Debit Card",
  netbanking: "Net Banking",
  wallet: "Wallet",
  cod: "Cash on Delivery",
};

export default function OrderDetail() {
  const { orderId = "" } = useParams();
  const order = findOrder(orderId);

  if (!order) {
    return (
      <>
        <Helmet>
          <title>Order not found — ClothifyHer</title>
        </Helmet>
        <EmptyState
          icon={PackageX}
          title="We couldn't find that order"
          message="The order number may be wrong, or it belongs to another account."
          action={{ label: "Back to Orders", href: "/orders" }}
        />
        <SiteFooter />
      </>
    );
  }

  const savings = order.itemMrpTotal - order.itemTotal;
  const cancellable = order.status === "confirmed" || order.status === "packed";
  const returnable = order.status === "delivered";

  return (
    <>
      <Helmet>
        <title>{`Order ${order.id} — ClothifyHer`}</title>
        {/* Order pages are account data — keep them out of the index. */}
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-10">
        <nav aria-label="Breadcrumb" className="text-xs text-stone-500">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link to="/orders" className="hover:text-maroon-800">
                Your Orders
              </Link>
            </li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-stone-700">{order.id}</li>
          </ol>
        </nav>

        <header className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl text-stone-900">{order.id}</h1>
            <p className="mt-1 text-sm text-stone-500">
              Placed {order.placedAt} · {order.items.length}{" "}
              {order.items.length === 1 ? "item" : "items"} ·{" "}
              {formatPrice(order.total)}
            </p>
          </div>
          <OrderStatusPill status={order.status} className="mt-1" />
        </header>

        {/* Live delivery banner */}
        {order.status === "out-for-delivery" && order.expectedDelivery && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <Truck className="h-5 w-5 shrink-0 text-amber-700" />
            <p className="text-sm text-amber-900">
              Arriving <strong>{order.expectedDelivery}</strong>
            </p>
          </div>
        )}
        {order.status === "confirmed" && order.expectedDelivery && (
          <div className="bg-cream-100/70 mt-5 flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3">
            <Truck className="text-maroon-700 h-5 w-5 shrink-0" />
            <p className="text-sm text-stone-700">
              Expected delivery <strong>{order.expectedDelivery}</strong>
            </p>
          </div>
        )}
        {order.status === "cancelled" && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-100 px-4 py-3">
            <XCircle className="h-5 w-5 shrink-0 text-stone-500" />
            <p className="text-sm text-stone-600">{order.cancelledReason}</p>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* ── Tracking + items ─────────────────────────────────── */}
          <div className="space-y-8 lg:col-span-3">
            <section>
              <h2 className="mb-5 text-sm font-semibold text-stone-800">
                Tracking
              </h2>
              <OrderTimeline order={order} />

              {order.trackingId && (
                <p className="bg-cream-100/70 mt-5 rounded-xl px-4 py-3 text-xs text-stone-600">
                  {order.courier} · Tracking ID{" "}
                  <span className="font-semibold text-stone-800">
                    {order.trackingId}
                  </span>
                </p>
              )}
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold text-stone-800">
                Items
              </h2>
              <ul className="space-y-3">
                {order.items.map((item) => (
                  <li
                    key={item.productId + item.size}
                    className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-3"
                  >
                    <Link
                      to={`/products/${item.productId}`}
                      className="shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="h-28 w-21 rounded-xl object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
                        {item.brand}
                      </p>
                      <Link
                        to={`/products/${item.productId}`}
                        className="hover:text-maroon-800 line-clamp-2 text-sm text-stone-800"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-1 text-xs text-stone-500">
                        Size {item.size} · Qty {item.quantity}
                      </p>
                      <PriceTag
                        price={item.price}
                        mrp={item.mrp}
                        className="mt-1.5"
                      />

                      {returnable && (
                        <button
                          type="button"
                          className="text-maroon-700 hover:text-maroon-900 mt-2 inline-flex items-center gap-1.5 text-xs font-medium"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Return or exchange
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ── Address, payment, actions ────────────────────────── */}
          <aside className="space-y-4 lg:col-span-2">
            <section className="rounded-2xl border border-stone-200 bg-white p-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-stone-800">
                <MapPin className="text-maroon-700 h-4 w-4" />
                Delivery Address
              </h2>
              <address className="mt-3 text-sm leading-relaxed text-stone-600 not-italic">
                <span className="font-medium text-stone-800">
                  {order.address.name}
                </span>
                <br />
                {order.address.line1}
                {order.address.line2 && (
                  <>
                    <br />
                    {order.address.line2}
                  </>
                )}
                <br />
                {order.address.city}, {order.address.state}{" "}
                {order.address.pincode}
                <br />
                {order.address.phone}
              </address>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-stone-800">
                Payment Summary
              </h2>
              <dl className="mt-3 space-y-2.5 text-sm">
                <Row
                  label={`Item total (${order.items.length})`}
                  value={formatPrice(order.itemTotal)}
                />
                {savings > 0 && (
                  <Row
                    label="Discount on MRP"
                    value={`− ${formatPrice(savings)}`}
                    positive
                  />
                )}
                {order.couponDiscount > 0 && (
                  <Row
                    label={`Coupon (${order.couponCode})`}
                    value={`− ${formatPrice(order.couponDiscount)}`}
                    positive
                  />
                )}
                {order.giftWrapFee > 0 && (
                  <Row
                    label="Gift wrap"
                    value={formatPrice(order.giftWrapFee)}
                  />
                )}
                <Row
                  label="Delivery"
                  value={
                    order.deliveryFee === 0
                      ? "FREE"
                      : formatPrice(order.deliveryFee)
                  }
                  positive={order.deliveryFee === 0}
                />
                <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold text-stone-900">
                  <dt>Total</dt>
                  <dd>{formatPrice(order.total)}</dd>
                </div>
              </dl>

              <p className="bg-cream-100/70 mt-3 rounded-lg px-3 py-2 text-xs text-stone-600">
                Paid via{" "}
                <span className="font-medium text-stone-800">
                  {PAYMENT_LABEL[order.paymentMethod]}
                </span>
              </p>
            </section>

            <div className="space-y-2">
              <button
                type="button"
                className="hover:border-maroon-600 hover:text-maroon-800 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-stone-300 text-sm font-semibold text-stone-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download Invoice
              </button>
              <button
                type="button"
                className="hover:border-maroon-600 hover:text-maroon-800 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-stone-300 text-sm font-semibold text-stone-700 transition-colors"
              >
                <HeadphonesIcon className="h-4 w-4" />
                Need Help?
              </button>
              {cancellable && (
                <button
                  type="button"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-red-200 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Order
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}

function Row({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-stone-500">{label}</dt>
      <dd
        className={positive ? "font-medium text-green-700" : "text-stone-800"}
      >
        {value}
      </dd>
    </div>
  );
}

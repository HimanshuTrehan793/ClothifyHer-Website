import { useState } from "react";
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
import { BackButton } from "@/components/bits/BackButton";
import { ContactDialog } from "@/components/dialog/ContactDialog";
import { downloadInvoice } from "@/utils/downloadInvoice";
import { toast } from "sonner";
import { formatDate, formatPrice } from "@/utils/format";
import {
  useCancelOrderMutation,
  useGetOrderByIdQuery,
} from "@/features/orders/orderApi";
import { useGetConfigurationQuery } from "@/features/configuration/configurationApi";
import {
  USER_CANCELLABLE,
  type OrderItem,
  type PaymentMethod,
} from "@/interfaces/order";

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  razorpay: "Paid online",
  cod: "Cash on Delivery",
};

export default function OrderDetail() {
  const { orderId = "" } = useParams();
  const { data: order, isLoading } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  });
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const { data: config } = useGetConfigurationQuery();

  const [helpOpen, setHelpOpen] = useState(false);
  const [invoicing, setInvoicing] = useState(false);

  /* Support details are store config, so the button only shows when one is set
     — a "Need help?" that goes nowhere is worse than no button. */
  const hasSupport = !!(config?.supportPhone || config?.supportEmail);

  const getInvoice = async () => {
    if (!order) return;
    setInvoicing(true);
    try {
      await downloadInvoice(order.id, order.orderNumber);
    } catch {
      toast.error("Couldn't download the invoice. Please try again.");
    } finally {
      setInvoicing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center text-stone-500">
        <div className="border-t-maroon-700 mx-auto h-7 w-7 animate-spin rounded-full border-2 border-stone-300" />
        <p className="mt-3 text-sm">Loading your order…</p>
      </div>
    );
  }

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
  // The API is the authority on what's cancellable; mirror its rule exactly.
  const cancellable = USER_CANCELLABLE.includes(order.status);
  const returnable = order.status === "delivered";
  const label = `Order #${order.orderNumber}`;

  return (
    <>
      <Helmet>
        <title>{`${label} — ClothifyHer`}</title>
        {/* Order pages are account data — keep them out of the index. */}
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-10">
        <BackButton fallback="/orders" className="mb-4" />

        <nav aria-label="Breadcrumb" className="text-xs text-stone-500">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link to="/orders" className="hover:text-maroon-800">
                Your Orders
              </Link>
            </li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-stone-700">{label}</li>
          </ol>
        </nav>

        <header className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl text-stone-900">{label}</h1>
            <p className="mt-1 text-sm text-stone-500">
              Placed {formatDate(order.placedAt)} · {order.items.length}{" "}
              {order.items.length === 1 ? "item" : "items"} ·{" "}
              {formatPrice(order.total)}
            </p>
          </div>
          <OrderStatusPill status={order.status} className="mt-1" />
        </header>

        {/* Live delivery banner */}
        {order.status === "out_for_delivery" && order.expectedDelivery && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <Truck className="h-5 w-5 shrink-0 text-amber-700" />
            <p className="text-sm text-amber-900">
              Arriving <strong>{formatDate(order.expectedDelivery)}</strong>
            </p>
          </div>
        )}
        {order.status === "accepted" && order.expectedDelivery && (
          <div className="bg-cream-100/70 mt-5 flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3">
            <Truck className="text-maroon-700 h-5 w-5 shrink-0" />
            <p className="text-sm text-stone-700">
              Expected delivery{" "}
              <strong>{formatDate(order.expectedDelivery)}</strong>
            </p>
          </div>
        )}
        {/* `pending` covers two different waits: an online order whose payment
            hasn't landed, and any order the store hasn't accepted yet. Saying
            "waiting for your payment" to someone who has paid reads as a
            problem with their money. */}
        {order.status === "pending" && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <XCircle className="h-5 w-5 shrink-0 text-amber-700" />
            <p className="text-sm text-amber-900">
              {order.paymentMethod === "razorpay" &&
              order.payment?.status !== "paid"
                ? "We're waiting for your payment to confirm. This updates automatically once it clears."
                : "We've got your order and will confirm it shortly."}
            </p>
          </div>
        )}
        {(order.status === "cancelled" || order.status === "rejected") && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-100 px-4 py-3">
            <XCircle className="h-5 w-5 shrink-0 text-stone-500" />
            <p className="text-sm text-stone-600">
              {order.events.find((e) => e.status === order.status)?.note ??
                `This order was ${order.status}.`}
            </p>
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

              {/* The API records no courier or tracking id yet — when order
                  shipping metadata lands, surface it here. */}
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold text-stone-800">
                Items
              </h2>
              <ul className="space-y-3">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-3"
                  >
                    {/* Items are snapshots — the product may since have been
                        deleted, in which case there's nothing to link to. */}
                    <ItemImage item={item} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
                        {item.brand}
                      </p>
                      {item.productSlug ? (
                        <Link
                          to={`/products/${item.productSlug}`}
                          className="hover:text-maroon-800 line-clamp-2 text-sm text-stone-800"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <span className="line-clamp-2 text-sm text-stone-800">
                          {item.title}
                        </span>
                      )}
                      <p className="mt-1 text-xs text-stone-500">
                        {item.color} · Size {item.size} · Qty {item.quantity}
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
            {order.address && (
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
                  {order.address.landmark && (
                    <>
                      <br />
                      {order.address.landmark}
                    </>
                  )}
                  <br />
                  {order.address.city}, {order.address.state}{" "}
                  {order.address.pincode}
                  <br />
                  {order.address.phone}
                </address>
              </section>
            )}

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
                {order.paymentMethod === "cod" ? "Paying by" : "Paid via"}{" "}
                <span className="font-medium text-stone-800">
                  {PAYMENT_LABEL[order.paymentMethod]}
                  {/* Razorpay reports the actual instrument once captured. */}
                  {order.payment?.method ? ` (${order.payment.method})` : ""}
                </span>
              </p>
            </section>

            <div className="space-y-2">
              {/* Delivered orders are the ones people want a receipt for —
                  though the endpoint serves any of their own orders. */}
              {order.status === "delivered" && (
                <button
                  type="button"
                  onClick={getInvoice}
                  disabled={invoicing}
                  className="hover:border-maroon-600 hover:text-maroon-800 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-stone-300 text-sm font-semibold text-stone-700 transition-colors disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  {invoicing ? "Preparing…" : "Invoice"}
                </button>
              )}

              {/* Support contact comes from store configuration. */}
              {hasSupport && (
                <button
                  type="button"
                  onClick={() => setHelpOpen(true)}
                  className="hover:border-maroon-600 hover:text-maroon-800 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-stone-300 text-sm font-semibold text-stone-700 transition-colors"
                >
                  <HeadphonesIcon className="h-4 w-4" />
                  Need Help?
                </button>
              )}
              {cancellable && (
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={() => {
                    if (
                      window.confirm("Cancel this order? This can't be undone.")
                    ) {
                      cancelOrder(order.id);
                    }
                  }}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-red-200 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  {cancelling ? "Cancelling…" : "Cancel Order"}
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>

      <SiteFooter />

      <ContactDialog
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        email={config?.supportEmail}
        phone={config?.supportPhone}
      />
    </>
  );
}

/** Item thumbnail — linked to the PDP only when the product still exists. */
function ItemImage({ item }: { item: OrderItem }) {
  const image = (
    <img
      src={item.image}
      alt={item.title}
      loading="lazy"
      className="h-28 w-21 rounded-xl object-cover"
    />
  );
  return item.productSlug ? (
    <Link to={`/products/${item.productSlug}`} className="shrink-0">
      {image}
    </Link>
  ) : (
    <span className="shrink-0">{image}</span>
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

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { Gift, Heart, ShoppingBag, Tag, Truck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/bits/EmptyState";
import { PriceTag } from "@/components/bits/PriceTag";
import { QuantityStepper } from "@/components/bits/QuantityStepper";
import { SectionHeading } from "@/components/bits/SectionHeading";
import { ProductCard } from "@/components/custom/card/ProductCard";
import { SiteFooter } from "@/components/common/SiteFooter";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  applyCoupon,
  removeCoupon,
  removeLine,
  selectCartLines,
  selectCartTotals,
  selectCoupon,
  selectGiftWrap,
  setGiftWrap,
  setQuantity,
  validateCoupon,
} from "@/features/cart/cartSlice";
import {
  selectWishlistIds,
  toggleWishlist,
} from "@/features/wishlist/wishlistSlice";
import { openLogin, selectIsAuthenticated } from "@/features/auth/authSlice";
import { formatPrice } from "@/utils/format";
import { FREE_DELIVERY_ABOVE, GIFT_WRAP_FEE } from "@/utils/constants";
import { TRENDING_PRODUCTS } from "@/utils/mockData";

export default function Cart() {
  const dispatch = useAppDispatch();
  const lines = useAppSelector(selectCartLines);
  const totals = useAppSelector(selectCartTotals);
  const coupon = useAppSelector(selectCoupon);
  const giftWrap = useAppSelector(selectGiftWrap);
  const wishlistIds = useAppSelector(selectWishlistIds);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);

  const submitCoupon = () => {
    const result = validateCoupon(code, totals.itemTotal);
    if (result.ok) {
      dispatch(applyCoupon(result.coupon));
      setCode("");
      setCouponError(null);
    } else {
      setCouponError(result.message);
    }
  };

  const checkout = () => {
    // Checkout is the one flow that genuinely requires an account.
    if (!isAuthenticated) dispatch(openLogin("checkout"));
    else console.info("TODO: navigate to /checkout once Phase 2 lands");
  };

  if (!lines.length) {
    return (
      <>
        <Helmet>
          <title>Your Bag — ClothifyHer</title>
        </Helmet>
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          message="Nothing here yet. Browse new arrivals and find something you love."
          action={{ label: "Shop New Arrivals", href: "/new-arrivals" }}
        />
        <SiteFooter />
      </>
    );
  }

  const savings = totals.itemMrpTotal - totals.itemTotal;

  return (
    <>
      <Helmet>
        {/* Helmet needs a single string child — interpolating inline splits
            this into an array and throws. */}
        <title>{`Your Bag (${lines.length}) — ClothifyHer`}</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <h1 className="font-serif text-3xl text-stone-900">Your Bag</h1>
        <p className="mt-1 text-sm text-stone-500">
          {lines.length} {lines.length === 1 ? "item" : "items"}
        </p>

        {/* Free-delivery nudge — the highest-leverage upsell on this page. */}
        {totals.freeDeliveryGap > 0 && (
          <div className="border-gold-300 bg-cream-100/70 mt-6 flex items-center gap-3 rounded-2xl border px-4 py-3">
            <Truck className="text-maroon-700 h-5 w-5 shrink-0" />
            <p className="text-sm text-stone-700">
              Add{" "}
              <strong className="font-semibold">
                {formatPrice(totals.freeDeliveryGap)}
              </strong>{" "}
              more for free delivery.
            </p>
          </div>
        )}
        {totals.freeDeliveryGap === 0 && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
            <Truck className="h-5 w-5 shrink-0 text-green-700" />
            <p className="text-sm text-green-800">
              You've unlocked free delivery.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          {/* ── Lines ─────────────────────────────────────────────── */}
          <ul className="space-y-4 lg:col-span-7">
            {lines.map((line) => (
              <li
                key={line.lineId}
                className="relative flex gap-4 rounded-2xl bg-white p-3 shadow-sm sm:p-4"
              >
                <Link to={`/products/${line.productId}`} className="shrink-0">
                  <img
                    src={line.image}
                    alt={line.title}
                    loading="lazy"
                    className="h-32 w-24 rounded-xl object-cover sm:h-36 sm:w-28"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
                    {line.brand}
                  </p>
                  <Link
                    to={`/products/${line.productId}`}
                    className="hover:text-maroon-800 line-clamp-2 pr-8 text-sm text-stone-800"
                  >
                    {line.title}
                  </Link>

                  <p className="mt-1.5 text-xs text-stone-500">
                    Size:{" "}
                    <span className="font-medium text-stone-700">
                      {line.size}
                    </span>
                    {line.color && (
                      <>
                        {" · Colour: "}
                        <span className="font-medium text-stone-700">
                          {line.color}
                        </span>
                      </>
                    )}
                  </p>

                  <PriceTag
                    price={line.price}
                    mrp={line.mrp}
                    className="mt-2"
                  />

                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <QuantityStepper
                      quantity={line.quantity}
                      label={line.title}
                      onChange={(quantity) =>
                        dispatch(setQuantity({ lineId: line.lineId, quantity }))
                      }
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const product = [...TRENDING_PRODUCTS].find(
                          (p) => p.id === line.productId,
                        );
                        if (product) dispatch(toggleWishlist(product));
                        dispatch(removeLine(line.lineId));
                      }}
                      className="hover:text-maroon-800 inline-flex items-center gap-1.5 text-xs font-medium text-stone-500"
                    >
                      <Heart className="h-3.5 w-3.5" />
                      Save for later
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => dispatch(removeLine(line.lineId))}
                  aria-label={`Remove ${line.title}`}
                  className="absolute top-3 right-3 grid h-7 w-7 place-items-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          {/* ── Summary ───────────────────────────────────────────── */}
          <aside className="lg:col-span-5">
            <div className="sticky top-36 space-y-4">
              {/* Coupon */}
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="flex items-center gap-2 text-sm font-semibold text-stone-800">
                  <Tag className="text-maroon-700 h-4 w-4" />
                  Coupon
                </p>

                {coupon ? (
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-3 py-2.5">
                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        {coupon.code}
                      </p>
                      <p className="text-xs text-green-700">
                        {coupon.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => dispatch(removeCoupon())}
                      className="text-xs font-medium text-green-800 underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-3 flex gap-2">
                      <input
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && submitCoupon()}
                        placeholder="Enter code"
                        aria-label="Coupon code"
                        aria-invalid={!!couponError}
                        className={cn(
                          "focus:border-maroon-600 bg-cream-50 h-11 flex-1 rounded-full border px-4 text-sm tracking-wide outline-none",
                          couponError ? "border-red-400" : "border-stone-300",
                        )}
                      />
                      <button
                        type="button"
                        onClick={submitCoupon}
                        className="border-maroon-800 text-maroon-800 hover:bg-maroon-800 h-11 rounded-full border px-5 text-sm font-semibold transition-colors hover:text-white"
                      >
                        Apply
                      </button>
                    </div>
                    <p
                      aria-live="polite"
                      className="mt-2 min-h-4 text-xs text-red-600"
                    >
                      {couponError}
                    </p>
                    <p className="text-xs text-stone-400">
                      Try WELCOME10, FLAT300 or FESTIVE20
                    </p>
                  </>
                )}
              </div>

              {/* Gift wrap */}
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => dispatch(setGiftWrap(e.target.checked))}
                  className="accent-maroon-800 h-4 w-4"
                />
                <Gift className="text-maroon-700 h-4 w-4" />
                <span className="flex-1 text-sm text-stone-700">
                  Add gift wrap
                </span>
                <span className="text-sm font-medium text-stone-600">
                  {formatPrice(GIFT_WRAP_FEE)}
                </span>
              </label>

              {/* Totals */}
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-stone-800">
                  Order Summary
                </p>

                <dl className="mt-3 space-y-2.5 text-sm">
                  <Row
                    label={`Item total (${lines.length})`}
                    value={formatPrice(totals.itemTotal)}
                  />
                  {savings > 0 && (
                    <Row
                      label="Discount on MRP"
                      value={`− ${formatPrice(savings)}`}
                      positive
                    />
                  )}
                  {totals.couponDiscount > 0 && (
                    <Row
                      label={`Coupon (${coupon?.code})`}
                      value={`− ${formatPrice(totals.couponDiscount)}`}
                      positive
                    />
                  )}
                  {totals.giftWrapFee > 0 && (
                    <Row
                      label="Gift wrap"
                      value={formatPrice(totals.giftWrapFee)}
                    />
                  )}
                  <Row
                    label="Delivery"
                    value={
                      totals.deliveryFee === 0
                        ? "FREE"
                        : formatPrice(totals.deliveryFee)
                    }
                    positive={totals.deliveryFee === 0}
                  />

                  <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold text-stone-900">
                    <dt>Total</dt>
                    <dd>{formatPrice(totals.grandTotal)}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={checkout}
                  className="bg-maroon-800 hover:bg-maroon-900 mt-5 h-12 w-full rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
                >
                  {isAuthenticated
                    ? "Proceed to Checkout"
                    : "Sign in to Checkout"}
                </button>

                <p className="mt-3 text-center text-[11px] text-stone-400">
                  Free delivery on orders above{" "}
                  {formatPrice(FREE_DELIVERY_ABOVE)}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Recommendations — doc §11 */}
      <section className="bg-cream-100/60 py-12">
        <SectionHeading
          title="You May Also Like"
          action={{ label: "View all", href: "/new-arrivals" }}
        />
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 sm:px-6 md:grid-cols-4 lg:px-10">
          {TRENDING_PRODUCTS.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wishlisted={wishlistIds.has(product.id)}
              onToggleWishlist={() => dispatch(toggleWishlist(product))}
            />
          ))}
        </div>
      </section>

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

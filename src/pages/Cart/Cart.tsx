import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router";
import {
  AlertTriangle,
  Heart,
  Plus,
  ShoppingBag,
  Tag,
  Truck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/bits/EmptyState";
import { PriceTag } from "@/components/bits/PriceTag";
import { QuantityStepper } from "@/components/bits/QuantityStepper";
import { SectionHeading } from "@/components/bits/SectionHeading";
import { ProductCard } from "@/components/custom/card/ProductCard";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import { SiteFooter } from "@/components/common/SiteFooter";
import { BackButton } from "@/components/bits/BackButton";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { applyCoupon } from "@/features/cart/cartSlice";
import { useCart } from "@/features/cart/useCart";
import { useValidateCouponMutation } from "@/features/coupon/couponApi";
import { useWishlist } from "@/features/wishlist/useWishlist";
import { useGetProductsQuery } from "@/features/product/productApi";
import { openLogin, selectIsAuthenticated } from "@/features/auth/authSlice";
import { formatPrice } from "@/utils/format";

export default function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    lines,
    totals,
    coupon,
    clearCoupon,
    setQuantity,
    remove,
    isLoading,
    storeClosed,
    hasOutOfStock,
    freeShippingThreshold: freeDeliveryThreshold,
  } = useCart();
  const { ids: wishlistIds, toggle: toggleWishlist } = useWishlist();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validate, { isLoading: validating }] = useValidateCouponMutation();

  /* Recommendations come off the live catalog rather than a fixed list. */
  const { data: suggestions, isLoading: suggestionsLoading } =
    useGetProductsQuery({ limit: 4 });

  /* The coupon is held client-side but its minimum is enforced against the
     server's subtotal — drop it the moment the bag falls below that, so the
     summary can't promise a discount checkout would reject. */
  useEffect(() => {
    if (
      coupon &&
      totals.itemTotal > 0 &&
      totals.itemTotal < coupon.minOrderValue
    ) {
      clearCoupon();
      setCouponError(
        `${coupon.code} needs a minimum of ${formatPrice(coupon.minOrderValue)} — it's been removed.`,
      );
    }
  }, [coupon, totals.itemTotal, clearCoupon]);

  const submitCoupon = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setCouponError("Enter a coupon code.");
      return;
    }
    try {
      // The server is the authority: it owns the window, the minimum and the cap.
      const result = await validate({
        code: trimmed,
        cart_total: totals.itemTotal,
      }).unwrap();
      dispatch(applyCoupon(result.coupon));
      setCode("");
      setCouponError(null);
    } catch {
      /* The base query already toasted the server's message ("Coupon has
         expired", "Add ₹300 more…"); keep the inline slot for the field. */
      setCouponError("That code couldn't be applied.");
    }
  };

  const checkout = () => {
    // Checkout is the one flow that genuinely requires an account.
    if (!isAuthenticated) dispatch(openLogin("checkout"));
    else navigate("/checkout");
  };

  // The bag is tied to the account, so a signed-out visitor is gated here —
  // the header sends them to sign in; this covers a direct /cart link.
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Your Bag — ClothifyHer</title>
        </Helmet>
        <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 lg:px-10">
          <BackButton />
        </div>
        <div className="mx-auto flex max-w-sm flex-col items-center px-6 pt-10 pb-20 text-center">
          <span className="bg-maroon-50 grid h-20 w-20 place-items-center rounded-full">
            <ShoppingBag
              className="text-maroon-700 h-8 w-8"
              strokeWidth={1.5}
            />
          </span>
          <h1 className="mt-6 font-serif text-2xl text-stone-900">
            Sign in to view your bag
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-500">
            Your bag is saved to your account, so it's waiting for you on every
            device.
          </p>
          <button
            type="button"
            onClick={() => dispatch(openLogin("cart"))}
            className="bg-maroon-800 hover:bg-maroon-900 mt-7 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03]"
          >
            Sign in
          </button>
        </div>
        <SiteFooter />
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Your Bag — ClothifyHer</title>
        </Helmet>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <div className="h-8 w-40 animate-pulse rounded bg-stone-200" />
          <ul className="mt-6 space-y-4" aria-hidden>
            {Array.from({ length: 3 }, (_, i) => (
              <li
                key={i}
                className="h-40 animate-pulse rounded-2xl bg-stone-200"
              />
            ))}
          </ul>
        </div>
        <SiteFooter />
      </>
    );
  }

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
        <BackButton fallback="/" className="mb-4" />

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
                className={cn(
                  "relative flex gap-4 rounded-2xl p-3 shadow-sm sm:p-4",
                  // Greyed row: reads as unavailable at a glance, while the
                  // remove / save-for-later actions below stay full-strength.
                  line.outOfStock ? "bg-stone-100" : "bg-white",
                )}
              >
                {/* PDP routes on slug, which the cart row carries. */}
                <Link
                  to={`/products/${line.productSlug ?? line.productId}`}
                  className="relative shrink-0"
                >
                  <img
                    src={line.image}
                    alt={line.title}
                    loading="lazy"
                    className={cn(
                      "h-32 w-24 rounded-xl object-cover sm:h-36 sm:w-28",
                      line.outOfStock && "opacity-50 grayscale",
                    )}
                  />
                  {line.outOfStock && (
                    <span className="absolute inset-x-1.5 bottom-1.5 rounded-full bg-stone-900/85 py-1 text-center text-[10px] font-semibold tracking-wider text-white uppercase">
                      Out of stock
                    </span>
                  )}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
                    {line.brand}
                  </p>
                  <Link
                    to={`/products/${line.productSlug ?? line.productId}`}
                    className={cn(
                      "hover:text-maroon-800 line-clamp-2 pr-8 text-sm",
                      line.outOfStock ? "text-stone-500" : "text-stone-800",
                    )}
                  >
                    {line.title}
                  </Link>

                  {/* The colour can go out of stock after it was added; the
                      order endpoint refuses to place it, so say so here. */}
                  {line.outOfStock && (
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Out of stock — remove to check out
                    </p>
                  )}

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
                    className={cn("mt-2", line.outOfStock && "opacity-50")}
                  />

                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    {/* No buying more of something that can't be bought. */}
                    {!line.outOfStock && (
                      <QuantityStepper
                        quantity={line.quantity}
                        label={line.title}
                        max={line.maxQuantity}
                        onChange={(quantity) => setQuantity(line, quantity)}
                      />
                    )}

                    {/* The cart row carries only a product snapshot, so the
                        wishlist gets that same snapshot — enough for its card. */}
                    <button
                      type="button"
                      onClick={() => {
                        toggleWishlist({
                          id: line.productId,
                          slug: line.productSlug,
                          brand: line.brand,
                          title: line.title,
                          category: "",
                          sizes: [],
                          image: line.image,
                          price: line.price,
                          mrp: line.mrp,
                        });
                        remove(line);
                      }}
                      className="hover:text-maroon-800 ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-stone-500"
                    >
                      <Heart className="h-3.5 w-3.5" />
                      Save for later
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => remove(line)}
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
                      onClick={clearCoupon}
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
                        disabled={validating}
                        className="border-maroon-800 text-maroon-800 hover:bg-maroon-800 h-11 rounded-full border px-5 text-sm font-semibold transition-colors hover:text-white disabled:opacity-50"
                      >
                        {validating ? "Checking…" : "Apply"}
                      </button>
                    </div>
                    <p
                      aria-live="polite"
                      className="mt-2 min-h-4 text-xs text-red-600"
                    >
                      {couponError}
                    </p>
                  </>
                )}
              </div>

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

                {/* `store_active` gates every order server-side — don't offer
                    a checkout the API is going to refuse. */}
                {storeClosed && (
                  <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                    The store is temporarily closed and isn't accepting orders
                    right now.
                  </p>
                )}

                <button
                  type="button"
                  onClick={checkout}
                  disabled={storeClosed || hasOutOfStock}
                  className="bg-maroon-800 hover:bg-maroon-900 mt-5 h-12 w-full rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-50"
                >
                  {isAuthenticated
                    ? "Proceed to Checkout"
                    : "Sign in to Checkout"}
                </button>

                {/* Secondary to checkout — outlined so it never competes. */}
                <Link
                  to="/"
                  className="border-maroon-800 text-maroon-800 hover:bg-maroon-50 mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add more items
                </Link>

                {hasOutOfStock && (
                  <p className="mt-3 text-center text-[11px] text-red-600">
                    Remove the out-of-stock items to continue.
                  </p>
                )}

                <p className="mt-3 text-center text-[11px] text-stone-400">
                  Free delivery on orders above{" "}
                  {formatPrice(freeDeliveryThreshold)}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Recommendations — doc §11 */}
      {(suggestionsLoading || (suggestions?.items.length ?? 0) > 0) && (
        <section className="bg-cream-100/60 py-12">
          <SectionHeading
            title="You May Also Like"
            action={{ label: "View all", href: "/categories" }}
          />
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 sm:px-6 md:grid-cols-4 lg:px-10">
            {suggestionsLoading
              ? Array.from({ length: 4 }, (_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : suggestions?.items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    wishlisted={wishlistIds.has(product.id)}
                    onToggleWishlist={() => toggleWishlist(product)}
                  />
                ))}
          </div>
        </section>
      )}

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

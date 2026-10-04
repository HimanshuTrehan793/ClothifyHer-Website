import { useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router";
import { ChevronRight, Heart, PackageX, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion } from "@/components/bits/Accordion";
import { EmptyState } from "@/components/bits/EmptyState";
import { PriceTag } from "@/components/bits/PriceTag";
import { SectionHeading } from "@/components/bits/SectionHeading";
import { StarRating } from "@/components/bits/StarRating";
import { VariantSwatches } from "@/components/bits/VariantSwatches";
import { ProductGallery } from "@/components/custom/ProductGallery";
import { ProductCard } from "@/components/custom/card/ProductCard";
import { SiteFooter } from "@/components/common/SiteFooter";
import { SizeGuideDialog } from "@/components/dialog/SizeGuideDialog";
import { ShareButton } from "@/components/dialog/ShareDialog";
import { BackButton } from "@/components/bits/BackButton";
import { useCart } from "@/features/cart/useCart";
import { useWishlist } from "@/features/wishlist/useWishlist";
import { galleryOf } from "@/utils/media";
import { isProductSoldOut } from "@/utils/stock";
import { SHARE_BASE_URL } from "@/utils/constants";
import type { ProductVariant } from "@/interfaces/catalog";
import {
  useGetProductBySlugQuery,
  useGetProductsQuery,
} from "@/features/product/productApi";
import { useGetConfigurationQuery } from "@/features/configuration/configurationApi";
import { formatPrice } from "@/utils/format";

const SELECT_SIZE_MSG = "Please select a size to continue.";

export default function ProductDetail() {
  const { productId: param = "" } = useParams();
  const { ids: wishlistIds, toggle: toggleWishlist } = useWishlist();
  const { add, isAdding } = useCart();
  const navigate = useNavigate();

  /* Products resolve by slug — `/products/:slug` is the canonical PDP route. */
  const { data: product, isLoading: loading } = useGetProductBySlugQuery(
    param ? param : skipToken,
  );

  /* "You may also like" = more from the same category. Waits for the product,
     since its category slug is the filter. */
  const { data: related } = useGetProductsQuery(
    product?.category ? { category: product.category, limit: 5 } : skipToken,
  );
  const similar = (related?.items ?? [])
    .filter((p) => p.id !== product?.id)
    .slice(0, 4);

  const { data: config } = useGetConfigurationQuery();

  const [variantId, setVariantId] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  // Landing on a new product from "similar products" must reset the picker
  // and start at the top, not halfway down the previous page.
  useEffect(() => {
    setVariantId(null);
    setSize(null);
    setSizeError(null);
    setAdded(false);
    window.scrollTo({ top: 0 });
  }, [param]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center text-stone-500">
        <div className="border-t-maroon-700 mx-auto h-7 w-7 animate-spin rounded-full border-2 border-stone-300" />
        <p className="mt-3 text-sm">Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <Helmet>
          <title>Product not found — ClothifyHer</title>
        </Helmet>
        <EmptyState
          icon={PackageX}
          title="We couldn't find that piece"
          message="It may have sold out or the link might be wrong."
          action={{ label: "Browse New Arrivals", href: "/#new-arrivals" }}
        />
        <SiteFooter />
      </>
    );
  }

  /* Default to the first colourway; everything below reads from the variant
     and falls back to the product when it has none. */
  const variants = product.variants ?? [];
  const variant: ProductVariant | undefined =
    variants.find((v) => v.id === variantId) ?? variants[0];

  const media = variant?.media ?? galleryOf(product);
  const price = variant?.price ?? product.price;
  const mrp = variant?.mrp ?? product.mrp;
  const sizes = variant?.sizes ?? product.sizes;
  // A colour flagged out of stock has no buyable size, whatever its rows say.
  const soldOut = sizes.length === 0 || variant?.outOfStock === true;
  // Sizes switched off individually within an otherwise in-stock colour.
  const oosSizes = new Set(variant?.outOfStockSizes ?? []);
  // Every colour gone vs. just the one on screen — they need different copy.
  const productSoldOut = isProductSoldOut(product);
  const wishlisted = wishlistIds.has(product.id);

  /** Validates the size pick and resolves it to its sellable row, or shows why not. */
  const resolveRow = () => {
    // The single biggest conversion leak on mobile is a silent no-op here.
    if (!size) {
      setSizeError(SELECT_SIZE_MSG);
      document
        .getElementById("size-picker")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return null;
    }
    if (oosSizes.has(size)) {
      setSizeError(`${size} is out of stock in this colour.`);
      return null;
    }
    /* The cart keys on the priced size×colour unit, not on a size label —
       resolve the chosen size back to its VariantSize row. */
    const row = variant?.sizeRows?.find((s) => s.size === size);
    if (!row) {
      setSizeError(SELECT_SIZE_MSG);
      return null;
    }
    return row;
  };

  const handleAddToCart = () => {
    const row = resolveRow();
    if (!row) return;
    add(row.id);
    setAdded(true);
  };

  /* Buy now = add this size (unless it's already in) and go straight to the
     bag. Waits for the server so the cart never renders without the item. */
  const handleBuyNow = async () => {
    if (added) {
      navigate("/cart");
      return;
    }
    const row = resolveRow();
    if (!row) return;
    const pending = add(row.id);
    if (!pending) return; // signed out — the login sheet is open instead
    try {
      await pending.unwrap();
      setAdded(true);
      navigate("/cart");
    } catch {
      /* The base query already toasted the server's reason; stay put. */
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${product.title} — ClothifyHer`}</title>
        <meta
          name="description"
          content={product.description ?? product.title}
        />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
        <BackButton fallback="/" className="mb-4" />

        <nav aria-label="Breadcrumb" className="mb-5 text-xs text-stone-500">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-maroon-800">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3 w-3" />
            <li>
              <Link to="/#trending" className="hover:text-maroon-800">
                {product.brand}
              </Link>
            </li>
            <ChevronRight className="h-3 w-3" />
            <li className="truncate text-stone-700">{product.title}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery
            key={variant?.id ?? product.id}
            media={media}
            title={product.title}
          />

          {/* ── Buy panel ───────────────────────────────────────────── */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
                  {product.brand}
                </p>
                <h1 className="mt-1 font-serif text-3xl leading-tight text-stone-900">
                  {product.title}
                </h1>
              </div>
              {/* The /s/ link previews with the product's own photo, then
                  redirects to this page. Canonical slug, so no tracking
                  params from the visitor's own URL ride along. */}
              <ShareButton
                title={product.title}
                url={`${SHARE_BASE_URL}/s/${product.slug ?? product.id}`}
                className="-mt-1 -mr-2"
              />
            </div>

            {/* Plain text, not a link — there's no reviews section to jump to. */}
            {product.rating && (
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-stone-600">
                <StarRating rating={product.rating} />
                <span className="font-medium">{product.rating}</span>
                <span className="text-stone-400">
                  ({product.reviewCount} ratings)
                </span>
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <PriceTag
                price={price}
                mrp={mrp}
                className={cn(
                  "[&>span:first-child]:text-2xl",
                  soldOut && "opacity-50",
                )}
              />
              {soldOut && (
                <span className="rounded-full bg-stone-900/85 px-3 py-1 text-[11px] font-semibold tracking-wider text-white uppercase">
                  {productSoldOut ? "Sold out" : "Sold out in this colour"}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-stone-400">
              Inclusive of all taxes
            </p>

            {variants.length > 1 && (
              <div className="mt-7">
                <VariantSwatches
                  variants={variants}
                  activeId={variant!.id}
                  onSelect={(v) => {
                    setVariantId(v.id);
                    // Sizes can differ per colourway — never carry a stale pick.
                    setSize(null);
                    setSizeError(null);
                    setAdded(false);
                  }}
                />
              </div>
            )}

            {/* Sizes */}
            <div id="size-picker" className="mt-7 scroll-mt-28">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-stone-800">
                  Select Size
                </p>
                <button
                  type="button"
                  onClick={() => setGuideOpen(true)}
                  className="text-maroon-700 hover:text-maroon-900 text-sm font-medium underline underline-offset-2"
                >
                  Size guide
                </button>
              </div>

              {soldOut ? (
                <p className="mt-3 rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-500">
                  {/* Only "pick another" when one exists — i.e. not every
                      colour is gone, which implies the swatches are showing. */}
                  {productSoldOut
                    ? "Sold out in every colour and size right now."
                    : "This colour is sold out — pick another colour above."}
                </p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSize(s);
                        setSizeError(null);
                        setAdded(false);
                      }}
                      aria-pressed={size === s}
                      disabled={oosSizes.has(s)}
                      title={oosSizes.has(s) ? "Out of stock" : undefined}
                      className={cn(
                        "h-11 min-w-11 rounded-full border px-4 text-sm font-medium transition-colors",
                        oosSizes.has(s)
                          ? "cursor-not-allowed border-stone-200 text-stone-300 line-through"
                          : size === s
                            ? "border-maroon-800 bg-maroon-800 text-white"
                            : "hover:border-maroon-600 border-stone-300 text-stone-700",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <p
                aria-live="polite"
                className="mt-2 min-h-5 text-sm text-red-600"
              >
                {sizeError}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={soldOut || isAdding}
                className={cn(
                  "inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300",
                  soldOut
                    ? "cursor-not-allowed bg-stone-200 text-stone-400"
                    : added
                      ? "bg-green-700 text-white"
                      : "bg-maroon-800 hover:bg-maroon-900 text-white hover:scale-[1.02]",
                )}
              >
                <ShoppingBag className="h-4 w-4" />
                {soldOut
                  ? "Sold out"
                  : isAdding
                    ? "Adding…"
                    : added
                      ? "Added to Bag"
                      : "Add to Bag"}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-pressed={wishlisted}
                className="hover:border-maroon-600 inline-flex h-13 items-center gap-2 rounded-full border border-stone-300 px-6 text-sm font-semibold text-stone-700 transition-colors"
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    wishlisted && "fill-maroon-700 text-maroon-700",
                  )}
                />
                <span className="hidden sm:inline">
                  {wishlisted ? "Saved" : "Save"}
                </span>
              </button>
            </div>

            {!soldOut && (
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isAdding}
                className="border-maroon-800 text-maroon-800 hover:bg-maroon-50 mt-3 inline-flex h-13 w-full items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors disabled:opacity-60"
              >
                Buy now
              </button>
            )}

            {/* Details */}
            <div className="mt-6">
              <Accordion title="Product Details" defaultOpen>
                <p>{product.description}</p>
                <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                  {product.fabric && (
                    <Spec label="Fabric" value={product.fabric} />
                  )}
                  {product.fit && <Spec label="Fit" value={product.fit} />}
                  {product.color && (
                    <Spec label="Colour" value={product.color} />
                  )}
                  <Spec label="Country" value="India" />
                </dl>
              </Accordion>

              {product.care && (
                <Accordion title="Care Instructions">
                  <ul className="list-inside list-disc space-y-1">
                    {product.care.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </Accordion>
              )}

              <Accordion title="Shipping &amp; Returns">
                <p>
                  {/* Threshold is store config, not a constant — the dashboard
                      can change it without a redeploy. */}
                  {config
                    ? `Free delivery on orders above ${formatPrice(config.freeShippingThreshold)}. `
                    : ""}
                  Easy 7-day returns with free pickup — the piece must be unworn
                  with tags attached.
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* ── Similar ────────────────────────────────────────────────── */}
      {similar.length > 0 && (
        <section className="py-12">
          <SectionHeading title="You May Also Like" />
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 sm:px-6 md:grid-cols-4 lg:px-10">
            {similar.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                wishlisted={wishlistIds.has(p.id)}
                onToggleWishlist={() => toggleWishlist(p)}
              />
            ))}
          </div>
        </section>
      )}

      <SiteFooter />

      {/* Clears the fixed bar so it never covers the end of the footer. */}
      {!soldOut && <div aria-hidden className="h-24 lg:hidden" />}

      {/* Sticky buy bar — mobile only, pinned to the bottom of the viewport.
          `safe-area-inset-bottom` keeps it clear of the iOS home indicator. */}
      {!soldOut && (
        <div className="border-maroon-100 bg-cream-50/95 fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-stone-500">{product.title}</p>
            <PriceTag price={price} mrp={mrp} />
          </div>
          {/* Once it's in the bag, the next step is checkout — not a dead
              "Added" state. */}
          <button
            type="button"
            onClick={added ? handleBuyNow : handleAddToCart}
            disabled={isAdding}
            className="bg-maroon-800 h-11 shrink-0 rounded-full px-6 text-sm font-semibold text-white transition-colors disabled:opacity-60"
          >
            {added ? "Buy now" : "Add to Bag"}
          </button>
        </div>
      )}

      <SizeGuideDialog
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        category={product.category}
        selectedSize={size}
        onConfirm={(picked) => {
          // Picking in the chart is a size choice — apply it and close.
          if (oosSizes.has(picked)) {
            setSize(null);
            setSizeError(`${picked} is out of stock in this colour.`);
            setGuideOpen(false);
            return;
          }
          setSize(picked);
          setSizeError(null);
          setAdded(false);
          setGuideOpen(false);
        }}
      />
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-stone-400">{label}</dt>
      <dd className="text-stone-700">{value}</dd>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router";
import {
  BadgeCheck,
  ChevronRight,
  Heart,
  PackageX,
  ShoppingBag,
} from "lucide-react";
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
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addToCart } from "@/features/cart/cartSlice";
import {
  selectWishlistIds,
  toggleWishlist,
} from "@/features/wishlist/wishlistSlice";
import { galleryOf } from "@/utils/media";
import type { ProductVariant } from "@/interfaces/catalog";
import { CATALOG, REVIEWS } from "@/utils/mockData";

const ALL_PRODUCTS = CATALOG;

export default function ProductDetail() {
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector(selectWishlistIds);

  const product = useMemo(
    () => ALL_PRODUCTS.find((p) => p.id === productId),
    [productId],
  );

  const [variantId, setVariantId] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  // Landing on a new product from "similar products" must reset the picker
  // and start at the top, not halfway down the previous page.
  useEffect(() => {
    setVariantId(null);
    setSize(null);
    setSizeError(false);
    setAdded(false);
    window.scrollTo({ top: 0 });
  }, [productId]);

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
  const soldOut = sizes.length === 0;
  const wishlisted = wishlistIds.has(product.id);
  const similar = ALL_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    // The single biggest conversion leak on mobile is a silent no-op here.
    if (!size) {
      setSizeError(true);
      document
        .getElementById("size-picker")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    dispatch(addToCart({ product, size, variant }));
    setAdded(true);
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
            <p className="text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
              {product.brand}
            </p>
            <h1 className="mt-1 font-serif text-3xl leading-tight text-stone-900">
              {product.title}
            </h1>

            {product.rating && (
              <a
                href="#reviews"
                className="mt-2 inline-flex items-center gap-2 text-sm text-stone-600"
              >
                <StarRating rating={product.rating} />
                <span className="font-medium">{product.rating}</span>
                <span className="text-stone-400">
                  ({product.reviewCount} reviews)
                </span>
              </a>
            )}

            <PriceTag
              price={price}
              mrp={mrp}
              className="mt-4 [&>span:first-child]:text-2xl"
            />
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
                    setSizeError(false);
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
                  Every size is sold out right now.
                </p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSize(s);
                        setSizeError(false);
                        setAdded(false);
                      }}
                      aria-pressed={size === s}
                      className={cn(
                        "h-11 min-w-11 rounded-full border px-4 text-sm font-medium transition-colors",
                        size === s
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
                {sizeError && "Please select a size to continue."}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={soldOut}
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
                {soldOut ? "Sold Out" : added ? "Added to Bag" : "Add to Bag"}
              </button>

              <button
                type="button"
                onClick={() => dispatch(toggleWishlist(product))}
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

            {added && (
              <Link
                to="/cart"
                className="text-maroon-700 mt-3 inline-block text-sm font-medium underline underline-offset-2"
              >
                Go to bag →
              </Link>
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
                  Free delivery on orders above ₹1,499. Easy 7-day returns with
                  free pickup — the piece must be unworn with tags attached.
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* ── Reviews ────────────────────────────────────────────────── */}
      <section id="reviews" className="bg-cream-100/60 scroll-mt-28 py-12">
        <SectionHeading
          title="Reviews"
          subtitle={
            product.rating
              ? `${product.rating} out of 5 · ${product.reviewCount} reviews`
              : undefined
          }
        />
        <ul className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:px-10">
          {REVIEWS.map((review) => (
            <li key={review.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} />
                <p className="text-sm font-semibold text-stone-800">
                  {review.title}
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {review.body}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400">
                <span className="font-medium text-stone-600">
                  {review.author}
                </span>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 text-green-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified buyer
                  </span>
                )}
                {review.size && <span>Size {review.size}</span>}
                <span>{review.date}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Similar ────────────────────────────────────────────────── */}
      <section className="py-12">
        <SectionHeading title="You May Also Like" />
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 sm:px-6 md:grid-cols-4 lg:px-10">
          {similar.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wishlisted={wishlistIds.has(p.id)}
              onToggleWishlist={() => dispatch(toggleWishlist(p))}
            />
          ))}
        </div>
      </section>

      <SiteFooter />

      {/* Sticky buy bar — mobile only, clears the bottom tab bar. */}
      {!soldOut && (
        <div className="border-maroon-100 bg-cream-50/95 fixed inset-x-0 bottom-[68px] z-40 flex items-center gap-3 border-t px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-stone-500">{product.title}</p>
            <PriceTag price={price} mrp={mrp} />
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              "h-11 shrink-0 rounded-full px-6 text-sm font-semibold text-white transition-colors",
              added ? "bg-green-700" : "bg-maroon-800",
            )}
          >
            {added ? "Added" : "Add to Bag"}
          </button>
        </div>
      )}

      <SizeGuideDialog open={guideOpen} onClose={() => setGuideOpen(false)} />
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

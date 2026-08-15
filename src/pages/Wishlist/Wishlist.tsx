import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { Heart, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/bits/EmptyState";
import { PriceTag } from "@/components/bits/PriceTag";
import { SiteFooter } from "@/components/common/SiteFooter";
import { BackButton } from "@/components/bits/BackButton";
import { useWishlist } from "@/features/wishlist/useWishlist";
import type { Product } from "@/interfaces/catalog";

export default function Wishlist() {
  const { entries, remove } = useWishlist();

  if (!entries.length) {
    return (
      <>
        <Helmet>
          <title>Your Favourites — ClothifyHer</title>
        </Helmet>
        <EmptyState
          icon={Heart}
          title="No favourites yet"
          message="Tap the heart on anything you like and it'll be waiting for you here."
          action={{ label: "Start Browsing", href: "/new-arrivals" }}
        />
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <Helmet>
        {/* Helmet needs a single string child — interpolating inline splits
            this into an array and throws. */}
        <title>{`Your Favourites (${entries.length}) — ClothifyHer`}</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <BackButton fallback="/" className="mb-4" />

        <h1 className="font-serif text-3xl text-stone-900">Your Favourites</h1>
        <p className="mt-1 text-sm text-stone-500">
          {entries.length} saved {entries.length === 1 ? "item" : "items"}
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {entries.map(({ product }) => (
            <WishlistCard
              key={product.id}
              product={product}
              onRemove={() => remove(product.id)}
            />
          ))}
        </ul>
      </div>

      <SiteFooter />
    </>
  );
}

function WishlistCard({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: () => void;
}) {
  /* Adding to the bag needs the priced size×colour unit, and a wishlist row
     only ever stores the product — so "Move to Bag" goes to the PDP, where the
     size picker can resolve a real variant size. */
  const href = `/products/${product.slug ?? product.id}`;
  const soldOut = product.sizes.length === 0;

  return (
    <li className="group">
      <div className="relative overflow-hidden rounded-2xl bg-stone-200">
        <Link to={href}>
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className={cn(
              "aspect-[3/4] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
              soldOut && "opacity-60",
            )}
          />
        </Link>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${product.title} from favourites`}
          className="absolute top-2.5 right-2.5 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-stone-600 shadow-sm backdrop-blur-sm transition-transform duration-200 hover:scale-110 hover:text-stone-900"
        >
          <X className="h-[18px] w-[18px]" />
        </button>

        {soldOut && (
          <span className="absolute inset-x-0 bottom-0 bg-stone-900/75 py-2 text-center text-[11px] font-semibold tracking-wider text-white uppercase">
            Sold out
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
          {product.brand}
        </p>
        <Link
          to={href}
          className="group-hover:text-maroon-800 line-clamp-2 block text-sm text-stone-800 transition-colors"
        >
          {product.title}
        </Link>
        <PriceTag price={product.price} mrp={product.mrp} className="pt-0.5" />

        <Link
          to={href}
          className={cn(
            "mt-2 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition-colors",
            soldOut
              ? "bg-stone-100 text-stone-400"
              : "bg-maroon-800 hover:bg-maroon-900 text-white",
          )}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          {soldOut ? "View item" : "Move to Bag"}
        </Link>
      </div>
    </li>
  );
}

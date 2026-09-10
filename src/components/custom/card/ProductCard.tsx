import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { PriceTag } from "@/components/bits/PriceTag";
import { ProductCardMedia } from "@/components/bits/ProductCardMedia";
import { WishlistButton } from "@/components/bits/WishlistButton";
import { isProductSoldOut } from "@/utils/stock";
import type { Product } from "@/interfaces/catalog";

interface ProductCardProps {
  product: Product;
  wishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export function ProductCard({
  product,
  wishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const soldOut = isProductSoldOut(product);

  return (
    <Link
      to={`/products/${product.slug ?? product.id}`}
      className="group block"
    >
      <div className="relative">
        {/* Dimmed, not hidden — a sold-out card still links to the PDP and can
            be saved, so shoppers can come back when it restocks. */}
        <ProductCardMedia
          product={product}
          className={cn(soldOut && "opacity-60 grayscale-[40%]")}
        />

        {/* "Few left" / "Bestseller" would contradict an out-of-stock label. */}
        {product.badge && !soldOut && (
          <span className="bg-maroon-800/95 absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white uppercase">
            {product.badge}
          </span>
        )}

        {soldOut && (
          <span className="absolute inset-x-3 bottom-3 rounded-full bg-white/90 py-1.5 text-center text-[11px] font-semibold tracking-wider text-stone-800 uppercase shadow-sm backdrop-blur-sm">
            Sold out
          </span>
        )}

        <WishlistButton
          active={wishlisted}
          onToggle={() => onToggleWishlist(product.id)}
          productTitle={product.title}
          className="absolute top-2.5 right-2.5"
        />
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
          {product.brand}
        </p>
        <h3 className="group-hover:text-maroon-800 line-clamp-2 text-sm text-stone-800 transition-colors">
          {product.title}
        </h3>
        <PriceTag
          price={product.price}
          mrp={product.mrp}
          className={cn("pt-0.5", soldOut && "opacity-50")}
        />
      </div>
    </Link>
  );
}

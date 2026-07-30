import { Link } from "react-router";
import { PriceTag } from "@/components/bits/PriceTag";
import { WishlistButton } from "@/components/bits/WishlistButton";
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
  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-stone-200">
        {/* 3:4 keeps the tall, editorial crop fashion product shots need. */}
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="aspect-[3/4] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {product.badge && (
          <span className="bg-maroon-800/95 absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white uppercase">
            {product.badge}
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
        <PriceTag price={product.price} mrp={product.mrp} className="pt-0.5" />
      </div>
    </Link>
  );
}

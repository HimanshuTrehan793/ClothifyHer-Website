import type { Product } from "./catalog";

/**
 * A cart row. Carries a snapshot of the product rather than an id, so the cart
 * renders without a second lookup. When the real API lands the snapshot gets
 * refreshed on load — that's what surfaces "price changed since you added".
 */
export interface CartLine {
  /** Guest: `${productId}:${variantId}:${size}`. Signed in: the server row id. */
  lineId: string;
  productId: string;
  /** Absent for single-colour products. */
  variantId?: string;
  color?: string;
  brand: string;
  title: string;
  image: string;
  price: number;
  mrp?: number;
  size: string;
  quantity: number;

  /* ── Server-cart only ────────────────────────────────────────────────
     Set when the line came from `/api/cart-items`. Guest lines leave these
     undefined, which is what `useCart` branches on. */
  /** Cart row id — the handle for PATCH/DELETE. */
  serverItemId?: string;
  /** The priced size×colour unit this row sells. */
  variantSizeId?: string;
  /** Product slug, so a cart row can link to its PDP. */
  productSlug?: string;
  /** Per-order cap for this size; the stepper clamps to it. */
  maxQuantity?: number;
  /** The colour went out of stock after it was added. */
  outOfStock?: boolean;
}

/** The priced cart as the server returns it, adapted to app-side names. */
export interface ServerCart {
  lines: CartLine[];
  summary: {
    distinctItems: number;
    itemCount: number;
    subtotal: number;
    totalMrp: number;
    totalDiscount: number;
  };
}

/** Wishlist stores the whole product so the card renders identically to a PLP. */
export interface WishlistEntry {
  product: Product;
  addedAt: number;
}

export interface Coupon {
  code: string;
  description: string;
  type: "flat" | "percentage";
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  /** ISO timestamp from the API; absent on locally-constructed coupons. */
  expiresAt?: string;
}

/**
 * Cart money. Every field is derived from the server: the line totals come
 * from `/api/cart-items`, the discount from `/api/coupons/validate` and the
 * delivery fee from `/api/configurations`. Nothing is computed from hardcoded
 * constants, so the numbers here always match what checkout will charge.
 */
export interface CartTotals {
  itemTotal: number;
  itemMrpTotal: number;
  couponDiscount: number;
  deliveryFee: number;
  grandTotal: number;
  /** How much more to spend to unlock free delivery; 0 once unlocked. */
  freeDeliveryGap: number;
}

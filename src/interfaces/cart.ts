import type { Product } from "./catalog";

/**
 * A cart row. Carries a snapshot of the product rather than an id, so the cart
 * renders without a second lookup. When the real API lands the snapshot gets
 * refreshed on load — that's what surfaces "price changed since you added".
 */
export interface CartLine {
  /** `${productId}:${variantId}:${size}` — colour and size each split a row. */
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
}

export interface CartTotals {
  itemTotal: number;
  itemMrpTotal: number;
  couponDiscount: number;
  giftWrapFee: number;
  deliveryFee: number;
  grandTotal: number;
  /** How much more to spend to unlock free delivery; 0 once unlocked. */
  freeDeliveryGap: number;
}

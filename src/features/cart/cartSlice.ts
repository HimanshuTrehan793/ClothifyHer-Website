import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { CartLine, CartTotals, Coupon } from "@/interfaces/cart";
import type { Product, ProductVariant } from "@/interfaces/catalog";
import { COUPONS, DEMO_CART_LINES } from "@/utils/mockData";
import { readJSON, writeJSON } from "@/utils/storage";
import {
  CART_STORAGE_KEY,
  DELIVERY_FEE,
  FREE_DELIVERY_ABOVE,
  GIFT_WRAP_FEE,
  MAX_QTY_PER_LINE,
} from "@/utils/constants";

interface CartState {
  lines: CartLine[];
  coupon: Coupon | null;
  giftWrap: boolean;
}

/* Falls back to DEMO_CART_LINES only on a first visit — see the note beside
   the seed in mockData.ts. `localStorage.clear()` restores the empty state. */
const persisted = readJSON<Partial<CartState> | null>(CART_STORAGE_KEY, null);

const initialState: CartState = {
  lines: persisted?.lines ?? DEMO_CART_LINES,
  coupon: persisted?.coupon ?? null,
  giftWrap: persisted?.giftWrap ?? false,
};

const persist = (state: CartState) => writeJSON(CART_STORAGE_KEY, state);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        size: string;
        quantity?: number;
        variant?: ProductVariant;
      }>,
    ) => {
      const { product, size, quantity = 1, variant } = action.payload;
      const lineId = `${product.id}:${variant?.id ?? "default"}:${size}`;
      const existing = state.lines.find((l) => l.lineId === lineId);

      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + quantity,
          MAX_QTY_PER_LINE,
        );
      } else {
        // Snapshot the variant's own imagery and price when there is one.
        const firstStill = variant?.media.find((m) => m.kind === "image");
        state.lines.push({
          lineId,
          productId: product.id,
          variantId: variant?.id,
          color: variant?.color ?? product.color,
          brand: product.brand,
          title: product.title,
          image: firstStill?.url ?? product.image,
          price: variant?.price ?? product.price,
          mrp: variant?.mrp ?? product.mrp,
          size,
          quantity: Math.min(quantity, MAX_QTY_PER_LINE),
        });
      }
      persist(state);
    },

    setQuantity: (
      state,
      action: PayloadAction<{ lineId: string; quantity: number }>,
    ) => {
      const { lineId, quantity } = action.payload;
      if (quantity <= 0) {
        state.lines = state.lines.filter((l) => l.lineId !== lineId);
      } else {
        const line = state.lines.find((l) => l.lineId === lineId);
        if (line) line.quantity = Math.min(quantity, MAX_QTY_PER_LINE);
      }
      persist(state);
    },

    removeLine: (state, action: PayloadAction<string>) => {
      state.lines = state.lines.filter((l) => l.lineId !== action.payload);
      persist(state);
    },

    applyCoupon: (state, action: PayloadAction<Coupon>) => {
      state.coupon = action.payload;
      persist(state);
    },

    removeCoupon: (state) => {
      state.coupon = null;
      persist(state);
    },

    setGiftWrap: (state, action: PayloadAction<boolean>) => {
      state.giftWrap = action.payload;
      persist(state);
    },

    clearCart: (state) => {
      state.lines = [];
      state.coupon = null;
      state.giftWrap = false;
      persist(state);
    },
  },
});

export const {
  addToCart,
  setQuantity,
  removeLine,
  applyCoupon,
  removeCoupon,
  setGiftWrap,
  clearCart,
} = cartSlice.actions;

/* ── selectors ─────────────────────────────────────────────────────── */

export const selectCartLines = (s: RootState) => s.cart.lines;
export const selectCoupon = (s: RootState) => s.cart.coupon;
export const selectGiftWrap = (s: RootState) => s.cart.giftWrap;

export const selectCartCount = (s: RootState) =>
  s.cart.lines.reduce((n, l) => n + l.quantity, 0);

export const selectCartTotals = (s: RootState): CartTotals => {
  const itemTotal = s.cart.lines.reduce((n, l) => n + l.price * l.quantity, 0);
  const itemMrpTotal = s.cart.lines.reduce(
    (n, l) => n + (l.mrp ?? l.price) * l.quantity,
    0,
  );

  let couponDiscount = 0;
  const coupon = s.cart.coupon;
  if (coupon && itemTotal >= coupon.minOrderValue) {
    couponDiscount =
      coupon.type === "flat"
        ? coupon.value
        : Math.round((itemTotal * coupon.value) / 100);
    if (coupon.maxDiscount) {
      couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
    }
    couponDiscount = Math.min(couponDiscount, itemTotal);
  }

  const afterDiscount = itemTotal - couponDiscount;
  const giftWrapFee = s.cart.giftWrap ? GIFT_WRAP_FEE : 0;
  const deliveryFee =
    itemTotal === 0 || afterDiscount >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;

  return {
    itemTotal,
    itemMrpTotal,
    couponDiscount,
    giftWrapFee,
    deliveryFee,
    grandTotal: afterDiscount + giftWrapFee + deliveryFee,
    freeDeliveryGap: Math.max(0, FREE_DELIVERY_ABOVE - afterDiscount),
  };
};

/** Validation lives here so Cart UI just renders the message it gets back. */
export function validateCoupon(
  code: string,
  itemTotal: number,
): { ok: true; coupon: Coupon } | { ok: false; message: string } {
  const normalised = code.trim().toUpperCase();
  if (!normalised) return { ok: false, message: "Enter a coupon code." };

  const coupon = COUPONS.find((c) => c.code === normalised);
  if (!coupon)
    return { ok: false, message: `"${normalised}" isn't a valid code.` };

  if (itemTotal < coupon.minOrderValue) {
    const short = coupon.minOrderValue - itemTotal;
    return {
      ok: false,
      message: `Add ₹${short.toLocaleString("en-IN")} more to use ${coupon.code}.`,
    };
  }
  return { ok: true, coupon };
}

export default cartSlice.reducer;

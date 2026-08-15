import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Coupon } from "@/interfaces/cart";
import { readJSON, writeJSON } from "@/utils/storage";
import { CART_STORAGE_KEY } from "@/utils/constants";

/**
 * The cart lines themselves live on the server (`/api/cart-items`) — read them
 * through `useCart`, not from here. What's left in this slice is the coupon the
 * shopper has applied, which has no cart-scoped endpoint to persist it: the
 * code is only bound to an order when checkout posts it. Keeping it in
 * localStorage means an accidental refresh doesn't drop it.
 */
interface CartState {
  coupon: Coupon | null;
}

const persisted = readJSON<Partial<CartState> | null>(CART_STORAGE_KEY, null);

const initialState: CartState = {
  coupon: persisted?.coupon ?? null,
};

const persist = (state: CartState) => writeJSON(CART_STORAGE_KEY, state);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    applyCoupon: (state, action: PayloadAction<Coupon>) => {
      state.coupon = action.payload;
      persist(state);
    },

    removeCoupon: (state) => {
      state.coupon = null;
      persist(state);
    },
  },
});

export const { applyCoupon, removeCoupon } = cartSlice.actions;

export const selectCoupon = (s: RootState) => s.cart.coupon;

export default cartSlice.reducer;

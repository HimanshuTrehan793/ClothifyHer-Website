import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { WishlistEntry } from "@/interfaces/cart";
import type { Product } from "@/interfaces/catalog";
import { readJSON, writeJSON } from "@/utils/storage";
import { WISHLIST_STORAGE_KEY } from "@/utils/constants";

interface WishlistState {
  entries: WishlistEntry[];
}

/**
 * Guest-friendly by design: the wishlist lives in localStorage so hearting
 * something never demands a login. On sign-in `AuthSync` merges these entries
 * into the account via `POST /api/wishlist/merge` and clears them, after which
 * the server is the single source of truth — see `useWishlist`.
 */
const initialState: WishlistState = {
  entries: readJSON<WishlistEntry[] | null>(WISHLIST_STORAGE_KEY, null) ?? [],
};

const persist = (state: WishlistState) =>
  writeJSON(WISHLIST_STORAGE_KEY, state.entries);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const index = state.entries.findIndex((e) => e.product.id === product.id);
      if (index === -1) {
        state.entries.unshift({ product, addedAt: Date.now() });
      } else {
        state.entries.splice(index, 1);
      }
      persist(state);
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter(
        (e) => e.product.id !== action.payload,
      );
      persist(state);
    },

    clearWishlist: (state) => {
      state.entries = [];
      persist(state);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export const selectWishlist = (s: RootState) => s.wishlist.entries;
export const selectWishlistCount = (s: RootState) => s.wishlist.entries.length;
export const selectWishlistIds = (s: RootState) =>
  new Set(s.wishlist.entries.map((e) => e.product.id));

export default wishlistSlice.reducer;

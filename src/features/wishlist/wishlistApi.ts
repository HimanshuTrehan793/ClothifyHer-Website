import { baseApi } from "@/api/baseApi";
import type { ApiSuccess } from "@/api/types";
import { toProduct, type ApiProductInput } from "@/features/product/productApi";
import type { WishlistEntry } from "@/interfaces/cart";

interface ApiWishlistItem {
  id: string;
  /* Card fields plus the slim colourway list (colours + size labels, each with
     its out_of_stock flag) — the favourites card needs those to decide the
     "Sold out" ribbon. */
  product: ApiProductInput;
}

/* Mapped through the product adapter rather than hand-built, so `sizes`,
   `variants` and the sold-out flags mean exactly what they do on a PLP card.
   Hand-building this previously left `sizes: []` with no variants, which the
   sold-out check reads as "nothing to buy" — every saved item showed Sold out.
   Rows still omit per-size ids, so "move to bag" routes to the PDP. */
const toEntry = (it: ApiWishlistItem): WishlistEntry => ({
  addedAt: 0,
  product: toProduct(it.product),
});

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWishlist: build.query<WishlistEntry[], void>({
      query: () => ({ url: "/api/wishlist", method: "GET" }),
      transformResponse: (res: ApiSuccess<ApiWishlistItem[]>) =>
        res.data.map(toEntry),
      providesTags: [{ type: "Wishlist", id: "LIST" }],
    }),

    addToWishlist: build.mutation<void, string>({
      query: (product_id) => ({
        url: "/api/wishlist",
        method: "POST",
        data: { product_id },
      }),
      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),

    removeFromWishlist: build.mutation<void, string>({
      query: (productId) => ({
        url: `/api/wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),

    mergeWishlist: build.mutation<void, string[]>({
      query: (product_ids) => ({
        url: "/api/wishlist/merge",
        method: "POST",
        data: { product_ids },
      }),
      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useMergeWishlistMutation,
} = wishlistApi;

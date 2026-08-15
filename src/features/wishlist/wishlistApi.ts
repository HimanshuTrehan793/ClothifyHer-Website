import { baseApi } from "@/api/baseApi";
import type { ApiSuccess } from "@/api/types";
import type { WishlistEntry } from "@/interfaces/cart";

/** Minimal product the wishlist endpoints return (no sizes/variants). */
interface ApiWishlistProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  base_price: number;
  base_mrp: number | null;
}

interface ApiWishlistItem {
  id: string;
  product: ApiWishlistProduct;
}

/* Server rows carry only a thumbnail product — enough for the card, but with
   no sizes, so "move to bag" from a server wishlist routes to the PDP. */
const toEntry = (it: ApiWishlistItem): WishlistEntry => ({
  addedAt: 0,
  product: {
    id: it.product.id,
    slug: it.product.slug,
    brand: "ClothifyHer",
    title: it.product.name,
    category: "",
    sizes: [],
    image: it.product.image,
    price: it.product.base_price,
    mrp: it.product.base_mrp ?? undefined,
  },
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

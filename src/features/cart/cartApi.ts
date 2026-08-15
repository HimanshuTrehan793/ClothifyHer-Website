import { baseApi } from "@/api/baseApi";
import type { ApiSuccess } from "@/api/types";
import type { CartLine, ServerCart } from "@/interfaces/cart";

/* ── Raw shapes (`/api/cart-items`) ─────────────────────────────────────
   A cart row keys on `variant_size_id` — the priced size×colour unit. The
   server prices every line and returns the whole cart from every mutation,
   so the client never recomputes money. */
interface ApiCartItem {
  id: string;
  quantity: number;
  max_order_quantity: number;
  out_of_stock: boolean;
  unit_price: number;
  unit_mrp: number;
  line_price: number;
  line_mrp: number;
  variant_size: { id: string; size: string; sku: string };
  variant: { id: string; color: string };
  product: { id: string; name: string; slug: string; image: string };
}

interface ApiCartSummary {
  distinct_items: number;
  item_count: number;
  subtotal: number;
  total_mrp: number;
  total_discount: number;
}

interface ApiCart {
  items: ApiCartItem[];
  summary: ApiCartSummary;
}

const toLine = (it: ApiCartItem): CartLine => ({
  // Server rows already have a stable id — use it as the line key so quantity
  // and remove calls can address the row directly.
  lineId: it.id,
  serverItemId: it.id,
  variantSizeId: it.variant_size.id,
  productId: it.product.id,
  productSlug: it.product.slug,
  variantId: it.variant.id,
  color: it.variant.color,
  brand: "ClothifyHer",
  title: it.product.name,
  image: it.product.image,
  price: it.unit_price,
  mrp: it.unit_mrp,
  size: it.variant_size.size,
  quantity: it.quantity,
  maxQuantity: it.max_order_quantity,
  outOfStock: it.out_of_stock,
});

const toCart = (c: ApiCart): ServerCart => ({
  lines: c.items.map(toLine),
  summary: {
    distinctItems: c.summary.distinct_items,
    itemCount: c.summary.item_count,
    subtotal: c.summary.subtotal,
    totalMrp: c.summary.total_mrp,
    totalDiscount: c.summary.total_discount,
  },
});

export interface AddToCartArgs {
  variant_size_id: string;
  quantity: number;
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<ServerCart, void>({
      query: () => ({ url: "/api/cart-items", method: "GET" }),
      transformResponse: (res: ApiSuccess<ApiCart>) => toCart(res.data),
      providesTags: [{ type: "Cart", id: "LIST" }],
    }),

    addToCart: build.mutation<ServerCart, AddToCartArgs>({
      query: (body) => ({
        url: "/api/cart-items",
        method: "POST",
        data: body,
      }),
      transformResponse: (res: ApiSuccess<ApiCart>) => toCart(res.data),
      /* Every mutation echoes the full cart, so write it straight into the
         `getCart` cache instead of paying for a refetch. */
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            cartApi.util.upsertQueryData("getCart", undefined, data),
          );
        } catch {
          /* the base query already surfaced the error toast */
        }
      },
    }),

    updateCartItem: build.mutation<
      ServerCart,
      { id: string; quantity: number }
    >({
      query: ({ id, quantity }) => ({
        url: `/api/cart-items/${id}`,
        method: "PATCH",
        data: { quantity },
      }),
      transformResponse: (res: ApiSuccess<ApiCart>) => toCart(res.data),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(cartApi.util.upsertQueryData("getCart", undefined, data));
        } catch {
          /* ignored — surfaced by the base query */
        }
      },
    }),

    removeCartItem: build.mutation<ServerCart, string>({
      query: (id) => ({ url: `/api/cart-items/${id}`, method: "DELETE" }),
      transformResponse: (res: ApiSuccess<ApiCart>) => toCart(res.data),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(cartApi.util.upsertQueryData("getCart", undefined, data));
        } catch {
          /* ignored — surfaced by the base query */
        }
      },
    }),

    clearServerCart: build.mutation<ServerCart, void>({
      query: () => ({ url: "/api/cart-items", method: "DELETE" }),
      transformResponse: (res: ApiSuccess<ApiCart>) => toCart(res.data),
      invalidatesTags: [{ type: "Cart", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearServerCartMutation,
} = cartApi;

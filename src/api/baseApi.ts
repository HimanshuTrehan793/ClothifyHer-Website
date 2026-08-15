import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQueryWithReauth } from "./baseQueryWithReauth";

/**
 * The single RTK Query API for the whole app.
 *
 * Domain slices don't call `createApi` themselves — they attach their endpoints
 * with `baseApi.injectEndpoints(...)` in their own feature file. That way every
 * slice shares one cache, one middleware registration and the one re-auth base
 * query (which refreshes the access token on a 401 and retries).
 *
 * When a new domain needs cache invalidation, add its tag to `tagTypes` here,
 * then have the endpoint declare `providesTags` / `invalidatesTags`.
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQueryWithReauth,
  tagTypes: [
    "Category",
    "SubCategory",
    "Product",
    "Cart",
    "Wishlist",
    "Address",
    "Coupon",
    "Order",
    "Configuration",
    "Banner",
  ],
  endpoints: () => ({}),
});

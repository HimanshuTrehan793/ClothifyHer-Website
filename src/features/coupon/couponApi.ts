import { baseApi } from "@/api/baseApi";
import type { ApiSuccess } from "@/api/types";
import type { Coupon } from "@/interfaces/cart";

/** Public coupon fields — the API never exposes usage counters to the client. */
interface ApiCoupon {
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_discount: number | null;
  min_order_value: number;
  expires_at: string;
}

const toCoupon = (c: ApiCoupon): Coupon => ({
  code: c.code,
  description: c.description ?? "",
  // The app calls a fixed-amount coupon "flat"; the API calls it "fixed".
  type: c.discount_type === "percentage" ? "percentage" : "flat",
  value: c.discount_value,
  minOrderValue: c.min_order_value,
  maxDiscount: c.max_discount ?? undefined,
  expiresAt: c.expires_at,
});

/** `POST /api/coupons/validate` — the server is the authority on the discount. */
export interface CouponValidation {
  valid: boolean;
  discount: number;
  finalTotal: number;
  coupon: Coupon;
}

interface ApiCouponValidation {
  valid: boolean;
  discount: number;
  final_total: number;
  coupon: ApiCoupon;
}

export const couponApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAvailableCoupons: build.query<Coupon[], void>({
      query: () => ({ url: "/api/coupons/available", method: "GET" }),
      transformResponse: (res: ApiSuccess<ApiCoupon[]>) =>
        res.data.map(toCoupon),
      providesTags: [{ type: "Coupon", id: "LIST" }],
    }),

    validateCoupon: build.mutation<
      CouponValidation,
      { code: string; cart_total: number }
    >({
      query: (body) => ({
        url: "/api/coupons/validate",
        method: "POST",
        data: body,
      }),
      transformResponse: (res: ApiSuccess<ApiCouponValidation>) => ({
        valid: res.data.valid,
        discount: res.data.discount,
        finalTotal: res.data.final_total,
        coupon: toCoupon(res.data.coupon),
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAvailableCouponsQuery, useValidateCouponMutation } =
  couponApi;

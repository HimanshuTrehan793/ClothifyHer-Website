import { baseApi } from "@/api/baseApi";
import type { ApiSuccess } from "@/api/types";

/** Optional client hint sent with verify; the server parses the UA if omitted. */
export interface DeviceInfo {
  device_name?: string;
  browser?: string;
  os?: string;
  device_type?: string;
}

interface RequestOtpArgs {
  /** E.164, e.g. "+919876543210". */
  phone_number: string;
}

interface VerifyOtpArgs {
  phone_number: string;
  otp_code: string;
  device_info?: DeviceInfo;
}

/** `data` block returned by `POST /auth/verify`. */
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    requestOtp: build.mutation<{ message: string }, RequestOtpArgs>({
      query: (body) => ({ url: "/auth/otp", method: "POST", data: body }),
      transformResponse: (res: ApiSuccess<unknown>) => ({
        message: res.message,
      }),
    }),

    verifyOtp: build.mutation<AuthTokens, VerifyOtpArgs>({
      query: (body) => ({ url: "/auth/verify", method: "POST", data: body }),
      transformResponse: (res: ApiSuccess<AuthTokens>) => res.data,
      /* A new session means anything user-scoped must be refetched (or dropped
         if a guest cache lingers). These tags no-op until those slices exist. */
      invalidatesTags: ["Cart", "Wishlist", "Address", "Order"],
    }),

    logout: build.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Cart", "Wishlist", "Address", "Order"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useLogoutMutation,
} = authApi;

import { baseApi } from "@/api/baseApi";
import type { ApiSuccess } from "@/api/types";
import type { Configuration } from "@/interfaces/configuration";

/** Raw configuration row as `GET /api/configurations` returns it (rupee money). */
interface ApiConfiguration {
  id: number;
  store_active: boolean;
  shipping_fee: number;
  free_shipping_threshold: number;
  cod_enabled: boolean;
  announcement_enabled: boolean;
  announcement_text: string | null;
  support_email: string | null;
  support_phone: string | null;
}

/** snake_case → camelCase. Money is already in rupees. */
const toConfiguration = (c: ApiConfiguration): Configuration => ({
  storeActive: c.store_active,
  shippingFee: c.shipping_fee,
  freeShippingThreshold: c.free_shipping_threshold,
  codEnabled: c.cod_enabled,
  announcementEnabled: c.announcement_enabled,
  announcementText: c.announcement_text,
  supportEmail: c.support_email,
  supportPhone: c.support_phone,
});

export const configurationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getConfiguration: build.query<Configuration, void>({
      query: () => ({ url: "/api/configurations", method: "GET" }),
      transformResponse: (res: ApiSuccess<ApiConfiguration>) =>
        toConfiguration(res.data),
      providesTags: [{ type: "Configuration", id: "SINGLETON" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetConfigurationQuery } = configurationApi;

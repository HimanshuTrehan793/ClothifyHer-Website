import { baseApi } from "@/api/baseApi";
import type { ApiSuccess } from "@/api/types";
import type { SavedAddress } from "@/interfaces/user";

/** Raw address row as `/api/addresses` returns it. */
interface ApiAddress {
  id: string;
  name: string;
  phone_number: string;
  address_line1: string;
  address_line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  type: "home" | "work" | "other";
  is_default: boolean;
}

const toAddress = (a: ApiAddress): SavedAddress => ({
  id: a.id,
  type: a.type,
  name: a.name,
  phone: a.phone_number,
  line1: a.address_line1,
  line2: a.address_line2 ?? undefined,
  landmark: a.landmark ?? undefined,
  city: a.city,
  state: a.state,
  pincode: a.pincode,
  isDefault: a.is_default,
});

/** App-side address → the create/update body the API validates. */
const toApiBody = (a: Partial<SavedAddress>) => ({
  ...(a.name !== undefined ? { name: a.name } : {}),
  ...(a.phone !== undefined ? { phone_number: a.phone } : {}),
  ...(a.line1 !== undefined ? { address_line1: a.line1 } : {}),
  ...(a.line2 !== undefined ? { address_line2: a.line2 || null } : {}),
  ...(a.landmark !== undefined ? { landmark: a.landmark || null } : {}),
  ...(a.city !== undefined ? { city: a.city } : {}),
  ...(a.state !== undefined ? { state: a.state } : {}),
  ...(a.pincode !== undefined ? { pincode: a.pincode } : {}),
  ...(a.type !== undefined ? { type: a.type } : {}),
  ...(a.isDefault !== undefined ? { is_default: a.isDefault } : {}),
});

export const addressApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAddresses: build.query<SavedAddress[], void>({
      query: () => ({ url: "/api/addresses", method: "GET" }),
      transformResponse: (res: ApiSuccess<ApiAddress[]>) =>
        res.data.map(toAddress),
      providesTags: [{ type: "Address", id: "LIST" }],
    }),

    createAddress: build.mutation<SavedAddress, Partial<SavedAddress>>({
      query: (body) => ({
        url: "/api/addresses",
        method: "POST",
        data: toApiBody(body),
      }),
      transformResponse: (res: ApiSuccess<ApiAddress>) => toAddress(res.data),
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),

    updateAddress: build.mutation<
      SavedAddress,
      { id: string; changes: Partial<SavedAddress> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/addresses/${id}`,
        method: "PATCH",
        data: toApiBody(changes),
      }),
      transformResponse: (res: ApiSuccess<ApiAddress>) => toAddress(res.data),
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),

    deleteAddress: build.mutation<void, string>({
      query: (id) => ({ url: `/api/addresses/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),

    setDefaultAddress: build.mutation<SavedAddress, string>({
      query: (id) => ({ url: `/api/addresses/${id}/default`, method: "POST" }),
      transformResponse: (res: ApiSuccess<ApiAddress>) => toAddress(res.data),
      invalidatesTags: [{ type: "Address", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressApi;

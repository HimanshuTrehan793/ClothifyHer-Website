import { baseApi } from "@/api/baseApi";
import type { ApiSuccess } from "@/api/types";

/* Google is proxied by our own backend (`/api/maps/*`) so the billable key
   never ships to the browser. Shapes mirror Google's, minus the noise. */

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface PlaceDetails {
  formatted_address: string;
  address_components: AddressComponent[];
  geometry: { location: { lat: number; lng: number } };
  place_id: string;
}

export interface PlaceSuggestion {
  name: string;
  formatted_address: string;
  geometry: { location: { lat: number; lng: number } };
  place_id: string;
}

/** Pulls the postal fields the address form needs out of Google's components. */
export function extractAddressFields(place: PlaceDetails | null) {
  const get = (type: string) =>
    place?.address_components.find((c) => c.types.includes(type))?.long_name ??
    "";
  return {
    city: get("locality") || get("administrative_area_level_3"),
    state: get("administrative_area_level_1"),
    pincode: get("postal_code"),
    /* Street-level context for line 2 — the customer still types their own
       flat/house number, which no geocoder can know. */
    area: [get("sublocality_level_1") || get("sublocality"), get("route")]
      .filter(Boolean)
      .join(", "),
  };
}

export const mapsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    searchPlaces: build.query<PlaceSuggestion[], string>({
      query: (q) => ({ url: "/api/maps/search", method: "GET", params: { q } }),
      transformResponse: (res: ApiSuccess<PlaceSuggestion[]>) => res.data ?? [],
    }),

    resolveLocation: build.query<
      PlaceDetails | null,
      { lat: number; lng: number }
    >({
      query: ({ lat, lng }) => ({
        url: "/api/maps/location",
        method: "GET",
        params: { lat, lng },
      }),
      transformResponse: (res: ApiSuccess<PlaceDetails | null>) =>
        res.data ?? null,
    }),
  }),
  overrideExisting: false,
});

export const { useSearchPlacesQuery, useResolveLocationQuery } = mapsApi;

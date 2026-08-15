import { baseApi } from "@/api/baseApi";
import type { ApiSuccess } from "@/api/types";
import type { Category } from "@/interfaces/catalog";

/** Raw category / sub-category rows as the API returns them. */
interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  position: number;
  is_active: boolean;
}

const toCategory = (c: ApiCategory): Category => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  image: c.image,
  position: c.position,
  isActive: c.is_active,
});

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<Category[], void>({
      query: () => ({ url: "/api/categories", method: "GET" }),
      transformResponse: (res: ApiSuccess<ApiCategory[]>) =>
        res.data.map(toCategory),
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: "Category" as const, id: c.id })),
              { type: "Category" as const, id: "LIST" },
            ]
          : [{ type: "Category" as const, id: "LIST" }],
    }),

    getCategoryBySlug: build.query<Category, string>({
      query: (slug) => ({ url: `/api/categories/${slug}`, method: "GET" }),
      transformResponse: (res: ApiSuccess<ApiCategory>) => toCategory(res.data),
      providesTags: (result) =>
        result ? [{ type: "Category", id: result.id }] : [],
    }),

    getSubCategories: build.query<Category[], string | void>({
      query: (categorySlug) => ({
        url: "/api/sub-categories",
        method: "GET",
        params: categorySlug ? { category: categorySlug } : undefined,
      }),
      transformResponse: (res: ApiSuccess<ApiCategory[]>) =>
        res.data.map(toCategory),
      providesTags: [{ type: "SubCategory", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
  useGetSubCategoriesQuery,
} = categoryApi;

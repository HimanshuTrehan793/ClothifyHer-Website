import { baseApi } from "@/api/baseApi";
import type { ApiSuccess, PaginationMeta } from "@/api/types";
import type {
  Product,
  ProductMedia,
  ProductVariant,
} from "@/interfaces/catalog";
import { SIZE_SCALE } from "@/utils/constants";

/* ── Raw API shapes (GET /api/products[/:slug]) ─────────────────────────
   Money is rupees; a variant is a colourway carrying its own media + priced
   VariantSize rows. These stay behind the adapter below. */
interface ApiMedia {
  type: "image" | "video";
  url: string;
  poster_url?: string | null;
  position: number;
}

interface ApiVariantSize {
  id: string;
  size: string;
  sku: string;
  price: number;
  mrp: number | null;
  max_order_quantity: number;
  out_of_stock?: boolean;
  position: number;
}

interface ApiVariant {
  id: string;
  color: string;
  out_of_stock: boolean;
  position: number;
  media: ApiMedia[];
  sizes: ApiVariantSize[];
}

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  fabric: string | null;
  type: "upper" | "lower";
  image: string;
  base_price: number;
  base_mrp: number | null;
  occasion: string[];
  collection: string[];
  category?: { id: string; name: string; slug: string } | null;
  sub_category?: { id: string; name: string; slug: string } | null;
  variants: ApiVariant[];
}

/** Money arrives in rupees; this only coerces null/undefined away. */
const money = (n: number | null | undefined): number | undefined =>
  n == null ? undefined : n;

const toMedia = (m: ApiMedia): ProductMedia =>
  m.type === "video"
    ? { kind: "video", url: m.url, poster: m.poster_url ?? "" }
    : { kind: "image", url: m.url };

/** Sizes a colour offers, ordered by the canonical ladder rather than raw rows.
    The slim PLP list omits some fields, so tolerate a missing `sizes` array. */
const orderedSizes = (rows: ApiVariantSize[] = []): string[] => {
  const present = new Set(rows.map((s) => s.size));
  return SIZE_SCALE.filter((s) => present.has(s));
};

const toVariant = (v: ApiVariant, fallbackImage: string): ProductVariant => {
  // The list endpoint returns colours without media/pricing; the PDP returns
  // the lot. Default both so either shape maps cleanly.
  const media = v.media ?? [];
  const sizeRows = v.sizes ?? [];
  const firstImage = media.find((m) => m.type === "image");
  const cheapest = [...sizeRows].sort((a, b) => a.price - b.price)[0];
  /* Sizes switched off one by one. A colour with *every* size off can't sell
     anything, so it's treated exactly like a colour flagged out of stock. */
  const oosSizes = orderedSizes(sizeRows.filter((s) => s.out_of_stock));
  const allSizesOut =
    sizeRows.length > 0 && sizeRows.every((s) => s.out_of_stock);
  return {
    id: v.id,
    color: v.color,
    thumb: firstImage?.url ?? fallbackImage,
    // A colour always needs at least one gallery item — fall back to the
    // product's primary still so the gallery never renders empty.
    media: media.length
      ? media.map(toMedia)
      : [{ kind: "image", url: fallbackImage }],
    price: money(cheapest?.price),
    mrp: money(cheapest?.mrp),
    sizes: orderedSizes(sizeRows),
    /* Keep the priced rows, not just the labels — the cart adds a line by
       `variant_size_id`, so a size label alone can't be added to the bag. The
       slim PLP list ships size labels without ids; omit the rows entirely there
       rather than handing the cart unusable units. */
    sizeRows: sizeRows.some((s) => s.id)
      ? sizeRows.map((s) => ({
          id: s.id,
          size: s.size,
          sku: s.sku,
          price: s.price,
          mrp: money(s.mrp),
          maxOrderQuantity: s.max_order_quantity,
          outOfStock: s.out_of_stock ?? false,
        }))
      : undefined,
    outOfStock: v.out_of_stock || allSizesOut,
    outOfStockSizes: oosSizes,
  };
};

/**
 * API product → the app's `Product`. Flattens the colourway model to the flat
 * fields the cards/PDP already read: `price`/`mrp` come from `base_*`, `sizes`
 * is the union across colours, `variants` keeps each colourway for the PDP.
 */
export const toProduct = (p: ApiProduct): Product => {
  const variants = (p.variants ?? []).map((v) => toVariant(v, p.image));
  const sizeUnion = new Set(variants.flatMap((v) => v.sizes ?? []));
  return {
    id: p.id,
    slug: p.slug,
    brand: "ClothifyHer",
    title: p.name,
    category: p.category?.slug ?? "",
    subCategory: p.sub_category?.slug,
    sizes: SIZE_SCALE.filter((s) => sizeUnion.has(s)),
    image: p.image,
    media: variants[0]?.media?.length
      ? variants[0].media
      : [{ kind: "image", url: p.image }],
    variants: variants.length ? variants : undefined,
    price: money(p.base_price) ?? 0,
    mrp: money(p.base_mrp),
    description: p.description ?? undefined,
    fabric: p.fabric ?? undefined,
    color: variants[0]?.color,
  };
};

/** Query params accepted by the PLP list endpoint. */
export interface ProductQuery {
  category?: string;
  sub_category?: string;
  size?: string;
  color?: string;
  occasion?: string;
  collection?: string;
  min_price?: number;
  max_price?: number;
  sort?: "new" | "price_asc" | "price_desc";
  q?: string;
  page?: number;
  limit?: number;
}

export interface ProductList {
  items: Product[];
  meta?: PaginationMeta;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<ProductList, ProductQuery | void>({
      query: (params) => ({
        url: "/api/products",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: ApiSuccess<ApiProduct[]>) => ({
        items: res.data.map(toProduct),
        meta: res.meta,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({
                type: "Product" as const,
                id: p.id,
              })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),

    getProductBySlug: build.query<Product, string>({
      query: (slug) => ({ url: `/api/products/${slug}`, method: "GET" }),
      transformResponse: (res: ApiSuccess<ApiProduct>) => toProduct(res.data),
      providesTags: (result) =>
        result ? [{ type: "Product", id: result.id }] : [],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery, useGetProductBySlugQuery } = productApi;

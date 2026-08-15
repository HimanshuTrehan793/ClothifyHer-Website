import { baseApi } from "@/api/baseApi";
import type { ApiSuccess, PaginationMeta } from "@/api/types";
import type {
  Order,
  OrderAddress,
  OrderItem,
  OrderStatus,
  PaymentMethod,
} from "@/interfaces/order";

/* ── Raw shapes (`/api/orders`) ─────────────────────────────────────────
   Orders snapshot their items and address at placement, so nothing here is
   resolved against the live catalog. Money is rupees. */
interface ApiOrderItem {
  id: string;
  product_id: string | null;
  product_name: string;
  product_slug: string | null;
  image: string;
  color: string;
  size: string;
  sku: string;
  unit_price: number;
  unit_mrp: number;
  quantity: number;
  line_total: number;
}

interface ApiOrderAddress {
  name: string;
  phone_number: string;
  address_line1: string;
  address_line2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
}

interface ApiOrderHistory {
  status: OrderStatus;
  note: string | null;
  createdAt: string;
}

interface ApiPaymentDetail {
  provider: PaymentMethod;
  status: string;
  amount: number;
  method: string | null;
  razorpay_order_id: string | null;
}

interface ApiOrder {
  id: string;
  order_number: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  coupon_code: string | null;
  expected_delivery_date: string | null;
  delivered_at: string | null;
  createdAt: string;
  items?: ApiOrderItem[];
  order_address?: ApiOrderAddress;
  histories?: ApiOrderHistory[];
  payment?: ApiPaymentDetail;
}

const toItem = (i: ApiOrderItem): OrderItem => ({
  id: i.id,
  productId: i.product_id,
  productSlug: i.product_slug,
  brand: "ClothifyHer",
  title: i.product_name,
  image: i.image,
  color: i.color,
  size: i.size,
  sku: i.sku,
  quantity: i.quantity,
  price: i.unit_price,
  mrp: i.unit_mrp,
  lineTotal: i.line_total,
});

const toAddress = (a: ApiOrderAddress): OrderAddress => ({
  name: a.name,
  line1: a.address_line1,
  line2: a.address_line2 ?? undefined,
  landmark: a.landmark ?? undefined,
  city: a.city,
  state: a.state,
  pincode: a.pincode,
  phone: a.phone_number,
});

export const toOrder = (o: ApiOrder): Order => {
  const items = (o.items ?? []).map(toItem);
  return {
    id: o.id,
    orderNumber: o.order_number,
    placedAt: o.createdAt,
    status: o.status,
    items,
    address: o.order_address ? toAddress(o.order_address) : undefined,
    paymentMethod: o.payment_method,
    payment: o.payment
      ? {
          provider: o.payment.provider,
          status: o.payment.status,
          amount: o.payment.amount,
          method: o.payment.method,
          razorpayOrderId: o.payment.razorpay_order_id,
        }
      : undefined,
    itemTotal: o.subtotal,
    // The API stores no MRP total; sum the snapshots so "you saved" still works.
    itemMrpTotal: items.reduce((n, i) => n + (i.mrp ?? i.price) * i.quantity, 0),
    couponDiscount: o.discount,
    couponCode: o.coupon_code ?? undefined,
    deliveryFee: o.shipping_fee,
    total: o.total,
    events: (o.histories ?? []).map((h) => ({
      status: h.status,
      note: h.note ?? undefined,
      at: h.createdAt,
    })),
    expectedDelivery: o.expected_delivery_date ?? undefined,
    deliveredAt: o.delivered_at ?? undefined,
  };
};

export interface OrderList {
  items: Order[];
  meta?: PaginationMeta;
}

export interface PlaceOrderArgs {
  address_id: string;
  payment_method: PaymentMethod;
  coupon_code?: string;
}

/** `POST /api/orders` returns the order, plus a gateway block for Razorpay. */
export interface PlaceOrderResult {
  order: Order;
  razorpay?: {
    key_id: string;
    razorpay_order_id: string;
    amount: number | string;
    currency: string;
  };
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<
      OrderList,
      { page?: number; limit?: number; status?: OrderStatus } | void
    >({
      query: (params) => ({
        url: "/api/orders",
        method: "GET",
        params: params ?? undefined,
      }),
      transformResponse: (res: ApiSuccess<ApiOrder[]>) => ({
        items: res.data.map(toOrder),
        meta: res.meta,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((o) => ({
                type: "Order" as const,
                id: o.id,
              })),
              { type: "Order" as const, id: "LIST" },
            ]
          : [{ type: "Order" as const, id: "LIST" }],
    }),

    getOrderById: build.query<Order, string>({
      query: (id) => ({ url: `/api/orders/${id}`, method: "GET" }),
      transformResponse: (res: ApiSuccess<ApiOrder>) => toOrder(res.data),
      providesTags: (result) =>
        result ? [{ type: "Order", id: result.id }] : [],
    }),

    placeOrder: build.mutation<PlaceOrderResult, PlaceOrderArgs>({
      query: (body) => ({ url: "/api/orders", method: "POST", data: body }),
      transformResponse: (
        res: ApiSuccess<{ order: ApiOrder; razorpay?: PlaceOrderResult["razorpay"] }>,
      ) => ({
        order: toOrder(res.data.order),
        razorpay: res.data.razorpay,
      }),
      /* COD clears the cart server-side; online clears it on payment. Drop both
         caches either way so the bag badge can't show a stale count. */
      invalidatesTags: [
        { type: "Order", id: "LIST" },
        { type: "Cart", id: "LIST" },
      ],
    }),

    cancelOrder: build.mutation<Order, string>({
      query: (id) => ({ url: `/api/orders/${id}/cancel`, method: "POST" }),
      transformResponse: (res: ApiSuccess<ApiOrder>) => toOrder(res.data),
      invalidatesTags: (result, _err, id) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        ...(result ? [] : []),
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  usePlaceOrderMutation,
  useCancelOrderMutation,
} = orderApi;

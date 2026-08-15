/**
 * Fulfilment states, mirroring `ORDER_STATUSES` in the backend exactly. The
 * wire format is snake_case, so the app uses the same spellings rather than
 * translating at every boundary.
 */
export type OrderStatus =
  | "pending"
  | "accepted"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "rejected"
  | "returned"
  | "refunded";

/** Statuses the customer may cancel from — matches `USER_CANCELLABLE`. */
export const USER_CANCELLABLE: OrderStatus[] = [
  "pending",
  "accepted",
  "processing",
];

/**
 * The happy path, in order. The terminal states (cancelled / rejected /
 * returned / refunded) sit outside it and short-circuit the timeline.
 */
export const FULFILMENT_STEPS: {
  status: OrderStatus;
  label: string;
  hint: string;
}[] = [
  {
    status: "accepted",
    label: "Order Confirmed",
    hint: "We've received your order",
  },
  {
    status: "processing",
    label: "Processing",
    hint: "We're preparing your order",
  },
  { status: "packed", label: "Packed", hint: "Your order is ready to ship" },
  {
    status: "shipped",
    label: "Shipped",
    hint: "Handed to our delivery partner",
  },
  {
    status: "out_for_delivery",
    label: "Out for Delivery",
    hint: "Arriving today",
  },
  { status: "delivered", label: "Delivered", hint: "Left at your doorstep" },
];

/** The backend settles payment through Razorpay or collects cash on delivery. */
export type PaymentMethod = "razorpay" | "cod";

export interface OrderItem {
  id: string;
  productId: string | null;
  /** Snapshot slug — null once the product is deleted, so guard before linking. */
  productSlug: string | null;
  brand: string;
  title: string;
  image: string;
  color: string;
  size: string;
  sku: string;
  quantity: number;
  price: number;
  mrp?: number;
  lineTotal: number;
}

export interface OrderAddress {
  name: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface OrderEvent {
  status: OrderStatus;
  note?: string;
  /** ISO timestamp of the history row. */
  at?: string;
}

/** Payment row attached to the order. */
export interface OrderPayment {
  provider: PaymentMethod;
  status: string;
  amount: number;
  /** Instrument Razorpay reported (upi/card/…), when known. */
  method?: string | null;
  razorpayOrderId?: string | null;
}

export interface Order {
  id: string;
  /** Human-facing sequential number — what the customer quotes to support. */
  orderNumber: number;
  placedAt: string;
  status: OrderStatus;
  items: OrderItem[];
  /** Only present on the detail endpoint; the list omits it. */
  address?: OrderAddress;
  paymentMethod: PaymentMethod;
  payment?: OrderPayment;
  itemTotal: number;
  itemMrpTotal: number;
  couponDiscount: number;
  couponCode?: string;
  deliveryFee: number;
  total: number;
  /** History rows, oldest first. Empty on the list endpoint. */
  events: OrderEvent[];
  expectedDelivery?: string;
  deliveredAt?: string;
}

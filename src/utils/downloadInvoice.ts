import axiosInstance from "@/api/axiosConfig";
import { ACCESS_TOKEN_KEY } from "@/utils/constants";

/**
 * Downloads an order's invoice PDF.
 *
 * Not an RTK query: the endpoint answers with a file rather than the JSON
 * envelope, and a plain `<a href>` can't carry the bearer token. Fetch it as a
 * blob, then hand it to the browser through a temporary object URL.
 */
export async function downloadInvoice(
  orderId: string,
  orderNumber: number,
): Promise<void> {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const res = await axiosInstance.get(`/api/orders/${orderId}/invoice`, {
    responseType: "blob",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  const url = URL.createObjectURL(res.data as Blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `clothifyher-invoice-${orderNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoking immediately can cancel the save in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

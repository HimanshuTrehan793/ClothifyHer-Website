const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let loader: Promise<boolean> | null = null;

/**
 * Loads Razorpay Checkout on demand — it's only needed by the one person who
 * reaches the pay step, so it stays out of index.html and off every other page.
 * The promise is cached, so a second checkout attempt reuses the loaded script.
 */
export function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  if (loader) return loader;

  loader = new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      // Let a later attempt retry rather than caching the failure forever.
      loader = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return loader;
}

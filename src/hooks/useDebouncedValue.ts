import { useEffect, useState } from "react";

/**
 * Trails `value` by `delay` ms. Keeps the results list from thrashing on every
 * keystroke, and stands in for the request debounce the real API will need.
 */
export function useDebouncedValue<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

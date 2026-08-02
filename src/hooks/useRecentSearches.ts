import { useCallback, useState } from "react";
import { RECENT_SEARCHES_KEY } from "@/utils/constants";
import { readJSON, writeJSON } from "@/utils/storage";

const MAX_RECENT = 6;

/** Recent searches, newest first, de-duplicated case-insensitively. */
export function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>(() =>
    readJSON<string[]>(RECENT_SEARCHES_KEY, []),
  );

  const remember = useCallback((term: string) => {
    const value = term.trim();
    if (!value) return;

    setRecent((prev) => {
      const next = [
        value,
        ...prev.filter((t) => t.toLowerCase() !== value.toLowerCase()),
      ].slice(0, MAX_RECENT);
      writeJSON(RECENT_SEARCHES_KEY, next);
      return next;
    });
  }, []);

  const remove = useCallback((term: string) => {
    setRecent((prev) => {
      const next = prev.filter((t) => t !== term);
      writeJSON(RECENT_SEARCHES_KEY, next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    writeJSON(RECENT_SEARCHES_KEY, []);
    setRecent([]);
  }, []);

  return { recent, remember, remove, clear };
}

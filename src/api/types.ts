/**
 * Shared response envelopes, straight from API_CONTRACT.md. Every endpoint wraps
 * its payload in `ApiSuccess`; paginated lists add `meta`. These stay at the API
 * boundary — `transformResponse` unwraps `data` so components never see them.
 */

/** Pagination block on list endpoints. Some lists omit next/prev. */
export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  nextPage?: number | null;
  prevPage?: number | null;
  pageSize: number;
}

/** The success envelope: `{ success, message, data, meta? }`. */
export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

/** A payload plus its pagination meta, for list endpoints that keep both. */
export interface Paginated<T> {
  items: T[];
  meta?: PaginationMeta;
}

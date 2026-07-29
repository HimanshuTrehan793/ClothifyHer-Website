const UUID_RE =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

/** `silk-saree-<uuid>` — human readable prefix, id kept for lookup. */
export const buildSlug = (name: string | undefined, id: string): string => {
  const base = name ? slugify(name) : "";
  return base ? `${base}-${id}` : id;
};

/** Pulls the trailing uuid back out of a slug produced by `buildSlug`. */
export const parseIdFromSlug = (slug: string): string | null => {
  const match = slug.match(UUID_RE);
  return match ? match[0] : null;
};

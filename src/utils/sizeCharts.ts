/**
 * Garment measurement charts. Values are the brand's published inch figures;
 * centimetres are derived so the two can never drift apart.
 */

export type ChartKind = "top" | "bottom";

export interface SizeRow {
  size: string;
  /** Keyed by column id — see COLUMNS below. */
  values: Record<string, number>;
}

export interface SizeChart {
  kind: ChartKind;
  /** Fills "{noun} Size Chart" and "Confirm {noun} Size". */
  noun: string;
  columns: { id: string; label: string }[];
  rows: SizeRow[];
}

const TOP_COLUMNS = [
  { id: "shoulder", label: "Shoulder" },
  { id: "bust", label: "Bust" },
  { id: "waist", label: "Waist" },
  { id: "hips", label: "Hips" },
];

const BOTTOM_COLUMNS = [
  { id: "waist", label: "Waist" },
  { id: "hips", label: "Hips" },
  { id: "length", label: "Length" },
];

/** Builds rows from positional numbers so the tables stay readable. */
const rowsFrom = (
  columns: { id: string }[],
  data: [string, ...number[]][],
): SizeRow[] =>
  data.map(([size, ...nums]) => ({
    size,
    values: Object.fromEntries(columns.map((c, i) => [c.id, nums[i]])),
  }));

const TOP_ROWS = rowsFrom(TOP_COLUMNS, [
  ["XS", 13.5, 34, 30, 38],
  ["S", 14, 36, 32, 40],
  ["M", 14.5, 38, 34, 42],
  ["L", 15, 40, 37, 44],
  ["XL", 15.5, 42, 40, 46],
  ["2XL", 16, 44, 42, 48],
  ["3XL", 16.5, 47, 45, 51],
  ["4XL", 17, 49, 47, 53],
  ["5XL", 17.5, 51, 49, 55],
  ["6XL", 18, 53, 51, 57],
  ["7XL", 18.5, 55, 53, 59],
  ["8XL", 19, 57, 55, 61],
  ["9XL", 19.5, 59, 57, 63],
  ["10XL", 20, 61, 59, 65],
]);

const BOTTOM_ROWS = rowsFrom(BOTTOM_COLUMNS, [
  ["XS", 26, 38, 39],
  ["S", 28, 40, 39],
  ["M", 30, 42, 39],
  ["L", 32, 44, 39],
  ["XL", 34, 46, 39],
  ["2XL", 36, 48, 39],
  ["3XL", 38, 50, 39],
  ["4XL", 40, 52, 39],
  ["5XL", 42, 54, 39],
  ["6XL", 44, 56, 39],
  ["7XL", 46, 58, 39],
  ["8XL", 48, 60, 39],
  ["9XL", 50, 62, 39],
  ["10XL", 52, 64, 39],
]);

/** Per-category noun so the sheet reads "Kurta Size Chart", "Dress Size Chart"… */
const NOUN: Record<string, string> = {
  kurtas: "Kurta",
  dresses: "Dress",
  "co-ord-sets": "Co-ord",
  tops: "Top",
  "bottom-wear": "Bottom",
};

export function chartFor(category: string): SizeChart {
  const isBottom = category === "bottom-wear";
  return {
    kind: isBottom ? "bottom" : "top",
    noun: NOUN[category] ?? "Size",
    columns: isBottom ? BOTTOM_COLUMNS : TOP_COLUMNS,
    rows: isBottom ? BOTTOM_ROWS : TOP_ROWS,
  };
}

export type Unit = "in" | "cm";

/** Inches are the source of truth; cm is derived and rounded to whole units. */
export const toUnit = (inches: number, unit: Unit) =>
  unit === "in" ? inches : Math.round(inches * 2.54);

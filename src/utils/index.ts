/**
 * @module utils
 * Barrel export cho toàn bộ utility helpers.
 *
 * @example
 * import { formatCurrency, formatDate, truncate, capitalize, cn } from "@/utils";
 */

// Format — Number & date formatting với Intl API (vi-VN locale)
export { formatCurrency, formatDate } from "./format";

// String — String manipulation helpers
export { truncate, capitalize } from "./string";

// cn — Merge Tailwind/clsx class names
export { cn } from "./cn";

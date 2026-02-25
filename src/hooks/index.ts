/**
 * @module hooks
 * Barrel export cho toàn bộ custom React hooks.
 *
 * @example
 * import { useMounted } from "@/hooks";
 */

// useMounted — Trả về true khi component đã mount phía client (tránh hydration mismatch)
export { useMounted } from "./useMounted";

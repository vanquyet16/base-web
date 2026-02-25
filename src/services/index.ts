/**
 * @module services
 * Barrel export cho toàn bộ services layer.
 *
 * Import từ đây để tránh phải import đường dẫn sâu:
 * @example
 * import { coreRoutes, authRoutes, billingRoutes, buildPath } from "@/services";
 */

// Route builders — URL path helpers cho từng service domain
export { buildPath, withQuery } from "./routes";
export type { RouteParams, QueryParams, QueryValue } from "./routes";

// Auth service routes
export { authRoutes } from "./auth/auth.routes";

// Billing service routes
export { billingRoutes } from "./billing/billing.routes";

// Core service routes
export { coreRoutes } from "./core/core.routes";

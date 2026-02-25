/**
 * @module lib
 * Barrel export cho toàn bộ lib layer (infrastructure utilities).
 *
 * Import từ đây để tránh phải import đường dẫn sâu:
 * @example
 * import { http, logger, validateAndSanitize } from "@/lib";
 */

// HTTP client — Axios instance với interceptors & auto-retry
export { http, getHttpClient, createHttpClient, setRefreshTokenHandler } from "./http";

// Logger — Structured logger với log-level filtering
export { logger } from "./logger";
export type { LogContext } from "./logger";

// Auth token helpers — localStorage access/refresh token management
export { getAccessToken, setAccessToken, clearAccessToken } from "./auth/token";

// Validation — Zod wrapper để validate & sanitize trước khi gọi API
export { validateAndSanitize } from "./validation";

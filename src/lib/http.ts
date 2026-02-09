import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { getServiceConfig, type ServiceName } from "@/config/services";
import { getAccessToken, setAccessToken } from "@/lib/auth/token";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import type { ApiError } from "@/types/api";

const DEFAULT_SERVICE: ServiceName = "core";
const clientCache = new Map<ServiceName, AxiosInstance>();

type RetryConfig = InternalAxiosRequestConfig & {
  __retryCount?: number;
  __isRetryRequest?: boolean;
};

type RefreshTokenHandler = (error: AxiosError) => Promise<string | null>;
let refreshTokenHandler: RefreshTokenHandler | null = null;

/**
 * Register a refresh token handler for 401 auto-retry.
 * Return a new access token or null to skip retry.
 */
export function setRefreshTokenHandler(handler: RefreshTokenHandler) {
  refreshTokenHandler = handler;
}

function attachInterceptors(client: AxiosInstance, service: ServiceName) {
  const serviceConfig = getServiceConfig(service);

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const auth = serviceConfig.auth ?? "bearer";
    if (auth === "none") return config;

    const token = getAccessToken(serviceConfig.tokenKey);
    if (token) {
      config.headers = setAuthorizationHeader(config.headers, token);
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as RetryConfig | undefined;
      const status = error.response?.status;

      logger.error("API Error", {
        url: config?.url,
        method: config?.method,
        status,
        message: error.message,
      });

      if (status === 401 && refreshTokenHandler && config && !config.__isRetryRequest) {
        config.__isRetryRequest = true;
        const token = await refreshTokenHandler(error);
        if (token) {
          setAccessToken(token, serviceConfig.tokenKey);
          config.headers = setAuthorizationHeader(config.headers, token);
          return client.request(config);
        }
      }

      if (config && shouldRetry(error, config)) {
        config.__retryCount = (config.__retryCount ?? 0) + 1;
        await delay(getRetryDelay(config.__retryCount));
        return client.request(config);
      }

      return Promise.reject(toApiError(error));
    },
  );
}

function setAuthorizationHeader(
  headers: InternalAxiosRequestConfig["headers"],
  token: string,
) {
  const nextHeaders = AxiosHeaders.from(headers ?? {});
  nextHeaders.set("Authorization", `Bearer ${token}`);
  return nextHeaders;
}

function shouldRetry(error: AxiosError, config: RetryConfig) {
  const currentRetry = config.__retryCount ?? 0;
  if (currentRetry >= 2) return false;

  const status = error.response?.status;
  if (!status) return true;
  if (status === 429) return true;
  if (status >= 500 && status <= 599) return true;

  return false;
}

function getRetryDelay(retryCount: number) {
  const base = 500;
  const jitter = Math.floor(Math.random() * 200);
  return Math.min(8000, base * 2 ** (retryCount - 1) + jitter);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toApiError(error: AxiosError): ApiError {
  const data = error.response?.data;
  const message =
    (typeof data === "object" && data && "message" in data
      ? (data as { message?: string }).message
      : undefined) || error.message;

  const code =
    typeof data === "object" && data && "code" in data
      ? (data as { code?: string }).code
      : undefined;

  return {
    message,
    code,
    status: error.response?.status,
    details: typeof data === "object" && data ? (data as Record<string, unknown>) : undefined,
  };
}

/**
 * Create a new Axios client for a service base URL.
 */
export function createHttpClient(baseURL: string, service: ServiceName) {
  const serviceConfig = getServiceConfig(service);
  const client = axios.create({
    baseURL,
    timeout: serviceConfig.timeout ?? env.NEXT_PUBLIC_API_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
  });

  attachInterceptors(client, service);
  return client;
}

/**
 * Get a cached Axios client for a service.
 * Throws if service baseURL is missing.
 */
export function getHttpClient(service: ServiceName = DEFAULT_SERVICE) {
  if (clientCache.has(service)) {
    return clientCache.get(service)!;
  }

  const serviceConfig = getServiceConfig(service);
  const baseURL = serviceConfig.baseURL;

  if (!baseURL) {
    throw new Error(`Missing API base URL for service "${service}".`);
  }

  const client = createHttpClient(baseURL, service);
  clientCache.set(service, client);
  return client;
}

export const http = getHttpClient();

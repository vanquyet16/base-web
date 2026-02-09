import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { getServiceConfig, type ServiceName } from "@/config/services";
import { getAccessToken } from "@/lib/auth/token";
import { env } from "@/lib/env";

const DEFAULT_SERVICE: ServiceName = "core";
const clientCache = new Map<ServiceName, AxiosInstance>();

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
    (error) => Promise.reject(error),
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

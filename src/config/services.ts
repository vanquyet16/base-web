import { env } from "@/lib/env";

export type AuthType = "none" | "bearer";

export type ServiceConfig = {
  baseURL?: string;
  auth?: AuthType;
  timeout?: number;
  tokenKey?: string;
};

type ServiceMap = Record<string, ServiceConfig>;

export function defineServices<const T extends ServiceMap>(services: T) {
  return services as { [K in keyof T]: ServiceConfig };
}

export const services = defineServices({
  core: {
    baseURL: env.NEXT_PUBLIC_API_BASE_URLS?.core ?? env.NEXT_PUBLIC_API_BASE_URL,
    auth: "bearer",
  },
  auth: {
    baseURL: env.NEXT_PUBLIC_API_BASE_URLS?.auth ?? env.NEXT_PUBLIC_API_BASE_URL,
    auth: "none",
  },
  // Add more services here as you split microservices.
  // auth: { baseURL: env.NEXT_PUBLIC_API_BASE_URLS?.auth, auth: "none" },
  // billing: { baseURL: env.NEXT_PUBLIC_API_BASE_URLS?.billing, auth: "bearer" },
});

export type ServiceName = keyof typeof services;

export function getServiceConfig(service: ServiceName): ServiceConfig {
  return services[service];
}

import { env } from "@/lib/env";

const isBrowser = typeof window !== "undefined";

export function getAccessToken(tokenKey = env.NEXT_PUBLIC_AUTH_TOKEN_KEY) {
  if (!isBrowser) return null;
  return window.localStorage.getItem(tokenKey);
}

export function setAccessToken(token: string, tokenKey = env.NEXT_PUBLIC_AUTH_TOKEN_KEY) {
  if (!isBrowser) return;
  window.localStorage.setItem(tokenKey, token);
}

export function clearAccessToken(tokenKey = env.NEXT_PUBLIC_AUTH_TOKEN_KEY) {
  if (!isBrowser) return;
  window.localStorage.removeItem(tokenKey);
}

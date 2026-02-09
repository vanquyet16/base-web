import { z } from "zod";

const optionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().url().optional(),
);

const optionalUrlRecord = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
}, z.record(z.string(), z.string().url()).optional());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_API_BASE_URL: optionalUrl,
  NEXT_PUBLIC_API_BASE_URLS: optionalUrlRecord,
  NEXT_PUBLIC_API_TIMEOUT: z.coerce.number().int().positive().default(30_000),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("BaseWeb"),
  NEXT_PUBLIC_APP_URL: optionalUrl,
  NEXT_PUBLIC_AUTH_TOKEN_KEY: z.string().min(1).default("auth_token"),
  NEXT_PUBLIC_REFRESH_TOKEN_KEY: z.string().min(1).default("refresh_token"),
});

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_API_BASE_URLS: process.env.NEXT_PUBLIC_API_BASE_URLS,
  NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_AUTH_TOKEN_KEY: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY,
  NEXT_PUBLIC_REFRESH_TOKEN_KEY: process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY,
});

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;

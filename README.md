# Base Web

Opinionated Next.js base with typed environment configuration, API layer, and
app-router boundaries. Designed to be a clean starting point for production work.

## Highlights

- Typed env validation with Zod
- Centralized axios client
- Multi-service API domains support
- React Query provider + devtools
- Zustand store example
- App router error/loading/not-found pages
- Consistent UI primitive with class-variance-authority
- API services separated from React Query hooks

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`

## Structure

- `src/app`: Routes and app-router boundaries
- `src/components`: UI and providers
- `src/config`: Service registry & API config
- `src/constants`: App-level constants
- `src/hooks`: React Query hooks (UI layer)
- `src/lib`: Core utilities (env, http, logger)
- `src/query`: Query key factories
- `src/services`: API modules (no React Query inside)
- `src/stores`: Zustand stores
- `src/types`: Shared types
- `src/utils`: Utility helpers

## Environment

Use `.env.example` as a template and copy to `.env.local`.

### Multiple API domains

Set `NEXT_PUBLIC_API_BASE_URLS` as a JSON map of `service -> base URL`.

Example:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_API_BASE_URLS={"core":"http://localhost:3000/api","auth":"http://localhost:4000","billing":"http://localhost:5000"}
```

## Multi-service API workflow

1. Declare services in `src/config/services.ts`.
2. Configure base URLs in `NEXT_PUBLIC_API_BASE_URLS`.
3. Use `getHttpClient("<service>")` to call each microservice.

## Endpoint registry (route management)

Keep API paths centralized so changes are consistent and reviewable.

File: `src/services/core/core.routes.ts`
```ts
export const coreRoutes = {
  users: {
    me: () => "/users/me",
    byId: (id: string) => `/users/${id}`,
  },
  auth: {
    login: () => "/auth/login",
  },
};
```

## Example: Add a new API domain

### 1) Add domain in `.env.local`
```
NEXT_PUBLIC_API_BASE_URLS={"core":"http://localhost:3000/api","billing":"https://billing.example.com"}
```

### 2) Register the service
File: `src/config/services.ts`
```ts
export const services = defineServices({
  core: {
    baseURL: env.NEXT_PUBLIC_API_BASE_URLS?.core ?? env.NEXT_PUBLIC_API_BASE_URL,
    auth: "bearer",
  },
  billing: {
    baseURL: env.NEXT_PUBLIC_API_BASE_URLS?.billing,
    auth: "bearer",
    timeout: 20_000,
  },
});
```

### 3) Create service API module
File: `src/services/billing/billing.api.ts`
```ts
import { getHttpClient } from "@/lib/http";

const billingHttp = getHttpClient("billing");

export async function fetchInvoices() {
  const { data } = await billingHttp.get("/invoices");
  return data;
}
```

### 4) Create React Query hook (UI layer)
File: `src/hooks/billing/useInvoices.ts`
```ts
import { useQuery } from "@tanstack/react-query";
import { fetchInvoices } from "@/services/billing/billing.api";

export function useInvoices() {
  return useQuery({ queryKey: ["billing", "invoices"], queryFn: fetchInvoices });
}
```

## Example: Call a real API in a service

File: `src/services/demo/demo.api.ts`
```ts
import { getHttpClient } from "@/lib/http";
import type { DemoUser } from "@/services/demo/demo.types";
import { coreRoutes } from "@/services/core/core.routes";

const coreHttp = getHttpClient("core");

export async function fetchDemoUser(): Promise<DemoUser> {
  const { data } = await coreHttp.get<DemoUser>(coreRoutes.users.me());
  return data;
}
```

## Next Steps

Add domain features under `src/features` (if needed) and expand API modules
under `src/services`.

# base-web

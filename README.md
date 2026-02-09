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
- Structured logger with log levels
- HTTP error handling + retry + token refresh hook
- Route helpers to avoid hardcoded paths
- Input validation utility (Zod)
- Security headers via middleware
- Vitest + Testing Library setup
- Reusable client ErrorBoundary

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:ui`
- `npm run test:coverage`

## Structure

- `src/app`: Routes and app-router boundaries
- `src/components`: UI and providers
- `src/config`: Service registry & API config
- `src/constants`: App-level constants
- `src/hooks`: React Query hooks (UI layer)
- `src/lib`: Core utilities (env, http, logger)
- `src/query`: Query key factories
- `src/services`: API modules (no React Query inside)
- `src/services/routes.ts`: Shared route helpers (params + query)
- `src/stores`: Zustand stores
- `src/types`: Shared types
- `src/utils`: Utility helpers
- `src/middleware.ts`: Security headers
- `src/components/errors`: Reusable error boundaries
- `src/test`: Test setup files

## Testing

Vitest + Testing Library are configured via `vitest.config.ts`.

Run:
```
npm run test
```

## Error Boundaries

Use the reusable client boundary for isolated UI errors.

```tsx
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

<ErrorBoundary>
  <SomeComponent />
</ErrorBoundary>
```

## Project Tree

```
src/
  app/
  components/
    demo/
    providers/
    ui/
  config/
  constants/
  hooks/
    demo/
  lib/
    auth/
  query/
  services/
    auth/
    billing/
    core/
    demo/
  stores/
  styles/
  types/
  utils/
```

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

## Error Handling (HTTP)

`src/lib/http.ts` transforms Axios errors into `ApiError` and supports retries:

- Auto retry with exponential backoff for 429/5xx/network errors
- 401 handling via refresh handler

To enable auto refresh:
```ts
import { setRefreshTokenHandler } from "@/lib/http";

setRefreshTokenHandler(async () => {
  // Call refresh endpoint, return new access token
  return "new-access-token";
});
```

## Logging

Logger is structured and level-based:

- `NEXT_PUBLIC_LOG_LEVEL=debug|info|warn|error`
- Pretty logs in development, JSON logs in production

## Validation

Use `validateAndSanitize` before API calls:

File: `src/lib/validation.ts`
```ts
import { z } from "zod";
import { validateAndSanitize } from "@/lib/validation";

const schema = z.object({ name: z.string().min(1) });
const payload = validateAndSanitize(schema, formData);
```


## Endpoint registry (route management)

Keep API paths centralized so changes are consistent and reviewable.

File: `src/services/core/core.routes.ts`
```ts
import { buildPath, withQuery } from "@/services/routes";

export const coreRoutes = {
  users: {
    me: () => "/users/me",
    list: (query?: { search?: string; page?: number }) => withQuery("/users", query),
    byId: (id: string) => buildPath("/users/:id", { id }),
  },
  auth: {
    login: () => "/auth/login",
  },
};
```

### Per-service routes

Create a `*.routes.ts` for each microservice to avoid hardcoded paths.

- `src/services/auth/auth.routes.ts`
- `src/services/billing/billing.routes.ts`

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

## Usage Guide

### 1) Add a microservice

- Add domain in `.env.local`.
- Register it in `src/config/services.ts`.

### 2) Add routes (no hardcode)

- Create `src/services/<service>/<service>.routes.ts`.
- Use `buildPath` + `withQuery` from `src/services/routes.ts`.

### 3) Add API functions

- Create `src/services/<service>/<service>.api.ts`.
- Use `getHttpClient("<service>")`.

### 4) Add React Query hooks

- Create `src/hooks/<service>/useSomething.ts`.
- Use `queryKeys` from `src/query/keys.ts`.

### 5) Use in UI

- Call the hook inside client components.
- Keep UI layer free of direct HTTP calls.

## Security Headers

Applied in `src/middleware.ts`:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## Next Steps

Add domain features under `src/features` (if needed) and expand API modules
under `src/services`.

# base-web

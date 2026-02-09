import { getHttpClient } from "@/lib/http";
import type { DemoUser } from "@/services/demo/demo.types";
import { coreRoutes } from "../core/core.routes";

// REAL API TEMPLATE
// Replace the mock with a real request like this:
const coreHttp = getHttpClient("core");
const { data } = await coreHttp.get<DemoUser>(coreRoutes.users.me());

export async function fetchDemoUser(shouldFail = false): Promise<DemoUser> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (shouldFail) {
    throw new Error("Mock error: failed to fetch user");
  }

  return {
    id: "u_123",
    name: "Alex Nguyen",
    role: "Senior Engineer",
  };
}

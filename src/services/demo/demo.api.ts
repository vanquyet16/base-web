import type { DemoUser } from "@/services/demo/demo.types";

// REAL API TEMPLATE
// Replace the mock with a real request like this:
// const coreHttp = getHttpClient("core");
// const { data } = await coreHttp.get<DemoUser>(coreRoutes.users.me());

/**
 * Fetch demo user information.
 *
 * @param shouldFail - If true, simulates API failure for testing error states.
 * @returns Demo user object with id, name, and role.
 * @throws {Error} When shouldFail is true or network error occurs.
 *
 * @example
 * const user = await fetchDemoUser(false);
 * console.log(user.name);
 */
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

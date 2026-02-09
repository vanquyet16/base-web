import { describe, expect, it } from "vitest";

import { getHttpClient } from "@/lib/http";

describe("HTTP client", () => {
  it("caches clients by service name", () => {
    const first = getHttpClient("core");
    const second = getHttpClient("core");
    expect(first).toBe(second);
  });
});

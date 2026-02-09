"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { useDemoUser } from "@/hooks/demo/useDemoUser";

export default function ApiDemo() {
  const [shouldFail, setShouldFail] = useState(false);

  const query = useDemoUser(shouldFail);

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[0_12px_32px_rgba(16,17,18,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Mock API flow
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
            Client-side data fetch
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Toggle error mode to see loading, success, and error states.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant={shouldFail ? "primary" : "secondary"}
            onClick={() => setShouldFail((prev) => !prev)}
          >
            {shouldFail ? "Failing" : "Success"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => query.refetch()}>
            Refetch
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-4 text-sm">
        {query.isLoading ? (
          <p className="text-[var(--muted)]">Loading data...</p>
        ) : query.isError ? (
          <div className="text-red-600">
            <p className="font-semibold">Error</p>
            <p>{query.error.message}</p>
          </div>
        ) : query.data ? (
          <div className="grid gap-1">
            <p className="font-semibold text-[var(--foreground)]">User payload</p>
            <p>
              <span className="text-[var(--muted)]">ID:</span> {query.data.id}
            </p>
            <p>
              <span className="text-[var(--muted)]">Name:</span> {query.data.name}
            </p>
            <p>
              <span className="text-[var(--muted)]">Role:</span> {query.data.role}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

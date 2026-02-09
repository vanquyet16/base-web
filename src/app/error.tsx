"use client";

import { useEffect } from "react";

import { logger } from "@/lib/logger";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    logger.error("App error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="flex max-w-md flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white p-6 text-center shadow-[0_12px_32px_rgba(16,17,18,0.08)]">
        <h1 className="text-xl font-semibold text-[var(--foreground)]">
          Something went wrong
        </h1>
        <p className="text-sm leading-6 text-[var(--muted)]">
          Try again. If the issue persists, contact the team with the error
          timestamp.
        </p>
        <button
          className="h-10 rounded-full bg-black px-4 text-sm font-medium text-white"
          onClick={reset}
          type="button"
        >
          Retry
        </button>
      </div>
    </main>
  );
}

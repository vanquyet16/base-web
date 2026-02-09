import Link from "next/link";

import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="flex max-w-md flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white p-6 text-center shadow-[0_12px_32px_rgba(16,17,18,0.08)]">
        <h1 className="text-xl font-semibold text-[var(--foreground)]">
          Page not found
        </h1>
        <p className="text-sm leading-6 text-[var(--muted)]">
          The page you are looking for does not exist.
        </p>
        <Link href="/">
          <Button>Back home</Button>
        </Link>
      </div>
    </main>
  );
}

import { Button } from "@/components/ui/Button";
import ApiDemo from "@/components/demo/ApiDemo";
import { APP_DESCRIPTION, APP_NAME } from "@/constants/app";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff,transparent_55%),linear-gradient(180deg,#f7f7f5,transparent)] px-6 py-16">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Next.js base
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
            {APP_NAME}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            {APP_DESCRIPTION}. Opinionated structure, typed environment, API
            layer, and first-class React Query setup.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button">API Client Ready</Button>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="secondary">Next.js Docs</Button>
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Typed env",
              copy: "Zod-validated env config that runs on server and client.",
            },
            {
              title: "API layer",
              copy: "Centralized axios instance with sane defaults.",
            },
            {
              title: "State + cache",
              copy: "Zustand for UI state and React Query for server state.",
            },
            {
              title: "App router",
              copy: "Error, loading, and not-found boundaries ready to go.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-[0_12px_32px_rgba(16,17,18,0.08)]"
            >
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {item.copy}
              </p>
            </div>
          ))}
        </div>

        <ApiDemo />
      </section>
    </main>
  );
}

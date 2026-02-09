export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="flex items-center gap-3 text-sm font-medium text-[var(--muted)]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--foreground)]" />
        Loading...
      </div>
    </main>
  );
}

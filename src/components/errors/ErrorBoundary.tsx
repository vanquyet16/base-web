"use client";

import type { ReactNode } from "react";
import React from "react";

import { logger } from "@/lib/logger";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    logger.error("Component error", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-4 text-sm">
          <p className="font-semibold text-[var(--foreground)]">
            Something went wrong.
          </p>
          <p className="mt-2 text-[var(--muted)]">Please try again.</p>
          <button
            className="mt-3 inline-flex h-9 items-center rounded-full bg-black px-4 text-xs font-medium text-white"
            onClick={this.handleReset}
            type="button"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

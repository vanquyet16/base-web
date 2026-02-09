import { env } from "@/lib/env";

type LogLevel = "debug" | "info" | "warn" | "error";
export type LogContext = Record<string, unknown>;

type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
  env: string;
} & LogContext;

class Logger {
  private readonly levels: LogLevel[] = ["debug", "info", "warn", "error"];

  private shouldLog(level: LogLevel) {
    const currentLevel = env.NEXT_PUBLIC_LOG_LEVEL ?? "info";
    return this.levels.indexOf(currentLevel) <= this.levels.indexOf(level);
  }

  private output(level: LogLevel, message: string, context?: LogContext) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      env: env.NODE_ENV,
      ...(context ?? {}),
    };

    if (env.NODE_ENV === "development") {
      const pretty = context ? context : "";
      console[level](`[${level.toUpperCase()}]`, message, pretty);
    } else {
      console[level](JSON.stringify(entry));
    }

    if (env.NODE_ENV === "production" && level === "error") {
      // TODO: integrate with monitoring (Sentry, Datadog, etc.)
      // Example:
      // Sentry.captureException(new Error(message), { extra: context });
    }
  }

  debug(message: string, context?: LogContext) {
    this.output("debug", message, context);
  }

  info(message: string, context?: LogContext) {
    this.output("info", message, context);
  }

  warn(message: string, context?: LogContext) {
    this.output("warn", message, context);
  }

  error(message: string, context?: LogContext) {
    this.output("error", message, context);
  }
}

export const logger = new Logger();

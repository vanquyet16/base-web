type LogArgs = [message?: unknown, ...optionalParams: unknown[]];

const canDebug = process.env.NODE_ENV !== "production";

export const logger = {
  debug: (...args: LogArgs) => {
    if (canDebug) {
      console.debug(...args);
    }
  },
  info: (...args: LogArgs) => {
    console.info(...args);
  },
  warn: (...args: LogArgs) => {
    console.warn(...args);
  },
  error: (...args: LogArgs) => {
    console.error(...args);
  },
};

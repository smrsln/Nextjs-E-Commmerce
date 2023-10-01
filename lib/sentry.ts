import * as Sentry from "@sentry/node";

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN || "",
    environment: process.env.NODE_ENV || "development",
  });
}

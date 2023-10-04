import * as Sentry from "@sentry/browser";

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN || "",
    environment: process.env.NODE_ENV || "development",
  });
}

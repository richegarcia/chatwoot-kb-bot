export const config = {
  chatwootBaseUrl: process.env.CHATWOOT_BASE_URL || "https://support.commerceship.com",
  chatwootApiToken: process.env.CHATWOOT_API_TOKEN || "",
  chatwootAccountId: process.env.CHATWOOT_ACCOUNT_ID || "1",
  portalSlug: process.env.CHATWOOT_PORTAL_SLUG || "cs-parcel-help",
  matchThreshold: parseFloat(process.env.MATCH_THRESHOLD || "0.3"),
  cooldownSeconds: parseInt(process.env.COOLDOWN_SECONDS || "300"),
  port: parseInt(process.env.PORT || "3005"),
  webhookSecret: process.env.WEBHOOK_SECRET || "",
};

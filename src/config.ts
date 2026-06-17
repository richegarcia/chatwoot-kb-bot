export const config = {
  chatwootBaseUrl: process.env.CHATWOOT_BASE_URL || "https://support.commerceship.com",
  chatwootApiToken: process.env.CHATWOOT_API_TOKEN || "",
  chatwootAccountId: process.env.CHATWOOT_ACCOUNT_ID || "1",
  portalSlug: process.env.CHATWOOT_PORTAL_SLUG || "commerceship-help",
  matchThreshold: parseFloat(process.env.MATCH_THRESHOLD || "0.3"),
  cooldownSeconds: parseInt(process.env.COOLDOWN_SECONDS || "30"),
  port: parseInt(process.env.PORT || "3005"),
  webhookSecret: process.env.WEBHOOK_SECRET || "",

  // Safety limits
  maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH || "500"),
  maxContactMessagesPerMinute: parseInt(process.env.MAX_CONTACT_MESSAGES_PER_MINUTE || "5"),
  maxContactConversationsPerHour: parseInt(process.env.MAX_CONTACT_CONVERSATIONS_PER_HOUR || "3"),
  botSenderId: parseInt(process.env.BOT_SENDER_ID || "3"), // "Customer Support" agent ID
};

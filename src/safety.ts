import { createHmac } from "crypto";
import { config } from "./config.js";

// ============================================================
// WEBHOOK HMAC VALIDATION
// ============================================================

/**
 * Validates the Chatwoot webhook signature using HMAC-SHA256.
 * Returns true if valid or if no secret is configured (backwards compatible).
 */
export function validateWebhookSignature(
  payload: string,
  signature: string | undefined
): boolean {
  if (!config.webhookSecret) return true; // No secret configured, skip validation
  if (!signature) {
    console.warn("Webhook received without signature header");
    return false;
  }

  const expected = createHmac("sha256", config.webhookSecret)
    .update(payload)
    .digest("hex");

  return signature === expected;
}

// ============================================================
// PER-CONTACT RATE LIMITING
// ============================================================

// contactId -> array of timestamps
const contactMessageTimes = new Map<number, number[]>();
const contactConversations = new Map<number, Set<number>>();
const contactConversationTimes = new Map<number, number[]>();

/**
 * Check if a contact has exceeded the per-minute message rate limit.
 */
export function isContactRateLimited(contactId: number): boolean {
  const now = Date.now();
  const windowMs = 60_000; // 1 minute

  let times = contactMessageTimes.get(contactId) || [];
  // Remove entries older than the window
  times = times.filter((t) => now - t < windowMs);
  times.push(now);
  contactMessageTimes.set(contactId, times);

  if (times.length > config.maxContactMessagesPerMinute) {
    console.log(
      `Contact ${contactId} rate limited: ${times.length} messages in last minute (limit: ${config.maxContactMessagesPerMinute})`
    );
    return true;
  }
  return false;
}

/**
 * Check if a contact has opened too many new conversations in the last hour.
 */
export function isContactConversationLimited(
  contactId: number,
  conversationId: number
): boolean {
  const now = Date.now();
  const windowMs = 3_600_000; // 1 hour

  // Track unique conversations per contact
  let convos = contactConversations.get(contactId) || new Set();
  const isNew = !convos.has(conversationId);
  convos.add(conversationId);
  contactConversations.set(contactId, convos);

  if (!isNew) return false; // Existing conversation, always allowed

  let times = contactConversationTimes.get(contactId) || [];
  times = times.filter((t) => now - t < windowMs);
  times.push(now);
  contactConversationTimes.set(contactId, times);

  if (times.length > config.maxContactConversationsPerHour) {
    console.log(
      `Contact ${contactId} conversation limited: ${times.length} new conversations in last hour (limit: ${config.maxContactConversationsPerHour})`
    );
    return true;
  }
  return false;
}

// ============================================================
// MESSAGE CONTENT SAFETY
// ============================================================

/**
 * Check if a message exceeds the length limit.
 */
export function isMessageTooLong(content: string): boolean {
  return content.length > config.maxMessageLength;
}

/**
 * Check if the message is from the bot itself (loop prevention).
 * Compares sender ID against the configured bot agent ID.
 */
export function isBotMessage(senderId: number | undefined): boolean {
  if (!senderId) return false;
  return senderId === config.botSenderId;
}

/**
 * Basic profanity/abuse detection.
 * Returns true if the message contains obvious abuse patterns.
 * This is a lightweight filter, not a comprehensive content moderation system.
 */
const ABUSE_PATTERNS = [
  /\bf+u+c+k+/i,
  /\bs+h+i+t+\b/i,
  /\ba+s+s+h+o+l+e/i,
  /\bb+i+t+c+h/i,
  /\bdie\b.*\byou\b|\byou\b.*\bdie\b/i,
  /\bkill\b.*\byou\b|\byou\b.*\bkill\b/i,
  /\bthreat/i,
  /\bbomb\b/i,
];

export function isAbusiveContent(content: string): boolean {
  return ABUSE_PATTERNS.some((pattern) => pattern.test(content));
}

// ============================================================
// CLEANUP
// ============================================================

// Clean up rate limiting maps periodically
setInterval(() => {
  const now = Date.now();

  // Clean message times older than 2 minutes
  for (const [id, times] of contactMessageTimes) {
    const filtered = times.filter((t) => now - t < 120_000);
    if (filtered.length === 0) contactMessageTimes.delete(id);
    else contactMessageTimes.set(id, filtered);
  }

  // Clean conversation times older than 2 hours
  for (const [id, times] of contactConversationTimes) {
    const filtered = times.filter((t) => now - t < 7_200_000);
    if (filtered.length === 0) {
      contactConversationTimes.delete(id);
      contactConversations.delete(id);
    } else {
      contactConversationTimes.set(id, filtered);
    }
  }
}, 120_000);

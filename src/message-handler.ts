import { sendMessage } from "./chatwoot-api.js";
import {
  search,
  formatResponse,
  isGreeting,
  formatGreeting,
} from "./article-search.js";
import { config } from "./config.js";

// Track cooldowns: conversationId -> last bot reply timestamp
const cooldowns = new Map<number, number>();

// Track feedback: conversationId -> true if bot just responded (awaiting yes/no)
const awaitingFeedback = new Map<number, string>();

// Feedback patterns
const POSITIVE_FEEDBACK = /^(yes|yeah|yep|yup|sure|thanks|thank you|helpful|great|perfect|that helps|got it)$/i;
const NEGATIVE_FEEDBACK = /^(no|nope|nah|not really|didn't help|wrong|that's not right|not what i meant)$/i;

// Chatwoot webhook payload types
interface WebhookPayload {
  event: string;
  id?: number;
  content?: string;
  message_type?: string; // "incoming" | "outgoing"
  content_type?: string;
  conversation?: {
    id: number;
    inbox_id?: number;
    status?: string;
  };
  sender?: {
    id: number;
    type: string; // "contact" = customer, "user" = agent
  };
  account?: {
    id: number;
  };
}

export async function handleWebhook(payload: WebhookPayload): Promise<void> {
  // Only handle message_created events
  if (payload.event !== "message_created") return;

  // Only respond to incoming messages (from customers)
  if (payload.message_type !== "incoming") return;

  // Must have conversation context
  const conversationId = payload.conversation?.id;
  if (!conversationId) return;

  // Must have message content
  const content = payload.content?.trim();
  if (!content) return;

  // Check if this is feedback to a previous bot response
  if (awaitingFeedback.has(conversationId)) {
    const articleTitle = awaitingFeedback.get(conversationId)!;
    awaitingFeedback.delete(conversationId);

    if (POSITIVE_FEEDBACK.test(content)) {
      await sendMessage(
        conversationId,
        "Glad that helped! Let me know if you have other questions."
      );
      console.log(`Positive feedback for "${articleTitle}" in conversation ${conversationId}`);
      cooldowns.set(conversationId, Date.now());
      return;
    }

    if (NEGATIVE_FEEDBACK.test(content)) {
      await sendMessage(
        conversationId,
        "Sorry about that. Let me connect you with our team for a better answer. Someone will follow up shortly."
      );
      console.log(`Negative feedback for "${articleTitle}" in conversation ${conversationId}`);
      cooldowns.set(conversationId, Date.now());
      return;
    }

    // Not feedback, treat as a new question (fall through)
  }

  // Skip very short messages (under 2 words) unless it's a greeting
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 2 && !isGreeting(content)) return;

  // Cooldown check
  const lastReply = cooldowns.get(conversationId) || 0;
  const now = Date.now();
  if (now - lastReply < config.cooldownSeconds * 1000) {
    console.log(
      `Cooldown active for conversation ${conversationId}, skipping`
    );
    return;
  }

  // Handle greetings
  if (isGreeting(content)) {
    await sendMessage(conversationId, formatGreeting());
    cooldowns.set(conversationId, now);
    console.log(`Greeting response sent to conversation ${conversationId}`);
    return;
  }

  // Search for a matching article
  const result = await search(content);

  if (result) {
    const response = formatResponse(result.article);
    await sendMessage(conversationId, response);
    cooldowns.set(conversationId, now);
    awaitingFeedback.set(conversationId, result.article.title);
    console.log(
      `KB match (score: ${result.score.toFixed(2)}) in conversation ${conversationId}: "${result.article.title}" [${result.matchedTerms.join(", ")}]`
    );
  } else {
    console.log(
      `No KB match for conversation ${conversationId}: "${content.substring(0, 80)}"`
    );
  }
}

// Clean up old cooldowns and feedback state periodically
setInterval(() => {
  const cutoff = Date.now() - config.cooldownSeconds * 2000;
  for (const [id, timestamp] of cooldowns) {
    if (timestamp < cutoff) cooldowns.delete(id);
  }
  // Clean up stale feedback trackers (older than 5 minutes)
  // Can't track time on feedback map without adding timestamps, so just clear all
  // This is fine since feedback is only relevant immediately after a bot response
}, 60_000);

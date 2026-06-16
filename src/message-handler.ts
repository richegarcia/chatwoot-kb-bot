import { getConversationMessages, sendMessage } from "./chatwoot-api.js";
import {
  search,
  formatResponse,
  isGreeting,
  formatGreeting,
} from "./article-search.js";
import { config } from "./config.js";

// Track cooldowns: conversationId -> last bot reply timestamp
const cooldowns = new Map<number, number>();

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

  // Skip very short messages (under 2 words) unless it's a greeting
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 2 && !isGreeting(content)) return;

  // Cooldown check — don't reply more than once per conversation within the window
  const lastReply = cooldowns.get(conversationId) || 0;
  const now = Date.now();
  if (now - lastReply < config.cooldownSeconds * 1000) {
    console.log(
      `Cooldown active for conversation ${conversationId}, skipping`
    );
    return;
  }

  // Check if an agent has already replied in this conversation
  const hasAgentReply = await checkForAgentReply(conversationId);
  if (hasAgentReply) {
    console.log(
      `Agent already replied in conversation ${conversationId}, deferring`
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
    console.log(
      `KB match (score: ${result.score.toFixed(2)}) in conversation ${conversationId}: "${result.article.title}" [${result.matchedTerms.join(", ")}]`
    );
  } else {
    console.log(
      `No KB match for conversation ${conversationId}: "${content.substring(0, 80)}"`
    );
    // No match — let Google Chat alert handle it (human responds).
    // Don't send anything — silence is better than a bad answer.
  }
}

async function checkForAgentReply(
  conversationId: number
): Promise<boolean> {
  const messages = await getConversationMessages(conversationId);
  // message_type 1 = outgoing (agent/bot), sender_type "user" = agent
  // We check if any outgoing message was sent by a human agent (not this bot).
  // Since we can't easily distinguish bot vs agent outgoing messages,
  // we check if there are more than 0 outgoing messages already.
  // This means the bot only responds to the FIRST customer message
  // before any agent/bot has replied.
  return messages.some(
    (m: any) => m.message_type === 1 || m.message_type === "outgoing"
  );
}

// Clean up old cooldowns periodically
setInterval(() => {
  const cutoff = Date.now() - config.cooldownSeconds * 2000;
  for (const [id, timestamp] of cooldowns) {
    if (timestamp < cutoff) cooldowns.delete(id);
  }
}, 60_000);

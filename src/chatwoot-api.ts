import { config } from "./config.js";

const headers = {
  "Content-Type": "application/json",
  api_access_token: config.chatwootApiToken,
};

const base = `${config.chatwootBaseUrl}/api/v1/accounts/${config.chatwootAccountId}`;

export interface Article {
  id: number;
  title: string;
  content: string;
  slug: string;
  status: string;
  portal_id: number;
  category?: { name: string; slug: string };
}

export interface ConversationMessage {
  id: number;
  content: string;
  message_type: number; // 0 = incoming, 1 = outgoing
  sender_type: string;
}

// --- Help Center ---

export async function fetchArticles(): Promise<Article[]> {
  const articles: Article[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `${base}/portals/${config.portalSlug}/articles?page=${page}`,
      { headers }
    );
    if (!res.ok) {
      console.error(`Failed to fetch articles page ${page}: ${res.status}`);
      break;
    }
    const data = await res.json();
    const batch = data.payload || data;

    if (!Array.isArray(batch) || batch.length === 0) break;

    articles.push(
      ...batch
        .filter((a: any) => a.status === "published")
        .map((a: any) => ({
          id: a.id,
          title: a.title || "",
          content: stripHtml(a.content || a.body || ""),
          slug: a.slug || "",
          status: a.status,
          portal_id: a.portal_id,
          category: a.category,
        }))
    );

    page++;
    if (batch.length < 25) break; // last page
  }

  return articles;
}

// --- Conversations ---

export async function getConversationMessages(
  conversationId: number
): Promise<ConversationMessage[]> {
  const res = await fetch(
    `${base}/conversations/${conversationId}/messages`,
    { headers }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.payload || [];
}

export async function sendMessage(
  conversationId: number,
  content: string
): Promise<void> {
  const res = await fetch(
    `${base}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        content,
        message_type: "outgoing",
        private: false,
      }),
    }
  );
  if (!res.ok) {
    console.error(`Failed to send message: ${res.status} ${await res.text()}`);
  }
}

// --- Helpers ---

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

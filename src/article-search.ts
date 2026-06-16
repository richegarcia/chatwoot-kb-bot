import { Article, fetchArticles } from "./chatwoot-api.js";
import { config } from "./config.js";

// Stop words to ignore in matching
const STOP_WORDS = new Set([
  "i", "me", "my", "we", "our", "you", "your", "he", "she", "it", "they",
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "am", "are", "was", "were", "be",
  "been", "being", "have", "has", "had", "do", "does", "did", "will",
  "would", "could", "should", "can", "may", "might", "shall", "not",
  "this", "that", "these", "those", "what", "which", "who", "whom",
  "how", "when", "where", "why", "if", "then", "so", "than", "too",
  "very", "just", "about", "up", "out", "no", "yes", "hi", "hello",
  "hey", "thanks", "thank", "please", "help", "need", "want", "get",
]);

// Greeting patterns
const GREETINGS = /^(hi|hello|hey|good morning|good afternoon|good evening|howdy)\b/i;

export interface SearchResult {
  article: Article;
  score: number;
  matchedTerms: string[];
}

let articleIndex: IndexedArticle[] = [];
let lastRefresh = 0;
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface IndexedArticle {
  article: Article;
  titleTokens: Set<string>;
  contentTokens: Set<string>;
  allTokens: Set<string>;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

export async function refreshArticles(): Promise<number> {
  const articles = await fetchArticles();
  articleIndex = articles.map((article) => {
    const titleTokens = new Set(tokenize(article.title));
    const contentTokens = new Set(tokenize(article.content));
    const allTokens = new Set([...titleTokens, ...contentTokens]);
    return { article, titleTokens, contentTokens, allTokens };
  });
  lastRefresh = Date.now();
  console.log(`Indexed ${articleIndex.length} articles`);
  return articleIndex.length;
}

export async function ensureFresh(): Promise<void> {
  if (Date.now() - lastRefresh > REFRESH_INTERVAL) {
    await refreshArticles();
  }
}

export function isGreeting(text: string): boolean {
  const trimmed = text.trim();
  // Pure greeting if it's short and matches the pattern
  return trimmed.split(/\s+/).length <= 4 && GREETINGS.test(trimmed);
}

export async function search(query: string): Promise<SearchResult | null> {
  await ensureFresh();

  if (articleIndex.length === 0) return null;

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return null;

  let bestResult: SearchResult | null = null;
  let bestScore = 0;

  for (const indexed of articleIndex) {
    const matchedTerms: string[] = [];
    let score = 0;

    for (const token of queryTokens) {
      if (indexed.titleTokens.has(token)) {
        // Title match — weighted 3x
        score += 3;
        matchedTerms.push(`${token}(title)`);
      } else if (indexed.contentTokens.has(token)) {
        // Content match — weighted 1x
        score += 1;
        matchedTerms.push(token);
      }
    }

    // Normalize: score / max possible score (all tokens matched in title)
    const maxScore = queryTokens.length * 3;
    const normalizedScore = score / maxScore;

    if (normalizedScore > bestScore) {
      bestScore = normalizedScore;
      bestResult = {
        article: indexed.article,
        score: normalizedScore,
        matchedTerms,
      };
    }
  }

  if (bestResult && bestResult.score >= config.matchThreshold) {
    return bestResult;
  }

  return null;
}

export function formatResponse(article: Article): string {
  // Extract first 2-3 sentences from article content for a concise chat reply
  const sentences = article.content
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.length > 10);

  const brief = sentences.slice(0, 3).join(" ");
  // Truncate to ~300 chars if still too long
  const answer = brief.length > 300 ? brief.substring(0, 297) + "..." : brief;

  return [
    answer,
    "",
    `Was this helpful? (yes/no)`,
    `Have another question? Just ask — or I'll connect you with our team.`,
  ].join("\n");
}

export function formatGreeting(): string {
  return [
    "Hi! I can help with common questions about CommerceShip.",
    "",
    "What can I help you with?",
  ].join("\n");
}

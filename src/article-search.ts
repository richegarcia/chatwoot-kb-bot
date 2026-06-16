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

// Short words that are meaningful in this domain (bypass length filter)
const KEEP_SHORT = new Set([
  "dim", "api", "csv", "mcp", "ups", "2fa", "erp", "wms", "oms",
  "sku", "bol", "eta", "etd", "roi", "gl", "ar", "ap", "ai",
]);

// Synonyms: map common terms to canonical forms used in articles
const SYNONYMS: Record<string, string[]> = {
  dimensional: ["dim"],
  carrier: ["carriers"],
  carriers: ["carrier"],
  reconciliation: ["reconcile", "reconciling", "audit", "invoice audit"],
  tracking: ["track", "tracked", "shipment tracking"],
  track: ["tracking"],
  automation: ["automate", "automated", "rules", "rule"],
  automate: ["automation"],
  rules: ["rule", "automation"],
  label: ["labels", "shipping label"],
  labels: ["label"],
  shipment: ["shipments", "shipping"],
  shipping: ["shipment", "ship"],
  rate: ["rates", "pricing"],
  rates: ["rate"],
  connect: ["connecting", "connection", "setup", "add"],
  connecting: ["connect"],
  user: ["users", "team member", "team"],
  users: ["user"],
  weight: ["dim weight", "dimensional weight"],
  surcharge: ["surcharges", "fee", "fees"],
  refund: ["refunds", "claim", "claims"],
  import: ["importing", "upload"],
  batch: ["bulk"],
  manifest: ["manifests", "end of day"],
  international: ["cross-border", "customs"],
  discount: ["discounts"],
  preset: ["presets", "package preset"],
  dashboard: ["dashboards", "reports", "analytics"],
  report: ["reports", "reporting"],
};

// Greeting patterns
const GREETINGS = /^(hi|hello|hey|good morning|good afternoon|good evening|howdy)\b/i;

export interface SearchResult {
  article: Article;
  score: number;
  matchedTerms: string[];
}

let articleIndex: IndexedArticle[] = [];
let idfScores: Map<string, number> = new Map();
let lastRefresh = 0;
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface IndexedArticle {
  article: Article;
  titleTokens: Set<string>;
  contentTokens: Set<string>;
  titleText: string;
  contentText: string;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => (w.length > 2 || KEEP_SHORT.has(w)) && !STOP_WORDS.has(w));
}

// Expand query tokens with synonyms
function expandWithSynonyms(tokens: string[]): string[] {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    const syns = SYNONYMS[token];
    if (syns) {
      for (const s of syns) {
        expanded.add(s);
      }
    }
  }
  return [...expanded];
}

// Build bigrams from tokens: ["dim", "weight"] -> ["dim weight"]
function bigrams(tokens: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    result.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return result;
}

// Calculate IDF: log(totalDocs / docsContainingTerm)
function buildIdf(): void {
  const docCount = articleIndex.length;
  const termDocCount = new Map<string, number>();

  for (const indexed of articleIndex) {
    const allTokens = new Set([...indexed.titleTokens, ...indexed.contentTokens]);
    for (const token of allTokens) {
      termDocCount.set(token, (termDocCount.get(token) || 0) + 1);
    }
  }

  idfScores = new Map();
  for (const [term, count] of termDocCount) {
    // IDF: rare terms get high scores, common terms get low scores
    idfScores.set(term, Math.log(docCount / count) + 1);
  }
}

export async function refreshArticles(): Promise<number> {
  const articles = await fetchArticles();
  articleIndex = articles.map((article) => {
    const titleText = article.title.toLowerCase();
    const contentText = article.content.toLowerCase();
    const titleTokens = new Set(tokenize(article.title));
    const contentTokens = new Set(tokenize(article.content));
    return { article, titleTokens, contentTokens, titleText, contentText };
  });
  buildIdf();
  lastRefresh = Date.now();
  console.log(`Indexed ${articleIndex.length} articles (${idfScores.size} unique terms)`);
  return articleIndex.length;
}

export async function ensureFresh(): Promise<void> {
  if (Date.now() - lastRefresh > REFRESH_INTERVAL) {
    await refreshArticles();
  }
}

export function isGreeting(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.split(/\s+/).length <= 4 && GREETINGS.test(trimmed);
}

export async function search(query: string): Promise<SearchResult | null> {
  await ensureFresh();

  if (articleIndex.length === 0) return null;

  const rawTokens = tokenize(query);
  if (rawTokens.length === 0) return null;

  // Expand with synonyms
  const queryTokens = expandWithSynonyms(rawTokens);
  const queryBigrams = bigrams(rawTokens);
  const queryLower = query.toLowerCase();

  let bestResult: SearchResult | null = null;
  let bestScore = 0;

  for (const indexed of articleIndex) {
    const matchedTerms: string[] = [];
    let score = 0;

    // Score individual tokens with TF-IDF weighting
    for (const token of queryTokens) {
      const idf = idfScores.get(token) || 1;

      if (indexed.titleTokens.has(token)) {
        // Title match: 3x base * IDF
        score += 3 * idf;
        matchedTerms.push(`${token}(title,idf=${idf.toFixed(1)})`);
      } else if (indexed.contentTokens.has(token)) {
        // Content match: 1x base * IDF
        score += 1 * idf;
        matchedTerms.push(`${token}(idf=${idf.toFixed(1)})`);
      }
    }

    // Bonus: bigram/phrase matches in title or content
    for (const bigram of queryBigrams) {
      if (indexed.titleText.includes(bigram)) {
        score += 10; // Strong bonus for phrase match in title
        matchedTerms.push(`"${bigram}"(title-phrase)`);
      } else if (indexed.contentText.includes(bigram)) {
        score += 5; // Good bonus for phrase match in content
        matchedTerms.push(`"${bigram}"(content-phrase)`);
      }
    }

    // Bonus: check if the full query appears as a substring in title
    if (indexed.titleText.includes(queryLower)) {
      score += 15;
      matchedTerms.push("(full-query-in-title)");
    }

    // Normalize by max possible (all original tokens matched in title with max IDF + phrase bonuses)
    const maxIdf = Math.max(...rawTokens.map((t) => idfScores.get(t) || 1));
    const maxScore = rawTokens.length * 3 * maxIdf + queryBigrams.length * 10 + 15;
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
    `Have another question? Just ask, or I'll connect you with our team.`,
  ].join("\n");
}

export function formatGreeting(): string {
  return [
    "Hi! I can help with common questions about CommerceShip.",
    "",
    "What can I help you with?",
  ].join("\n");
}

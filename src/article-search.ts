import { Article, fetchArticles } from "./chatwoot-api.js";
import { config } from "./config.js";

// ============================================================
// INTENT MAP — direct pattern-to-article matching
// Checked BEFORE keyword search. Maps customer query patterns
// to article titles. Derived from article content analysis.
// ============================================================

const INTENT_MAP: { patterns: RegExp[]; articleTitle: string }[] = [
  // Shipping costs / surcharges / DIM weight
  {
    patterns: [
      /dim\s*weight/i,
      /dimensional\s*weight/i,
      /cost\s*differen/i,
      /shipping\s*cost/i,
      /why.*(charge|cost|price|bill).*(different|higher|more|wrong)/i,
      /surcharge/i,
      /residential\s*(fee|surcharge|charge)/i,
      /address\s*correction/i,
      /zone\s*(difference|pricing)/i,
      /peak\s*surcharge/i,
      /overcharg/i,
    ],
    articleTitle: "Understanding Shipping Cost Differences",
  },

  // Reconciliation
  {
    patterns: [
      /reconcil/i,
      /invoice\s*audit/i,
      /carrier\s*invoice/i,
      /compare.*invoice/i,
      /match.*invoice/i,
      /billing\s*error/i,
      /billing\s*discrepanc/i,
    ],
    articleTitle: "How Reconciliation Works",
  },

  // Refund claims
  {
    patterns: [
      /refund/i,
      /file.*claim/i,
      /claim/i,
      /dispute/i,
      /late\s*delivery.*refund/i,
      /guaranteed\s*service/i,
      /duplicate\s*charge/i,
    ],
    articleTitle: "Filing Refund Claims",
  },

  // Supported carriers
  {
    patterns: [
      /what\s*carriers/i,
      /which\s*carriers/i,
      /supported\s*carriers/i,
      /carrier.*list/i,
      /do\s*you\s*(support|have|offer).*carrier/i,
      /what.*ship\s*with/i,
      /usps|fedex|ups\b/i,
    ],
    articleTitle: "Supported Carriers",
  },

  // Connecting a carrier
  {
    patterns: [
      /connect.*carrier/i,
      /add.*carrier/i,
      /set\s*up.*carrier/i,
      /carrier.*connect/i,
      /carrier.*credentials/i,
      /carrier.*setup/i,
      /eps\s*credentials/i,
    ],
    articleTitle: "Connecting a Carrier Account",
  },

  // Tracking
  {
    patterns: [
      /track.*shipment/i,
      /track.*package/i,
      /tracking/i,
      /where.*package/i,
      /where.*shipment/i,
      /shipment\s*status/i,
      /delivery\s*status/i,
    ],
    articleTitle: "Tracking Your Shipments",
  },

  // Delivery delays
  {
    patterns: [
      /delay/i,
      /late\s*delivery/i,
      /not\s*delivered/i,
      /stuck\s*in\s*transit/i,
      /delivery\s*(issue|problem)/i,
      /shipment.*(late|delayed|stuck)/i,
    ],
    articleTitle: "Delivery Issues and Delays",
  },

  // Automation rules
  {
    patterns: [
      /automation/i,
      /automate/i,
      /set\s*up.*rule/i,
      /create.*rule/i,
      /routing\s*rule/i,
      /if.*then.*rule/i,
      /automatic.*routing/i,
    ],
    articleTitle: "Setting Up Automation Rules",
  },

  // Automation tips
  {
    patterns: [
      /automation.*(tip|best|practice|advice)/i,
      /rule.*(tip|best|practice|priority|order)/i,
    ],
    articleTitle: "Automation Tips and Best Practices",
  },

  // Rate shopping / comparing
  {
    patterns: [
      /rate\s*shop/i,
      /compar.*rate/i,
      /cheapest.*rate/i,
      /best.*rate/i,
      /lowest.*rate/i,
      /compare.*carrier.*rate/i,
      /rate.*comparison/i,
      /side\s*by\s*side/i,
    ],
    articleTitle: "Comparing Rates Across Carriers",
  },

  // Carrier discounts
  {
    patterns: [
      /discount/i,
      /negotiated\s*rate/i,
      /own\s*rate/i,
      /my\s*rate/i,
      /contract.*import/i,
      /rate.*schedul/i,
      /gri/i,
      /general\s*rate\s*increase/i,
      /save.*shipping/i,
    ],
    articleTitle: "Understanding Carrier Discounts",
  },

  // Package presets
  {
    patterns: [
      /package\s*preset/i,
      /preset/i,
      /save.*dimensions/i,
      /box\s*size/i,
      /default.*package/i,
      /reuse.*dimensions/i,
    ],
    articleTitle: "Package Presets",
  },

  // Labels
  {
    patterns: [
      /generat.*label/i,
      /print.*label/i,
      /create.*label/i,
      /shipping\s*label/i,
      /label/i,
      /address\s*verif/i,
    ],
    articleTitle: "Generating Shipping Labels",
  },

  // Batch / manifests
  {
    patterns: [
      /batch/i,
      /manifest/i,
      /end\s*of\s*day/i,
      /bulk.*ship/i,
      /multiple.*shipment/i,
      /close\s*out/i,
    ],
    articleTitle: "Batch Processing and Manifests",
  },

  // International
  {
    patterns: [
      /international/i,
      /cross.border/i,
      /customs/i,
      /customs\s*form/i,
      /ship.*canada/i,
      /ship.*international/i,
      /hs\s*code/i,
    ],
    articleTitle: "International and Cross-Border Shipping",
  },

  // Orders / importing
  {
    patterns: [
      /import.*order/i,
      /upload.*order/i,
      /csv.*order/i,
      /order.*import/i,
      /manage.*order/i,
      /order.*status/i,
      /sales\s*channel/i,
    ],
    articleTitle: "Importing and Managing Orders",
  },

  // Order routing
  {
    patterns: [
      /order\s*routing/i,
      /route.*order/i,
      /fulfillment/i,
      /multi.*location/i,
      /warehouse.*routing/i,
      /3pl/i,
    ],
    articleTitle: "Order Routing and Fulfillment",
  },

  // Integrations / ecommerce
  {
    patterns: [
      /integrat/i,
      /shopify/i,
      /ecommerce/i,
      /e-commerce/i,
      /connect.*platform/i,
      /connect.*store/i,
      /woocommerce/i,
      /magento/i,
      /marketplace/i,
      /wms|oms|erp/i,
    ],
    articleTitle: "Connecting Your Ecommerce Platform",
  },

  // API
  {
    patterns: [
      /\bapi\b/i,
      /webhook/i,
      /programmat/i,
      /rest\s*api/i,
      /api\s*key/i,
      /api\s*access/i,
      /developer/i,
    ],
    articleTitle: "Using the CommerceShip API",
  },

  // Team / users / roles
  {
    patterns: [
      /add.*team/i,
      /add.*user/i,
      /add.*member/i,
      /invite.*user/i,
      /invite.*team/i,
      /team\s*member/i,
      /role|roles|rbac|permission/i,
      /user\s*management/i,
      /who\s*can\s*(see|access|edit)/i,
    ],
    articleTitle: "Adding Team Members and Roles",
  },

  // Account / login / password / 2FA
  {
    patterns: [
      /my\s*account/i,
      /account\s*setting/i,
      /password/i,
      /forgot.*password/i,
      /reset.*password/i,
      /login/i,
      /log\s*in/i,
      /sign\s*in/i,
      /2fa|two.factor|mfa/i,
      /billing|subscription|plan|payment\s*method/i,
    ],
    articleTitle: "Managing Your Account",
  },

  // Dashboards / reports
  {
    patterns: [
      /dashboard/i,
      /report/i,
      /analytics/i,
      /metrics/i,
      /scheduled\s*report/i,
      /enterprise\s*report/i,
      /data.*filter/i,
    ],
    articleTitle: "Dashboards and Reports",
  },

  // AI insights
  {
    patterns: [
      /ai.*insight/i,
      /ai.*report/i,
      /weekly.*report/i,
      /ai.*recommend/i,
      /spend\s*analytic/i,
      /cost.*analytic/i,
    ],
    articleTitle: "AI-Generated Insights",
  },

  // AI agents / chat
  {
    patterns: [
      /ai\s*(agent|chat|assistant|bot)/i,
      /chat.*ai/i,
      /ask.*question/i,
      /reconciliation\s*agent/i,
      /contracts\s*agent/i,
      /support\s*agent/i,
      /agent\s*memory/i,
    ],
    articleTitle: "AI-Powered Chat and Agents",
  },

  // MCP
  {
    patterns: [
      /\bmcp\b/i,
      /model\s*context\s*protocol/i,
      /connect.*claude/i,
      /connect.*chatgpt/i,
      /ai.*integration/i,
      /external.*ai/i,
    ],
    articleTitle: "MCP and External Integrations for AI",
  },

  // Contact support
  {
    patterns: [
      /contact.*support/i,
      /reach.*support/i,
      /talk.*support/i,
      /email.*support/i,
      /chat.*support/i,
      /support.*email/i,
      /support.*hours/i,
      /how.*reach.*you/i,
      /how.*contact/i,
      /help.*center/i,
    ],
    articleTitle: "Contacting Support",
  },

  // Getting started
  {
    patterns: [
      /get.*started/i,
      /getting.*started/i,
      /first\s*time/i,
      /new\s*to/i,
      /where\s*do\s*i\s*start/i,
      /how\s*does.*work$/i,  // very generic "how does it work"
      /what\s*(can|does).*do/i,
      /overview/i,
    ],
    articleTitle: "Getting Started with CommerceShip",
  },

  // First shipment
  {
    patterns: [
      /first\s*shipment/i,
      /first\s*order/i,
      /how\s*to\s*ship/i,
      /step.*by.*step/i,
      /walkthrough/i,
      /tutorial/i,
    ],
    articleTitle: "Your First Shipment",
  },
];

// ============================================================
// STOP WORDS — terms too common to be useful for matching
// ============================================================

const STOP_WORDS = new Set([
  "i", "me", "my", "we", "our", "you", "your", "he", "she", "it", "they",
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "am", "are", "was", "were", "be",
  "been", "being", "have", "has", "had", "do", "does", "did", "will",
  "would", "could", "should", "can", "may", "might", "shall", "not",
  "this", "that", "these", "those", "what", "which", "who", "whom",
  "how", "when", "where", "why", "if", "then", "so", "than", "too",
  "very", "just", "about", "up", "out", "no", "yes", "hi", "hello",
  "hey", "thanks", "thank", "please", "need", "want", "get",
  "commerceship", "com", // Brand name appears everywhere
]);

// Short words meaningful in this domain
const KEEP_SHORT = new Set([
  "dim", "api", "csv", "mcp", "ups", "2fa", "erp", "wms", "oms", "ai",
  "sku", "bol", "eta", "etd", "roi", "gl", "ar", "ap", "gri", "3pl",
]);

// Synonyms for keyword fallback search
const SYNONYMS: Record<string, string[]> = {
  dim: ["dimensional"], dimensional: ["dim"],
  surcharge: ["surcharges", "fee", "fees", "charge"], surcharges: ["surcharge"],
  overcharge: ["overcharges", "discrepancy"], overcharges: ["overcharge"],
  cost: ["costs", "charge", "pricing", "price", "spend"],
  fee: ["fees", "surcharge", "charge"],
  carrier: ["carriers"], carriers: ["carrier"],
  reconciliation: ["reconcile", "audit", "invoices"], reconcile: ["reconciliation"],
  audit: ["reconciliation", "invoice"],
  invoice: ["invoices", "billing", "reconciliation"], invoices: ["invoice"],
  claim: ["claims", "refund", "dispute"], claims: ["claim"],
  refund: ["refunds", "claim", "overcharge"], refunds: ["refund"],
  dispute: ["claim", "refund"],
  tracking: ["track", "shipment", "delivery", "status"], track: ["tracking"],
  delivery: ["delivered", "delays", "transit"], delivered: ["delivery"],
  delayed: ["delays", "delivery"], delays: ["delay", "delayed"],
  late: ["delays", "delivery", "delayed"],
  automation: ["automate", "automated", "rules", "rule"], automate: ["automation"],
  rules: ["rule", "automation"], rule: ["rules", "automation"],
  label: ["labels", "generate", "print"], labels: ["label"],
  ship: ["shipping", "shipment"],
  shipping: ["shipment", "ship", "label"],
  shipment: ["shipments", "shipping"], shipments: ["shipment"],
  manifest: ["manifests", "end", "day", "close"], manifests: ["manifest"],
  batch: ["bulk", "processing", "multiple"],
  order: ["orders", "import"], orders: ["order"],
  import: ["importing", "upload", "csv", "sync"], importing: ["import"],
  rate: ["rates", "pricing", "cost", "compare"], rates: ["rate"],
  compare: ["comparing", "comparison", "rate", "shopping"], comparing: ["compare"],
  connect: ["connecting", "connection", "setup", "add", "integrate"], connecting: ["connect"],
  setup: ["connect", "configure", "add"],
  integrate: ["integration", "integrations", "connect"],
  integration: ["integrate", "integrations", "connecting"],
  integrations: ["integration", "ecommerce", "shopify", "connect", "api", "csv", "platforms"],
  user: ["users", "team", "member", "role"], users: ["user"],
  team: ["member", "user", "invite", "roles"],
  invite: ["add", "team", "member"],
  role: ["roles", "permission", "access", "rbac"], roles: ["role"],
  permission: ["permissions", "role", "access"], permissions: ["permission"],
  password: ["login", "forgot", "reset", "2fa"],
  login: ["password", "2fa", "account"],
  shopify: ["ecommerce", "platform", "integration", "integrations"],
  ecommerce: ["shopify", "platform", "store", "integrations"],
  webhook: ["webhooks", "api"], webhooks: ["webhook"],
  support: ["supported", "available"], supported: ["support", "available"],
  agents: ["agent", "ai"], agent: ["agents", "ai"],
  customs: ["international", "cross-border", "forms"],
  international: ["cross-border", "customs", "global"],
  preset: ["presets", "package", "dimensions", "box"], presets: ["preset"],
  package: ["preset", "dimensions", "weight", "box"],
  dimensions: ["dim", "weight", "package", "size"],
  dashboard: ["dashboards", "reports", "analytics", "metrics"], dashboards: ["dashboard"],
  report: ["reports", "analytics", "insights"], reports: ["report"],
  analytics: ["report", "dashboard", "insights", "data"],
  insights: ["ai", "report", "analytics", "weekly"],
  discount: ["discounts", "savings", "negotiated"], discounts: ["discount"],
  negotiated: ["discount", "contract", "rates"],
  contract: ["negotiated", "rates", "carrier"],
  routing: ["route", "fulfillment"], route: ["routing"],
  fulfillment: ["routing", "warehouse", "3pl"],
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
const REFRESH_INTERVAL = 5 * 60 * 1000;

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

function expandWithSynonyms(tokens: string[]): string[] {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    const syns = SYNONYMS[token];
    if (syns) {
      for (const s of syns) expanded.add(s);
    }
  }
  return [...expanded];
}

function bigrams(tokens: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    result.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return result;
}

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
  console.log(`Indexed ${articleIndex.length} articles (${idfScores.size} terms, ${INTENT_MAP.length} intent patterns)`);
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

// ============================================================
// SEARCH — intent map first, then keyword fallback
// ============================================================

export async function search(query: string): Promise<SearchResult | null> {
  await ensureFresh();
  if (articleIndex.length === 0) return null;

  // Phase 1: Intent matching (fast, high precision)
  const intentResult = matchIntent(query);
  if (intentResult) return intentResult;

  // Phase 2: Keyword search with TF-IDF (fallback)
  return keywordSearch(query);
}

function matchIntent(query: string): SearchResult | null {
  for (const intent of INTENT_MAP) {
    for (const pattern of intent.patterns) {
      if (pattern.test(query)) {
        // Find the article by title
        const indexed = articleIndex.find(
          (a) => a.article.title === intent.articleTitle
        );
        if (indexed) {
          return {
            article: indexed.article,
            score: 0.9, // High confidence for intent match
            matchedTerms: [`intent:${pattern.source}`],
          };
        }
      }
    }
  }
  return null;
}

function keywordSearch(query: string): SearchResult | null {
  const rawTokens = tokenize(query);
  if (rawTokens.length === 0) return null;

  const queryTokens = expandWithSynonyms(rawTokens);
  const queryBigrams = bigrams(rawTokens);
  const queryLower = query.toLowerCase();

  let bestResult: SearchResult | null = null;
  let bestScore = 0;

  for (const indexed of articleIndex) {
    const matchedTerms: string[] = [];
    let score = 0;

    for (const token of queryTokens) {
      const idf = idfScores.get(token) || 1;
      if (indexed.titleTokens.has(token)) {
        score += 3 * idf;
        matchedTerms.push(`${token}(title)`);
      } else if (indexed.contentTokens.has(token)) {
        score += 1 * idf;
        matchedTerms.push(token);
      }
    }

    for (const bigram of queryBigrams) {
      if (indexed.titleText.includes(bigram)) {
        score += 10;
        matchedTerms.push(`"${bigram}"(title-phrase)`);
      } else if (indexed.contentText.includes(bigram)) {
        score += 5;
        matchedTerms.push(`"${bigram}"(phrase)`);
      }
    }

    if (indexed.titleText.includes(queryLower)) {
      score += 15;
      matchedTerms.push("(full-query-in-title)");
    }

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

// ============================================================
// RESPONSE FORMATTING
// ============================================================

export function formatResponse(article: Article, portalSlug: string = "commerceship-help"): string {
  const sentences = article.content
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.length > 10);

  const brief = sentences.slice(0, 3).join(" ");
  const answer = brief.length > 300 ? brief.substring(0, 297) + "..." : brief;

  const articleUrl = `https://help.commerceship.com/hc/${portalSlug}/articles/${article.slug}`;

  return [
    answer,
    "",
    `Read more: ${articleUrl}`,
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

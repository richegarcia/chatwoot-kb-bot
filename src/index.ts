import express from "express";
import { config } from "./config.js";
import { refreshArticles } from "./article-search.js";
import { handleWebhook } from "./message-handler.js";

const app = express();
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "chatwoot-kb-bot" });
});

// Chatwoot webhook endpoint
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    console.log(`Webhook received: event=${body.event} message_type=${body.message_type} content="${(body.content || "").substring(0, 80)}"`);
    await handleWebhook(body);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(200).json({ ok: true }); // Always 200 so Chatwoot doesn't retry
  }
});

// Manual article refresh
app.post("/refresh", async (_req, res) => {
  const count = await refreshArticles();
  res.json({ status: "refreshed", articles: count });
});

async function main() {
  if (!config.chatwootApiToken) {
    console.error("CHATWOOT_API_TOKEN is required");
    process.exit(1);
  }

  // Load articles on startup
  const count = await refreshArticles();
  console.log(`Loaded ${count} articles from portal "${config.portalSlug}"`);

  app.listen(config.port, () => {
    console.log(`chatwoot-kb-bot running on port ${config.port}`);
    console.log(`Webhook URL: http://localhost:${config.port}/webhook`);
    console.log(`Match threshold: ${config.matchThreshold}`);
    console.log(`Cooldown: ${config.cooldownSeconds}s`);
  });
}

main().catch(console.error);

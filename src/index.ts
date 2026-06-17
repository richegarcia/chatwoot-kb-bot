import express from "express";
import { config } from "./config.js";
import { refreshArticles } from "./article-search.js";
import { handleWebhook } from "./message-handler.js";
import { validateWebhookSignature } from "./safety.js";

const app = express();

// Raw body needed for HMAC validation, then parse JSON
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "chatwoot-kb-bot" });
});

// Chatwoot webhook endpoint
app.post("/webhook", async (req: any, res) => {
  try {
    // Validate webhook signature
    const signature = req.headers["x-chatwoot-signature"] as string | undefined;
    if (!validateWebhookSignature(req.rawBody || "", signature)) {
      console.warn("Webhook signature validation failed");
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

    const body = req.body;
    console.log(
      `Webhook received: event=${body.event} message_type=${body.message_type} content="${(body.content || "").substring(0, 80)}"`
    );
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
    console.log(
      `Safety: HMAC=${config.webhookSecret ? "on" : "off"}, maxMsg=${config.maxMessageLength}, contactRate=${config.maxContactMessagesPerMinute}/min`
    );
  });
}

main().catch(console.error);

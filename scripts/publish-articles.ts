/**
 * One-time script to create categories and publish starter articles
 * to the Chatwoot Help Center via API.
 *
 * Usage: npx tsx scripts/publish-articles.ts
 */

const BASE_URL = "https://support.commerceship.com/api/v1/accounts/1";
const API_TOKEN = process.env.CHATWOOT_API_TOKEN || "R5qacSmhw3fou8q4rrrqMNm5";
const ACCOUNT_ID = "1";
const PORTAL_SLUG = "commerceship-help";

const headers = {
  "Content-Type": "application/json",
  api_access_token: API_TOKEN,
};

// --- Categories ---

const categories = [
  { name: "Shipping & Orders", slug: "shipping-orders", description: "Shipping costs, automation, reconciliation, and order management." },
  { name: "Getting Started", slug: "getting-started", description: "Account setup, login, and first steps with CommerceShip." },
];

// --- Articles (only publishing 5, 6, 7 for now) ---

const articles = [
  {
    title: "Understanding Shipping Cost Differences",
    category: "Shipping & Orders",
    content: `<p>If you notice a difference between the rate you expected and the amount on your carrier invoice, here are the most common reasons.</p>

<h3>Dimensional (DIM) weight pricing</h3>
<p>Carriers charge based on whichever is greater: the actual weight or the dimensional weight. Dimensional weight is calculated from your package dimensions. If your package is large but light, the DIM weight may be higher than the actual weight, resulting in a higher charge.</p>

<h3>Residential delivery surcharge</h3>
<p>Carriers charge extra for deliveries to residential addresses. If an address that looks commercial is classified as residential by the carrier, you will see this surcharge.</p>

<h3>Address correction surcharge</h3>
<p>If the address on your label has errors (wrong ZIP code, missing apartment number), the carrier may correct it and charge an address correction fee.</p>

<h3>Peak and demand surcharges</h3>
<p>During busy shipping periods (holidays, major sales events), carriers add temporary surcharges on top of standard rates.</p>

<h3>Zone differences</h3>
<p>Shipping rates are based on the distance between origin and destination (zones). If the zone calculation differs from what you expected, the rate will differ.</p>

<h3>What to do</h3>
<p>Check the shipment details in CommerceShip to see the full cost breakdown including surcharges. If you believe there is an error, contact us through chat with your shipment ID and we will investigate.</p>`,
  },
  {
    title: "Setting Up Automation Rules",
    category: "Shipping & Orders",
    content: `<p>Automation rules let you set up if-then logic so orders are handled automatically without manual intervention.</p>

<h3>What you can automate</h3>
<ul>
<li>Assign a specific carrier or service based on order value, weight, or destination</li>
<li>Route orders to different warehouses based on delivery address</li>
<li>Set package dimensions automatically based on item type</li>
<li>Add confirmation requirements (signature, adult signature) for high-value orders</li>
</ul>

<h3>How to create a rule</h3>
<ol>
<li>Go to Settings > Automation.</li>
<li>Click New Rule.</li>
<li>Set your trigger (order created or order updated).</li>
<li>Add conditions using AND/OR logic. For example: "If order total is greater than $100 AND shipping state is California."</li>
<li>Set the action. For example: "Set carrier to FedEx, set service to FedEx Ground."</li>
<li>Save and enable the rule.</li>
</ol>

<h3>Tips</h3>
<ul>
<li>Rules run in the order you set them. Drag and drop to reorder.</li>
<li>Test your rules against sample orders before enabling them in production.</li>
<li>You can toggle rules on and off without deleting them.</li>
<li>Check the activity log to see when rules have run and whether they succeeded.</li>
</ul>

<p>Rules currently work on orders. If you need automation at the shipment or item level, let us know and we can discuss options for your workflow.</p>`,
  },
  {
    title: "How Reconciliation Works",
    category: "Shipping & Orders",
    content: `<p>Reconciliation is the process of comparing your carrier invoices against the rates you were quoted when you shipped. This helps you catch overcharges and understand your true shipping costs.</p>

<h3>What CommerceShip checks</h3>
<ul>
<li>Whether the billed amount matches the quoted rate</li>
<li>Surcharges that were added after the label was created (residential, DIM weight, address correction)</li>
<li>Duplicate charges or billing errors</li>
<li>Refund eligibility for late deliveries or service failures</li>
</ul>

<h3>How to use it</h3>
<ol>
<li>Upload or sync your carrier invoices in CommerceShip.</li>
<li>The system compares each invoice line item against your shipment records.</li>
<li>Discrepancies are flagged for your review.</li>
<li>You can file claims for overcharges or refunds directly from the dashboard.</li>
</ol>

<h3>What to look for</h3>
<ul>
<li>Surcharges that appear frequently may indicate data quality issues (bad addresses, incorrect package dimensions) that you can fix upstream.</li>
<li>Carrier billing errors are more common than most shippers realize. Regular reconciliation can recover 2-5% of shipping spend.</li>
</ul>

<p>If you have questions about a specific discrepancy, contact us with the shipment ID and invoice reference.</p>`,
  },
];

// --- API helpers ---

async function createCategory(name: string, slug: string, description: string): Promise<number> {
  const res = await fetch(
    `${BASE_URL}/portals/${PORTAL_SLUG}/categories`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ locale: "en", name, slug, description }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    // If category already exists, try to find it
    if (res.status === 422) {
      console.log(`  Category "${name}" may already exist, looking up...`);
      const listRes = await fetch(
        `${BASE_URL}/portals/${PORTAL_SLUG}/categories?locale=en`,
        { headers }
      );
      if (listRes.ok) {
        const data = await listRes.json();
        const cats = data.payload || data;
        const found = (Array.isArray(cats) ? cats : []).find(
          (c: any) => c.name === name
        );
        if (found) {
          console.log(`  Found existing category "${name}" (id: ${found.id})`);
          return found.id;
        }
      }
    }
    throw new Error(`Failed to create category "${name}": ${res.status} ${text}`);
  }
  const data = await res.json();
  const id = data.payload?.id || data.id;
  console.log(`  Created category "${name}" (id: ${id})`);
  return id;
}

async function createArticle(
  title: string,
  content: string,
  categoryId: number
): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/portals/${PORTAL_SLUG}/articles`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        title,
        content,
        category_id: categoryId,
        status: "published",
        author_id: 1,
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create article "${title}": ${res.status} ${text}`);
  }
  console.log(`  Published: "${title}"`);
}

// --- Main ---

async function main() {
  console.log("Creating categories...");
  const categoryIds: Record<string, number> = {};
  for (const cat of categories) {
    categoryIds[cat.name] = await createCategory(cat.name, cat.slug, cat.description);
  }

  console.log("\nPublishing articles...");
  for (const article of articles) {
    const catId = categoryIds[article.category];
    if (!catId) {
      console.error(`  No category found for "${article.category}", skipping "${article.title}"`);
      continue;
    }
    await createArticle(article.title, article.content, catId);
  }

  console.log("\nDone! Check https://help.commerceship.com");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

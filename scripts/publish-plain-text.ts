/**
 * Publish full KB as plain text (no HTML tags).
 * Chatwoot's Tiptap editor doesn't parse HTML pushed via API.
 *
 * Usage: npx tsx scripts/publish-plain-text.ts
 */

const BASE_URL = "https://support.commerceship.com/api/v1/accounts/1";
const API_TOKEN = "R5qacSmhw3fou8q4rrrqMNm5";
const PORTAL_SLUG = "commerceship-help";
const AUTHOR_ID = 3;

const headers = {
  "Content-Type": "application/json",
  api_access_token: API_TOKEN,
};

// ============================================================
// CATEGORIES (already exist, will look up IDs)
// ============================================================

const categoryNames = [
  "Getting Started", "Orders", "Shipping & Labels", "Tracking",
  "Carriers", "Rates & Rate Shopping", "Invoice Audit & Reconciliation",
  "Reports & Analytics", "Automation", "Account & Users",
  "Integrations", "AI & Agents",
];

// ============================================================
// ARTICLES — plain text, no HTML
// ============================================================

const articles: { title: string; category: string; content: string }[] = [

  // ── Getting Started ──────────────────────────────────────

  {
    title: "Getting Started with CommerceShip",
    category: "Getting Started",
    content: `CommerceShip is a shipping intelligence platform that helps you manage orders, compare carrier rates, generate labels, and track deliveries from a single dashboard.

What you can do

- Import orders from your ecommerce platform or enter them manually
- Compare rates across carriers including USPS, FedEx, UPS, and Canada Post
- Generate and print shipping labels
- Track shipments across all carriers in one view
- Set up automation rules to route orders automatically
- Audit carrier invoices and recover overcharges
- Run reports on shipping costs, delivery performance, and surcharges

First steps

1. Connect your carrier accounts. You will need your credentials or API keys for each carrier.
2. Import or create your first order.
3. Use rate shopping to compare carrier options and select the best one.
4. Generate a label and schedule a pickup or drop off your package.
5. Track your shipment from the dashboard.

If you need help at any point, use the chat widget on our website or email support@commerceship.com.`,
  },

  {
    title: "Your First Shipment",
    category: "Getting Started",
    content: `This guide walks you through creating and shipping your first order in CommerceShip.

Step 1: Create or import an order

You can import orders from a connected ecommerce platform (like Shopify) or create one manually. Each order needs a ship-to address and at least one item with weight and dimensions.

Step 2: Rate shop

Once your order is ready, use rate shopping to compare prices across your connected carriers. CommerceShip shows rates side by side so you can choose based on cost, speed, or carrier preference.

Step 3: Generate a label

Select your preferred rate and generate a shipping label. Labels can be printed directly or downloaded as PDF.

Step 4: Create a manifest

At the end of the day, create a manifest to close out your shipments. This notifies the carrier that packages are ready for pickup.

Step 5: Track

After the carrier scans your package, tracking updates appear automatically in CommerceShip. You can monitor all shipments from the dashboard.

If something does not look right at any step, contact us through chat and we will help you troubleshoot.`,
  },

  {
    title: "Contacting Support",
    category: "Getting Started",
    content: `There are several ways to get help with CommerceShip.

Live chat

Click the chat widget on commerceship.com. This is the fastest way to reach us during business hours (Monday through Friday, 9am to 6pm PT).

Email

Send an email to support@commerceship.com. We respond within one business day.

Help center

Browse articles at help.commerceship.com for answers to common questions about shipping, rates, automation, and more.

When contacting us, include:

- Your account email
- The shipment ID or order number (if applicable)
- A description of what you expected vs. what happened
- Screenshots if the issue is visual

This helps us resolve your issue faster.`,
  },

  // ── Orders ───────────────────────────────────────────────

  {
    title: "Importing and Managing Orders",
    category: "Orders",
    content: `CommerceShip centralizes orders from all your sales channels into one place.

Ways to import orders

Ecommerce integration: Connect your Shopify store (or other supported platform) to automatically sync orders.

CSV upload: Upload orders in bulk using a CSV file.

Manual entry: Create individual orders directly in CommerceShip.

API: Push orders programmatically using the CommerceShip API.

Order information

Each order includes a ship-to address, item details (weight, dimensions, quantity), and optionally a ship-from location if you have multiple warehouses.

Order status

Orders move through stages from import to fulfillment. You can track status from the orders page and filter by status, date, carrier, or customer.

If you need to connect a sales channel that is not listed, let us know and we can explore integration options.`,
  },

  {
    title: "Order Routing and Fulfillment",
    category: "Orders",
    content: `CommerceShip can automatically route orders to the right carrier, service, and warehouse based on rules you define.

How routing works

When an order is created, CommerceShip evaluates it against your automation rules. Rules can assign a carrier, service level, ship-from location, or package type based on order attributes like destination, weight, value, or item type.

Multi-location fulfillment

If you ship from multiple warehouses or use third-party logistics (3PL) providers, you can set up locations in CommerceShip and route orders to the closest or most cost-effective facility.

Manual vs. automated

You can route orders manually by selecting a carrier and service for each one, or set up automation rules to handle routing automatically. Most customers start manually and add rules as patterns emerge.

See the Automation category for details on setting up routing rules.`,
  },

  // ── Shipping & Labels ────────────────────────────────────

  {
    title: "Generating Shipping Labels",
    category: "Shipping & Labels",
    content: `After selecting a rate for your order, you can generate a shipping label directly in CommerceShip.

Label basics

- Labels are generated for US domestic and outbound international shipments.
- Supported carriers include USPS, FedEx, UPS, and Canada Post.
- Labels can be printed directly or downloaded as PDF.
- Some carriers support logo and data customization on labels.

International labels

For international shipments, CommerceShip generates the label and required customs forms. You will need to provide item descriptions, HS codes, and declared values for customs clearance.

Address verification

Before generating a label, CommerceShip verifies the ship-to address using USPS address validation. This catches errors like wrong ZIP codes or missing apartment numbers before they result in surcharges or failed deliveries.

If address verification flags an issue, review the suggested correction before proceeding.`,
  },

  {
    title: "Batch Processing and Manifests",
    category: "Shipping & Labels",
    content: `For high-volume shipping, CommerceShip supports batch processing and end-of-day manifests.

Batch processing

Process multiple shipments at once instead of one at a time. Select a group of orders, apply a carrier and service, and generate all labels in a single batch. This significantly reduces manual effort for operations teams handling hundreds of shipments daily.

Manifests

A manifest (also called an end-of-day close) is a summary document submitted to the carrier at the end of the shipping day. It tells the carrier which packages are ready for pickup.

To create a manifest:

1. Go to the manifests page.
2. Select the carrier and date.
3. Review the shipments included.
4. Submit the manifest.

Most carriers require a manifest before pickup. Create one at the end of each shipping day.`,
  },

  {
    title: "International and Cross-Border Shipping",
    category: "Shipping & Labels",
    content: `CommerceShip supports international shipping for US outbound shipments and Canada domestic and cross-border services.

Supported international carriers

USPS: Priority Mail International, First-Class Package International Service

FedEx: International Priority, International Economy, and other global services

UPS: Worldwide Express, Worldwide Saver, Standard to Canada/Mexico

Canada Post: Domestic services within Canada and cross-border US-Canada

UniUni: Canada domestic and US-to-Canada delivery

Customs forms

International shipments require customs documentation. CommerceShip generates the required forms when you create an international label. You will need to provide item descriptions, quantities, values, and HS (Harmonized System) codes.

If you ship to countries or regions not currently supported, let us know and we can discuss options for your routes.`,
  },

  // ── Tracking ─────────────────────────────────────────────

  {
    title: "Tracking Your Shipments",
    category: "Tracking",
    content: `CommerceShip provides unified tracking across all your carriers in a single dashboard.

How tracking works

After a shipping label is generated and the carrier scans the package, tracking events appear automatically in CommerceShip. Events are standardized across carriers so you see consistent status updates regardless of which carrier is handling the shipment.

What you can track

- Shipments created in CommerceShip
- External tracking numbers imported from other systems
- Orders synced from connected ecommerce platforms

Tracking statuses

Shipments move through stages like label created, in transit, out for delivery, and delivered. CommerceShip normalizes these statuses across carriers so you do not need to learn each carrier's terminology.

Sales channel sync

Tracking data is pushed back to your connected sales channels automatically. When a shipment is delivered, your ecommerce platform is updated without manual intervention.`,
  },

  {
    title: "Delivery Issues and Delays",
    category: "Tracking",
    content: `If a shipment is delayed or not delivered as expected, here is what to check.

Common causes of delays

Weather or natural events: Carriers may experience delays during severe weather. This is outside anyone's control.

Address issues: Incorrect or incomplete addresses can cause delivery attempts to fail. Check the address verification results for any flags.

Carrier processing delays: High-volume periods (holidays, peak season) can slow carrier networks.

Customs clearance: International shipments may be held at customs for inspection or missing documentation.

What to do

1. Check the tracking details in CommerceShip for the latest status and any exception messages.
2. If the shipment shows "delivery attempted," verify the address is correct.
3. For shipments stuck in transit beyond the expected delivery date, contact us with the shipment ID and we will investigate with the carrier.

For eligible late deliveries, you may be able to file a refund claim. See the Invoice Audit and Reconciliation section for details.`,
  },

  // ── Carriers ─────────────────────────────────────────────

  {
    title: "Supported Carriers",
    category: "Carriers",
    content: `CommerceShip integrates with major US and Canadian carriers, plus regional and aggregator options.

Direct carrier integrations

USPS: Priority Mail, Ground Advantage, Priority Mail Express, Parcel Select, and more. Full capabilities including rating, labels, tracking, manifests, surcharges, and refund claims. CommerceShip discounts available.

FedEx: Ground, Home Delivery, Express Saver, 2Day, Priority Overnight, International Priority, and more (30 services). Rating, labels, tracking, manifests, and surcharges.

UPS: Ground, 3 Day Select, 2nd Day Air, Next Day Air, Worldwide Express, and more (12 services). Rating, labels, tracking, manifests, and surcharges.

Canada Post: Regular Parcel, Xpresspost, Priority, Expedited Parcel (8 services). Rating, labels, and manifests.

UniUni: Canada domestic and US-to-Canada. Rating and labels.

Carrier aggregators

Through EasyPost, CommerceShip connects to 71+ additional carriers including PostNL, Maersk, DHL, OnTrac, and regional last-mile providers. This extends your carrier options without needing separate accounts for each.

BYO carrier account

Use your own negotiated carrier rates and accounts. CommerceShip connects to your existing carrier contracts so you keep your discounts.

USPS discounts

CommerceShip offers USPS discounts through our carrier partnership. These are available automatically when you ship with USPS through CommerceShip.

If you ship with a carrier not listed here, let us know and we can explore integration options.`,
  },

  {
    title: "Connecting a Carrier Account",
    category: "Carriers",
    content: `To start shipping with a carrier, you need to connect your carrier account to CommerceShip.

Before you start

Make sure you have your carrier credentials ready. Each carrier has its own authentication method. You will typically need your account number and either API credentials or login information from the carrier's portal.

General steps

1. Navigate to carrier settings in CommerceShip.
2. Select the carrier you want to add.
3. Enter your credentials as prompted.
4. CommerceShip will verify the connection.
5. Once connected, the carrier's rates and services will appear when you rate shop.

Troubleshooting

If the connection fails, verify your credentials work in the carrier's own portal first.

Check the carrier's status page for any ongoing outages.

For USPS, make sure you are using your EPS (Enterprise Payment System) credentials, not your regular USPS.com consumer account.

If you are still having trouble, contact us through chat with the carrier name and any error messages you see.`,
  },

  // ── Rates & Rate Shopping ────────────────────────────────

  {
    title: "Comparing Rates Across Carriers",
    category: "Rates & Rate Shopping",
    content: `Rate shopping lets you compare prices across all your connected carriers before selecting one for a shipment.

How rate shopping works

When you are ready to ship an order, CommerceShip queries all connected carriers for their current rates based on the package dimensions, weight, origin, and destination. Results are displayed side by side so you can choose based on cost, speed, or carrier preference.

What affects rates

Package weight and dimensions: Carriers charge by actual weight or dimensional (DIM) weight, whichever is greater.

Origin and destination zones: Rates increase with distance.

Service level: Express services cost more than ground.

Carrier discounts: Your negotiated rates and CommerceShip partner discounts are applied automatically.

Shipment comparison

For a specific shipment, use the comparison view to see a detailed side-by-side breakdown of rates, estimated transit times, and surcharges across carriers.`,
  },

  {
    title: "Package Presets",
    category: "Rates & Rate Shopping",
    content: `Package presets save frequently used package dimensions and weights so you can apply them with one click instead of entering them manually each time.

When to use presets

If you regularly ship in the same box sizes (for example, a small flat rate box, a medium carton, or a branded mailer), create a preset for each. This speeds up order processing and reduces errors from manual dimension entry.

What a preset includes

- Package name (for easy identification)
- Length, width, and height
- Default weight (optional)

When creating a shipment, select a preset instead of typing dimensions manually. You can always override the preset values for individual shipments.`,
  },

  {
    title: "Understanding Carrier Discounts",
    category: "Rates & Rate Shopping",
    content: `CommerceShip offers multiple ways to reduce your shipping costs through carrier discounts.

CommerceShip partner discounts

USPS discounts are available automatically when you ship through CommerceShip. These are applied to your rates without any additional setup.

Your own negotiated rates

If you have negotiated rates directly with FedEx, UPS, or other carriers, connect your own carrier account to CommerceShip. Your contracted rates will be used for rate shopping and label generation.

Carrier contract import

CommerceShip can import and interpret your carrier contracts, including service tiers, discount structures, and rate schedules. This lets you model scenarios like comparing your current contract against published rates or evaluating a new carrier proposal.

Rate scheduling

When carrier rates change (for example, during a General Rate Increase), you can schedule new rates to activate on a specific date. This lets you prepare in advance and see the cost impact before the change takes effect.`,
  },

  // ── Invoice Audit & Reconciliation ───────────────────────

  {
    title: "Understanding Shipping Cost Differences",
    category: "Invoice Audit & Reconciliation",
    content: `If you notice a difference between the rate you expected and the amount on your carrier invoice, here are the most common reasons.

Dimensional (DIM) weight pricing

Carriers charge based on whichever is greater: the actual weight or the dimensional weight. Dimensional weight is calculated from your package dimensions. If your package is large but light, the DIM weight may be higher than the actual weight, resulting in a higher charge.

Residential delivery surcharge

Carriers charge extra for deliveries to residential addresses. If an address that looks commercial is classified as residential by the carrier, you will see this surcharge.

Address correction surcharge

If the address on your label has errors (wrong ZIP code, missing apartment number), the carrier may correct it and charge an address correction fee.

Peak and demand surcharges

During busy shipping periods (holidays, major sales events), carriers add temporary surcharges on top of standard rates.

Zone differences

Shipping rates are based on the distance between origin and destination (zones). If the zone calculation differs from what you expected, the rate will differ.

What to do

Check the shipment details in CommerceShip to see the full cost breakdown including surcharges. If you believe there is an error, contact us through chat with your shipment ID and we will investigate.`,
  },

  {
    title: "How Reconciliation Works",
    category: "Invoice Audit & Reconciliation",
    content: `Reconciliation is the process of comparing your carrier invoices against the rates you were quoted when you shipped. This helps you catch overcharges and understand your true shipping costs.

What CommerceShip checks

- Whether the billed amount matches the quoted rate
- Surcharges that were added after the label was created (residential, DIM weight, address correction)
- Duplicate charges or billing errors
- Refund eligibility for late deliveries or service failures

How to use it

1. Import your carrier invoices into CommerceShip.
2. The system compares each invoice line item against your shipment records.
3. Discrepancies are flagged for your review.
4. You can file claims for overcharges or refunds directly from the platform.

What to look for

Surcharges that appear frequently may indicate data quality issues (bad addresses, incorrect package dimensions) that you can fix upstream.

Carrier billing errors are more common than most shippers realize. Regular reconciliation can recover 2-5% of shipping spend.

If you have questions about a specific discrepancy, contact us with the shipment ID and invoice reference.`,
  },

  {
    title: "Filing Refund Claims",
    category: "Invoice Audit & Reconciliation",
    content: `When CommerceShip detects an overcharge or service failure, you can file a refund claim with the carrier.

Common claim types

Late delivery: The carrier guaranteed a delivery date and missed it. Many carriers offer refunds for guaranteed service failures.

Duplicate charges: The same shipment was billed more than once.

Overcharges: The billed amount exceeds what should have been charged based on the shipment details and your contract.

Accessorial errors: Surcharges were applied incorrectly (for example, a residential surcharge on a commercial address).

How to file a claim

1. Review flagged discrepancies in the reconciliation results.
2. Select the shipments you want to dispute.
3. Submit the claim through CommerceShip.
4. Track claim status and resolution from the platform.

We recommend reviewing reconciliation results weekly to catch issues while they are still within carrier claim windows.`,
  },

  // ── Reports & Analytics ──────────────────────────────────

  {
    title: "Dashboards and Reports",
    category: "Reports & Analytics",
    content: `CommerceShip includes pre-built dashboards and customizable reports to give you visibility into your shipping operations.

Pre-built dashboards

Dashboards provide real-time views of your key metrics including order volume, shipment status, carrier service performance, transit times, delivery rates, charges, surcharges, and savings.

Filtering and segmentation

Slice your data by customer, carrier, service level, time period, or other dimensions. This lets you isolate specific issues or compare performance across different segments of your business.

Period-over-period comparison

Compare metrics across time periods to track trends. For example, compare this month's shipping costs against last month, or this quarter's on-time delivery rate against the previous quarter.

Scheduled reports

Set up recurring reports that are generated and delivered automatically on a schedule. Reports can be sent via email or to other destinations.

Enterprise reports

Enterprise accounts have access to additional reporting including custom profitability reports, accounting exports, and margin analysis.`,
  },

  {
    title: "AI-Generated Insights",
    category: "Reports & Analytics",
    content: `CommerceShip uses AI to surface insights about your shipping operations automatically.

Weekly AI reports

Each week, CommerceShip generates a report with AI-written analysis of your shipping data. The report highlights week-over-week changes, unusual patterns, cost trends, and areas that may need attention.

Spend analytics

Identify hidden costs and optimization opportunities across your shipping spend. CommerceShip analyzes your carrier invoices to find patterns in surcharges, spot billing anomalies, and benchmark carrier performance against each other.

Recommendations

Based on your shipping patterns, CommerceShip provides data-driven suggestions for the best carriers and service levels. These recommendations factor in cost, transit time, and reliability to help you make better shipping decisions.`,
  },

  // ── Automation ───────────────────────────────────────────

  {
    title: "Setting Up Automation Rules",
    category: "Automation",
    content: `Automation rules let you set up if-then logic so orders are handled automatically without manual intervention.

What you can automate

- Assign a specific carrier or service based on order value, weight, or destination
- Route orders to different warehouses based on delivery address
- Set package dimensions automatically based on item type
- Add confirmation requirements (signature, adult signature) for high-value orders

How to create a rule

1. Navigate to the automation page.
2. Click New Rule.
3. Set your trigger (order created or order updated).
4. Add conditions using AND/OR logic. For example: "If order total is greater than $100 AND shipping state is California."
5. Set the action. For example: "Set carrier to FedEx, set service to FedEx Ground."
6. Save and enable the rule.

Tips

- Rules run in the order you set them. Drag and drop to reorder.
- Test your rules against sample orders before enabling them in production.
- You can toggle rules on and off without deleting them.
- Check the activity log to see when rules have run and whether they succeeded.

Rules currently work on orders. If you need automation at the shipment or item level, let us know and we can discuss options for your workflow.`,
  },

  {
    title: "Automation Tips and Best Practices",
    category: "Automation",
    content: `Get the most out of automation rules with these practices.

Start simple

Begin with one or two rules that handle your most common shipping scenarios. For example, a rule that assigns USPS Ground Advantage to all orders under 1 pound. Add complexity as you learn how rules interact.

Use rule priority

Rules fire in order from top to bottom. Put your most specific rules first and general fallback rules last. For example, put "If destination is Alaska, use USPS Priority" above "If weight is under 5 lbs, use USPS Ground Advantage."

Test before enabling

Use the test feature to run rules against sample orders before turning them on. This catches logic errors without affecting real shipments.

Review the activity log

Periodically check the activity log to see which rules are firing, which are not, and whether any are producing unexpected results. If a rule has not fired in 30 days, consider whether it is still needed.

Avoid overlapping rules

If two rules can match the same order, only the first one wins. Review your rule list to make sure earlier rules are not blocking later ones unintentionally.`,
  },

  // ── Account & Users ──────────────────────────────────────

  {
    title: "Managing Your Account",
    category: "Account & Users",
    content: `Your CommerceShip account is where you manage your profile, security settings, and billing.

Profile

Update your name, email, and contact information from your account settings.

Two-factor authentication (2FA)

For added security, enable 2FA in your account settings. When enabled, you will need to enter a verification code sent to your phone each time you log in. We recommend enabling 2FA for all accounts, especially those with admin access.

Password

Change your password in account settings. If you forgot your password, use the "Forgot password" link on the login page to receive a reset email.

API keys

If you need to integrate CommerceShip with other systems, you can generate API keys in your account settings. API keys provide programmatic access to the CommerceShip API.

Billing and subscription

View your current plan, payment methods, and billing history from the billing section. You can manage your subscription and update payment details there.`,
  },

  {
    title: "Adding Team Members and Roles",
    category: "Account & Users",
    content: `CommerceShip uses role-based access control (RBAC) so you can manage what each team member can see and do.

Inviting a team member

1. Go to user management in your account settings.
2. Click Invite User.
3. Enter their email address and select a role.
4. They will receive an email invitation to create their account.

Available roles

CommerceShip has several roles that control access to different parts of the platform. Roles range from full administrative access to view-only or function-specific access (such as operations, finance, or support). The role you assign determines which pages and actions the team member can use.

Changing roles

Admins can change a user's role at any time from the user management page. Permission changes take effect on the user's next login.

Sub-accounts

For enterprise customers managing multiple business units or clients, CommerceShip supports account hierarchies with sub-accounts. Each sub-account has its own users and data, with the parent account maintaining oversight.

If you need a custom role configuration or have questions about permissions, contact us and we can discuss options for your team structure.`,
  },

  // ── Integrations ─────────────────────────────────────────

  {
    title: "Connecting Your Ecommerce Platform",
    category: "Integrations",
    content: `CommerceShip integrates with ecommerce platforms to automatically sync orders, customers, and tracking data.

Shopify

CommerceShip has a dedicated Shopify app. Once installed, orders sync automatically from your Shopify store. When you ship an order in CommerceShip, tracking information is pushed back to Shopify and your customers are notified.

Other platforms

CommerceShip supports connections to additional ecommerce platforms, marketplaces, WMS, OMS, and ERP systems through our integrations module.

CSV import

If your platform is not directly supported, you can import orders via CSV. CommerceShip supports field mapping so you can match your CSV columns to the correct order fields.

API

For custom integrations, use the CommerceShip RESTful JSON API to push orders, pull tracking data, and manage shipments programmatically.

If you need to connect a platform not listed here, let us know and we can explore integration options for your setup.`,
  },

  {
    title: "Using the CommerceShip API",
    category: "Integrations",
    content: `The CommerceShip API gives you programmatic access to manage orders, shipments, rates, tracking, and more.

Getting started with the API

1. Generate an API key from your account settings.
2. Use the API key in the Authorization header of your requests.
3. The API uses RESTful JSON format.

What you can do with the API

- Create and manage orders
- Get rate quotes across carriers
- Generate shipping labels
- Retrieve tracking information
- Manage carrier configurations
- Access reports and analytics data

Webhooks

CommerceShip supports webhooks to notify your systems when events occur (for example, when a shipment status changes or an order is fulfilled). Configure webhook endpoints in your account settings.

For API documentation and examples, contact us and we will provide access to the developer resources.`,
  },

  // ── AI & Agents ──────────────────────────────────────────

  {
    title: "AI-Powered Chat and Agents",
    category: "AI & Agents",
    content: `CommerceShip includes AI-powered tools that help you manage shipping operations more efficiently.

AI chat

Ask questions about your shipments, costs, tracking, and operations in plain language. The AI assistant can look up shipment details, explain cost breakdowns, and help you find information without navigating through multiple pages.

Specialized agents

CommerceShip has specialized AI agents focused on specific domains:

Reconciliation agent: Helps analyze carrier invoices, detect discrepancies, and identify savings opportunities.

Contracts agent: Assists with carrier contract analysis and rate optimization.

Support agent: Helps troubleshoot shipping issues and answer operational questions.

Agent memory

AI agents remember context from past interactions so you do not need to repeat information. The more you use the agents, the more helpful they become for your specific shipping patterns.

Multi-model support

CommerceShip supports multiple AI providers (Anthropic and OpenAI) so you can choose the best model for your needs.`,
  },

  {
    title: "MCP and External Integrations for AI",
    category: "AI & Agents",
    content: `CommerceShip supports the Model Context Protocol (MCP), which lets AI assistants connect directly to your shipping data.

What is MCP?

MCP is a standard protocol that allows AI tools to read and interact with external data sources. CommerceShip provides an MCP server that AI assistants (like Claude or ChatGPT) can connect to for real-time access to your shipping, order, and cost data.

What you can do with MCP

- Query shipment status and tracking from an AI assistant
- Get rate quotes and cost analysis through natural language
- Review order details and fulfillment status
- Analyze spending patterns and carrier performance

Safety controls

High-risk actions (like generating labels, processing refunds, or triggering batch operations) require explicit approval before the AI can execute them. This prevents accidental changes while still giving you the speed of AI-assisted operations.

If you are interested in connecting CommerceShip to your AI workflows, contact us to discuss setup options.`,
  },

];

// ============================================================
// API HELPERS
// ============================================================

async function getCategoryIds(): Promise<Record<string, number>> {
  const res = await fetch(
    `${BASE_URL}/portals/${PORTAL_SLUG}/categories?locale=en`,
    { headers }
  );
  if (!res.ok) throw new Error(`Failed to list categories: ${res.status}`);
  const data = await res.json();
  const cats = data.payload || data;
  const map: Record<string, number> = {};
  for (const c of Array.isArray(cats) ? cats : []) {
    map[c.name] = c.id;
  }
  return map;
}

async function createArticle(title: string, content: string, categoryId: number): Promise<void> {
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
        author_id: AUTHOR_ID,
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed: "${title}": ${res.status} ${text}`);
  }
  console.log(`  Published: "${title}"`);
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log("Looking up categories...");
  const categoryIds = await getCategoryIds();
  console.log(`  Found ${Object.keys(categoryIds).length} categories\n`);

  console.log(`Publishing ${articles.length} articles (plain text)...`);
  let count = 0;
  for (const article of articles) {
    const catId = categoryIds[article.category];
    if (!catId) {
      console.error(`  No category for "${article.category}", skipping "${article.title}"`);
      continue;
    }
    await createArticle(article.title, article.content, catId);
    count++;
  }

  console.log(`\nDone! ${count} articles published.`);
  console.log("Check https://help.commerceship.com");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

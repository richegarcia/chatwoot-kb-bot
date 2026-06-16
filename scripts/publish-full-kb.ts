/**
 * Publish full KB: 12 categories + ~28 articles to Chatwoot Help Center.
 * Moves existing articles into correct categories.
 *
 * Usage: npx tsx scripts/publish-full-kb.ts
 */

const BASE_URL = "https://support.commerceship.com/api/v1/accounts/1";
const API_TOKEN = "R5qacSmhw3fou8q4rrrqMNm5";
const PORTAL_SLUG = "commerceship-help";
const AUTHOR_ID = 3; // "Customer Support" agent

const headers = {
  "Content-Type": "application/json",
  api_access_token: API_TOKEN,
};

// ============================================================
// CATEGORIES
// ============================================================

const categories = [
  { name: "Getting Started", slug: "getting-started", description: "First steps with CommerceShip. Setup, onboarding, and your first shipment." },
  { name: "Orders", slug: "orders", description: "Importing, routing, and managing orders." },
  { name: "Shipping & Labels", slug: "shipping-labels", description: "Label generation, batch processing, manifests, and international shipping." },
  { name: "Tracking", slug: "tracking", description: "Shipment tracking, delivery status, and notifications." },
  { name: "Carriers", slug: "carriers", description: "Connecting carrier accounts, supported carriers, and carrier settings." },
  { name: "Rates & Rate Shopping", slug: "rates", description: "Comparing rates, package presets, carrier discounts, and cost optimization." },
  { name: "Invoice Audit & Reconciliation", slug: "invoice-audit", description: "Carrier invoice import, reconciliation, refund claims, and spend analytics." },
  { name: "Reports & Analytics", slug: "reports", description: "Dashboards, scheduled reports, and AI-generated insights." },
  { name: "Automation", slug: "automation", description: "Rule-based automation for orders and shipping workflows." },
  { name: "Account & Users", slug: "account", description: "Login, security, user management, and roles." },
  { name: "Integrations", slug: "integrations", description: "Ecommerce platforms, APIs, CSV imports, and connected tools." },
  { name: "AI & Agents", slug: "ai-agents", description: "AI-powered chat, specialized agents, and intelligent automation." },
];

// ============================================================
// ARTICLES
// ============================================================

const articles: { title: string; category: string; content: string }[] = [

  // ── Getting Started ──────────────────────────────────────

  {
    title: "Getting Started with CommerceShip",
    category: "Getting Started",
    content: `<p>CommerceShip is a shipping intelligence platform that helps you manage orders, compare carrier rates, generate labels, and track deliveries from a single dashboard.</p>

<h3>What you can do</h3>
<ul>
<li>Import orders from your ecommerce platform or enter them manually</li>
<li>Compare rates across carriers including USPS, FedEx, UPS, and Canada Post</li>
<li>Generate and print shipping labels</li>
<li>Track shipments across all carriers in one view</li>
<li>Set up automation rules to route orders automatically</li>
<li>Audit carrier invoices and recover overcharges</li>
<li>Run reports on shipping costs, delivery performance, and surcharges</li>
</ul>

<h3>First steps</h3>
<ol>
<li>Connect your carrier accounts. You will need your credentials or API keys for each carrier.</li>
<li>Import or create your first order.</li>
<li>Use rate shopping to compare carrier options and select the best one.</li>
<li>Generate a label and schedule a pickup or drop off your package.</li>
<li>Track your shipment from the dashboard.</li>
</ol>

<p>If you need help at any point, use the chat widget on our website or email support@commerceship.com.</p>`,
  },

  {
    title: "Your First Shipment",
    category: "Getting Started",
    content: `<p>This guide walks you through creating and shipping your first order in CommerceShip.</p>

<h3>Step 1: Create or import an order</h3>
<p>You can import orders from a connected ecommerce platform (like Shopify) or create one manually. Each order needs a ship-to address and at least one item with weight and dimensions.</p>

<h3>Step 2: Rate shop</h3>
<p>Once your order is ready, use rate shopping to compare prices across your connected carriers. CommerceShip shows rates side by side so you can choose based on cost, speed, or carrier preference.</p>

<h3>Step 3: Generate a label</h3>
<p>Select your preferred rate and generate a shipping label. Labels can be printed directly or downloaded as PDF.</p>

<h3>Step 4: Create a manifest</h3>
<p>At the end of the day, create a manifest to close out your shipments. This notifies the carrier that packages are ready for pickup.</p>

<h3>Step 5: Track</h3>
<p>After the carrier scans your package, tracking updates appear automatically in CommerceShip. You can monitor all shipments from the dashboard.</p>

<p>If something does not look right at any step, contact us through chat and we will help you troubleshoot.</p>`,
  },

  {
    title: "Contacting Support",
    category: "Getting Started",
    content: `<p>There are several ways to get help with CommerceShip.</p>

<h3>Live chat</h3>
<p>Click the chat widget on commerceship.com. This is the fastest way to reach us during business hours (Monday through Friday, 9am to 6pm PT).</p>

<h3>Email</h3>
<p>Send an email to support@commerceship.com. We respond within one business day.</p>

<h3>Help center</h3>
<p>Browse articles at help.commerceship.com for answers to common questions about shipping, rates, automation, and more.</p>

<h3>When contacting us, include</h3>
<ul>
<li>Your account email</li>
<li>The shipment ID or order number (if applicable)</li>
<li>A description of what you expected vs. what happened</li>
<li>Screenshots if the issue is visual</li>
</ul>

<p>This helps us resolve your issue faster.</p>`,
  },

  // ── Orders ───────────────────────────────────────────────

  {
    title: "Importing and Managing Orders",
    category: "Orders",
    content: `<p>CommerceShip centralizes orders from all your sales channels into one place.</p>

<h3>Ways to import orders</h3>
<ul>
<li><strong>Ecommerce integration:</strong> Connect your Shopify store (or other supported platform) to automatically sync orders.</li>
<li><strong>CSV upload:</strong> Upload orders in bulk using a CSV file.</li>
<li><strong>Manual entry:</strong> Create individual orders directly in CommerceShip.</li>
<li><strong>API:</strong> Push orders programmatically using the CommerceShip API.</li>
</ul>

<h3>Order information</h3>
<p>Each order includes a ship-to address, item details (weight, dimensions, quantity), and optionally a ship-from location if you have multiple warehouses.</p>

<h3>Order status</h3>
<p>Orders move through stages from import to fulfillment. You can track status from the orders page and filter by status, date, carrier, or customer.</p>

<p>If you need to connect a sales channel that is not listed, let us know and we can explore integration options.</p>`,
  },

  {
    title: "Order Routing and Fulfillment",
    category: "Orders",
    content: `<p>CommerceShip can automatically route orders to the right carrier, service, and warehouse based on rules you define.</p>

<h3>How routing works</h3>
<p>When an order is created, CommerceShip evaluates it against your automation rules. Rules can assign a carrier, service level, ship-from location, or package type based on order attributes like destination, weight, value, or item type.</p>

<h3>Multi-location fulfillment</h3>
<p>If you ship from multiple warehouses or use third-party logistics (3PL) providers, you can set up locations in CommerceShip and route orders to the closest or most cost-effective facility.</p>

<h3>Manual vs. automated</h3>
<p>You can route orders manually by selecting a carrier and service for each one, or set up automation rules to handle routing automatically. Most customers start manually and add rules as patterns emerge.</p>

<p>See the Automation category for details on setting up routing rules.</p>`,
  },

  // ── Shipping & Labels ────────────────────────────────────

  {
    title: "Generating Shipping Labels",
    category: "Shipping & Labels",
    content: `<p>After selecting a rate for your order, you can generate a shipping label directly in CommerceShip.</p>

<h3>Label basics</h3>
<ul>
<li>Labels are generated for US domestic and outbound international shipments.</li>
<li>Supported carriers include USPS, FedEx, UPS, and Canada Post.</li>
<li>Labels can be printed directly or downloaded as PDF.</li>
<li>Some carriers support logo and data customization on labels.</li>
</ul>

<h3>International labels</h3>
<p>For international shipments, CommerceShip generates the label and required customs forms. You will need to provide item descriptions, HS codes, and declared values for customs clearance.</p>

<h3>Address verification</h3>
<p>Before generating a label, CommerceShip verifies the ship-to address using USPS address validation. This catches errors like wrong ZIP codes or missing apartment numbers before they result in surcharges or failed deliveries.</p>

<p>If address verification flags an issue, review the suggested correction before proceeding.</p>`,
  },

  {
    title: "Batch Processing and Manifests",
    category: "Shipping & Labels",
    content: `<p>For high-volume shipping, CommerceShip supports batch processing and end-of-day manifests.</p>

<h3>Batch processing</h3>
<p>Process multiple shipments at once instead of one at a time. Select a group of orders, apply a carrier and service, and generate all labels in a single batch. This significantly reduces manual effort for operations teams handling hundreds of shipments daily.</p>

<h3>Manifests</h3>
<p>A manifest (also called an end-of-day close) is a summary document submitted to the carrier at the end of the shipping day. It tells the carrier which packages are ready for pickup.</p>

<p>To create a manifest:</p>
<ol>
<li>Go to the manifests page.</li>
<li>Select the carrier and date.</li>
<li>Review the shipments included.</li>
<li>Submit the manifest.</li>
</ol>

<p>Most carriers require a manifest before pickup. Create one at the end of each shipping day.</p>`,
  },

  {
    title: "International and Cross-Border Shipping",
    category: "Shipping & Labels",
    content: `<p>CommerceShip supports international shipping for US outbound shipments and Canada domestic and cross-border services.</p>

<h3>Supported international carriers</h3>
<ul>
<li><strong>USPS:</strong> Priority Mail International, First-Class Package International Service</li>
<li><strong>FedEx:</strong> International Priority, International Economy, and other global services</li>
<li><strong>UPS:</strong> Worldwide Express, Worldwide Saver, Standard to Canada/Mexico</li>
<li><strong>Canada Post:</strong> Domestic services within Canada and cross-border US-Canada</li>
<li><strong>UniUni:</strong> Canada domestic and US-to-Canada delivery</li>
</ul>

<h3>Customs forms</h3>
<p>International shipments require customs documentation. CommerceShip generates the required forms when you create an international label. You will need to provide item descriptions, quantities, values, and HS (Harmonized System) codes.</p>

<p>If you ship to countries or regions not currently supported, let us know and we can discuss options for your routes.</p>`,
  },

  // ── Tracking ─────────────────────────────────────────────

  {
    title: "Tracking Your Shipments",
    category: "Tracking",
    content: `<p>CommerceShip provides unified tracking across all your carriers in a single dashboard.</p>

<h3>How tracking works</h3>
<p>After a shipping label is generated and the carrier scans the package, tracking events appear automatically in CommerceShip. Events are standardized across carriers so you see consistent status updates regardless of which carrier is handling the shipment.</p>

<h3>What you can track</h3>
<ul>
<li>Shipments created in CommerceShip</li>
<li>External tracking numbers imported from other systems</li>
<li>Orders synced from connected ecommerce platforms</li>
</ul>

<h3>Tracking statuses</h3>
<p>Shipments move through stages like label created, in transit, out for delivery, and delivered. CommerceShip normalizes these statuses across carriers so you do not need to learn each carrier's terminology.</p>

<h3>Sales channel sync</h3>
<p>Tracking data is pushed back to your connected sales channels automatically. When a shipment is delivered, your ecommerce platform is updated without manual intervention.</p>`,
  },

  {
    title: "Delivery Issues and Delays",
    category: "Tracking",
    content: `<p>If a shipment is delayed or not delivered as expected, here is what to check.</p>

<h3>Common causes of delays</h3>
<ul>
<li><strong>Weather or natural events:</strong> Carriers may experience delays during severe weather. This is outside anyone's control.</li>
<li><strong>Address issues:</strong> Incorrect or incomplete addresses can cause delivery attempts to fail. Check the address verification results for any flags.</li>
<li><strong>Carrier processing delays:</strong> High-volume periods (holidays, peak season) can slow carrier networks.</li>
<li><strong>Customs clearance:</strong> International shipments may be held at customs for inspection or missing documentation.</li>
</ul>

<h3>What to do</h3>
<ol>
<li>Check the tracking details in CommerceShip for the latest status and any exception messages.</li>
<li>If the shipment shows "delivery attempted," verify the address is correct.</li>
<li>For shipments stuck in transit beyond the expected delivery date, contact us with the shipment ID and we will investigate with the carrier.</li>
</ol>

<p>For eligible late deliveries, you may be able to file a refund claim. See the Invoice Audit and Reconciliation section for details.</p>`,
  },

  // ── Carriers ─────────────────────────────────────────────

  {
    title: "Supported Carriers",
    category: "Carriers",
    content: `<p>CommerceShip integrates with major US and Canadian carriers, plus regional and aggregator options.</p>

<h3>Direct carrier integrations</h3>

<table>
<tr><th>Carrier</th><th>Services</th><th>Capabilities</th></tr>
<tr><td><strong>USPS</strong></td><td>Priority Mail, Ground Advantage, Priority Mail Express, Parcel Select, and more</td><td>Rating, labels, tracking, manifests, surcharges, refund claims</td></tr>
<tr><td><strong>FedEx</strong></td><td>Ground, Home Delivery, Express Saver, 2Day, Priority Overnight, International Priority, and more (30 services)</td><td>Rating, labels, tracking, manifests, surcharges</td></tr>
<tr><td><strong>UPS</strong></td><td>Ground, 3 Day Select, 2nd Day Air, Next Day Air, Worldwide Express, and more (12 services)</td><td>Rating, labels, tracking, manifests, surcharges</td></tr>
<tr><td><strong>Canada Post</strong></td><td>Regular Parcel, Xpresspost, Priority, Expedited Parcel (8 services)</td><td>Rating, labels, manifests</td></tr>
<tr><td><strong>UniUni</strong></td><td>Canada domestic and US-to-Canada</td><td>Rating, labels</td></tr>
</table>

<h3>Carrier aggregators</h3>
<p>Through EasyPost, CommerceShip connects to 71+ additional carriers including PostNL, Maersk, DHL, OnTrac, and regional last-mile providers. This extends your carrier options without needing separate accounts for each.</p>

<h3>BYO carrier account</h3>
<p>Use your own negotiated carrier rates and accounts. CommerceShip connects to your existing carrier contracts so you keep your discounts.</p>

<h3>USPS discounts</h3>
<p>CommerceShip offers USPS discounts through our carrier partnership. These are available automatically when you ship with USPS through CommerceShip.</p>

<p>If you ship with a carrier not listed here, let us know and we can explore integration options.</p>`,
  },

  {
    title: "Connecting a Carrier Account",
    category: "Carriers",
    content: `<p>To start shipping with a carrier, you need to connect your carrier account to CommerceShip.</p>

<h3>Before you start</h3>
<p>Make sure you have your carrier credentials ready. Each carrier has its own authentication method. You will typically need your account number and either API credentials or login information from the carrier's portal.</p>

<h3>General steps</h3>
<ol>
<li>Navigate to carrier settings in CommerceShip.</li>
<li>Select the carrier you want to add.</li>
<li>Enter your credentials as prompted.</li>
<li>CommerceShip will verify the connection.</li>
<li>Once connected, the carrier's rates and services will appear when you rate shop.</li>
</ol>

<h3>Troubleshooting</h3>
<ul>
<li>If the connection fails, verify your credentials work in the carrier's own portal first.</li>
<li>Check the carrier's status page for any ongoing outages.</li>
<li>For USPS, make sure you are using your EPS (Enterprise Payment System) credentials, not your regular USPS.com consumer account.</li>
</ul>

<p>If you are still having trouble, contact us through chat with the carrier name and any error messages you see.</p>`,
  },

  // ── Rates & Rate Shopping ────────────────────────────────

  {
    title: "Comparing Rates Across Carriers",
    category: "Rates & Rate Shopping",
    content: `<p>Rate shopping lets you compare prices across all your connected carriers before selecting one for a shipment.</p>

<h3>How rate shopping works</h3>
<p>When you are ready to ship an order, CommerceShip queries all connected carriers for their current rates based on the package dimensions, weight, origin, and destination. Results are displayed side by side so you can choose based on cost, speed, or carrier preference.</p>

<h3>What affects rates</h3>
<ul>
<li><strong>Package weight and dimensions:</strong> Carriers charge by actual weight or dimensional (DIM) weight, whichever is greater.</li>
<li><strong>Origin and destination zones:</strong> Rates increase with distance.</li>
<li><strong>Service level:</strong> Express services cost more than ground.</li>
<li><strong>Carrier discounts:</strong> Your negotiated rates and CommerceShip partner discounts are applied automatically.</li>
</ul>

<h3>Shipment comparison</h3>
<p>For a specific shipment, use the comparison view to see a detailed side-by-side breakdown of rates, estimated transit times, and surcharges across carriers.</p>`,
  },

  {
    title: "Package Presets",
    category: "Rates & Rate Shopping",
    content: `<p>Package presets save frequently used package dimensions and weights so you can apply them with one click instead of entering them manually each time.</p>

<h3>When to use presets</h3>
<p>If you regularly ship in the same box sizes (for example, a small flat rate box, a medium carton, or a branded mailer), create a preset for each. This speeds up order processing and reduces errors from manual dimension entry.</p>

<h3>What a preset includes</h3>
<ul>
<li>Package name (for easy identification)</li>
<li>Length, width, and height</li>
<li>Default weight (optional)</li>
</ul>

<p>When creating a shipment, select a preset instead of typing dimensions manually. You can always override the preset values for individual shipments.</p>`,
  },

  {
    title: "Understanding Carrier Discounts",
    category: "Rates & Rate Shopping",
    content: `<p>CommerceShip offers multiple ways to reduce your shipping costs through carrier discounts.</p>

<h3>CommerceShip partner discounts</h3>
<p>USPS discounts are available automatically when you ship through CommerceShip. These are applied to your rates without any additional setup.</p>

<h3>Your own negotiated rates</h3>
<p>If you have negotiated rates directly with FedEx, UPS, or other carriers, connect your own carrier account to CommerceShip. Your contracted rates will be used for rate shopping and label generation.</p>

<h3>Carrier contract import</h3>
<p>CommerceShip can import and interpret your carrier contracts, including service tiers, discount structures, and rate schedules. This lets you model scenarios like comparing your current contract against published rates or evaluating a new carrier proposal.</p>

<h3>Rate scheduling</h3>
<p>When carrier rates change (for example, during a General Rate Increase), you can schedule new rates to activate on a specific date. This lets you prepare in advance and see the cost impact before the change takes effect.</p>`,
  },

  // ── Invoice Audit & Reconciliation ───────────────────────

  {
    title: "Understanding Shipping Cost Differences",
    category: "Invoice Audit & Reconciliation",
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
    title: "How Reconciliation Works",
    category: "Invoice Audit & Reconciliation",
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
<li>Import your carrier invoices into CommerceShip.</li>
<li>The system compares each invoice line item against your shipment records.</li>
<li>Discrepancies are flagged for your review.</li>
<li>You can file claims for overcharges or refunds directly from the platform.</li>
</ol>

<h3>What to look for</h3>
<ul>
<li>Surcharges that appear frequently may indicate data quality issues (bad addresses, incorrect package dimensions) that you can fix upstream.</li>
<li>Carrier billing errors are more common than most shippers realize. Regular reconciliation can recover 2-5% of shipping spend.</li>
</ul>

<p>If you have questions about a specific discrepancy, contact us with the shipment ID and invoice reference.</p>`,
  },

  {
    title: "Filing Refund Claims",
    category: "Invoice Audit & Reconciliation",
    content: `<p>When CommerceShip detects an overcharge or service failure, you can file a refund claim with the carrier.</p>

<h3>Common claim types</h3>
<ul>
<li><strong>Late delivery:</strong> The carrier guaranteed a delivery date and missed it. Many carriers offer refunds for guaranteed service failures.</li>
<li><strong>Duplicate charges:</strong> The same shipment was billed more than once.</li>
<li><strong>Overcharges:</strong> The billed amount exceeds what should have been charged based on the shipment details and your contract.</li>
<li><strong>Accessorial errors:</strong> Surcharges were applied incorrectly (for example, a residential surcharge on a commercial address).</li>
</ul>

<h3>How to file a claim</h3>
<ol>
<li>Review flagged discrepancies in the reconciliation results.</li>
<li>Select the shipments you want to dispute.</li>
<li>Submit the claim through CommerceShip.</li>
<li>Track claim status and resolution from the platform.</li>
</ol>

<p>We recommend reviewing reconciliation results weekly to catch issues while they are still within carrier claim windows.</p>`,
  },

  // ── Reports & Analytics ──────────────────────────────────

  {
    title: "Dashboards and Reports",
    category: "Reports & Analytics",
    content: `<p>CommerceShip includes pre-built dashboards and customizable reports to give you visibility into your shipping operations.</p>

<h3>Pre-built dashboards</h3>
<p>Dashboards provide real-time views of your key metrics including order volume, shipment status, carrier service performance, transit times, delivery rates, charges, surcharges, and savings.</p>

<h3>Filtering and segmentation</h3>
<p>Slice your data by customer, carrier, service level, time period, or other dimensions. This lets you isolate specific issues or compare performance across different segments of your business.</p>

<h3>Period-over-period comparison</h3>
<p>Compare metrics across time periods to track trends. For example, compare this month's shipping costs against last month, or this quarter's on-time delivery rate against the previous quarter.</p>

<h3>Scheduled reports</h3>
<p>Set up recurring reports that are generated and delivered automatically on a schedule. Reports can be sent via email or to other destinations.</p>

<h3>Enterprise reports</h3>
<p>Enterprise accounts have access to additional reporting including custom profitability reports, accounting exports, and margin analysis.</p>`,
  },

  {
    title: "AI-Generated Insights",
    category: "Reports & Analytics",
    content: `<p>CommerceShip uses AI to surface insights about your shipping operations automatically.</p>

<h3>Weekly AI reports</h3>
<p>Each week, CommerceShip generates a report with AI-written analysis of your shipping data. The report highlights week-over-week changes, unusual patterns, cost trends, and areas that may need attention.</p>

<h3>Spend analytics</h3>
<p>Identify hidden costs and optimization opportunities across your shipping spend. CommerceShip analyzes your carrier invoices to find patterns in surcharges, spot billing anomalies, and benchmark carrier performance against each other.</p>

<h3>Recommendations</h3>
<p>Based on your shipping patterns, CommerceShip provides data-driven suggestions for the best carriers and service levels. These recommendations factor in cost, transit time, and reliability to help you make better shipping decisions.</p>`,
  },

  // ── Automation ───────────────────────────────────────────

  {
    title: "Setting Up Automation Rules",
    category: "Automation",
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
<li>Navigate to the automation page.</li>
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
    title: "Automation Tips and Best Practices",
    category: "Automation",
    content: `<p>Get the most out of automation rules with these practices.</p>

<h3>Start simple</h3>
<p>Begin with one or two rules that handle your most common shipping scenarios. For example, a rule that assigns USPS Ground Advantage to all orders under 1 pound. Add complexity as you learn how rules interact.</p>

<h3>Use rule priority</h3>
<p>Rules fire in order from top to bottom. Put your most specific rules first and general fallback rules last. For example, put "If destination is Alaska, use USPS Priority" above "If weight is under 5 lbs, use USPS Ground Advantage."</p>

<h3>Test before enabling</h3>
<p>Use the test feature to run rules against sample orders before turning them on. This catches logic errors without affecting real shipments.</p>

<h3>Review the activity log</h3>
<p>Periodically check the activity log to see which rules are firing, which are not, and whether any are producing unexpected results. If a rule has not fired in 30 days, consider whether it is still needed.</p>

<h3>Avoid overlapping rules</h3>
<p>If two rules can match the same order, only the first one wins. Review your rule list to make sure earlier rules are not blocking later ones unintentionally.</p>`,
  },

  // ── Account & Users ──────────────────────────────────────

  {
    title: "Managing Your Account",
    category: "Account & Users",
    content: `<p>Your CommerceShip account is where you manage your profile, security settings, and billing.</p>

<h3>Profile</h3>
<p>Update your name, email, and contact information from your account settings.</p>

<h3>Two-factor authentication (2FA)</h3>
<p>For added security, enable 2FA in your account settings. When enabled, you will need to enter a verification code sent to your phone each time you log in. We recommend enabling 2FA for all accounts, especially those with admin access.</p>

<h3>Password</h3>
<p>Change your password in account settings. If you forgot your password, use the "Forgot password" link on the login page to receive a reset email.</p>

<h3>API keys</h3>
<p>If you need to integrate CommerceShip with other systems, you can generate API keys in your account settings. API keys provide programmatic access to the CommerceShip API.</p>

<h3>Billing and subscription</h3>
<p>View your current plan, payment methods, and billing history from the billing section. You can manage your subscription and update payment details there.</p>`,
  },

  {
    title: "Adding Team Members and Roles",
    category: "Account & Users",
    content: `<p>CommerceShip uses role-based access control (RBAC) so you can manage what each team member can see and do.</p>

<h3>Inviting a team member</h3>
<ol>
<li>Go to user management in your account settings.</li>
<li>Click Invite User.</li>
<li>Enter their email address and select a role.</li>
<li>They will receive an email invitation to create their account.</li>
</ol>

<h3>Available roles</h3>
<p>CommerceShip has several roles that control access to different parts of the platform. Roles range from full administrative access to view-only or function-specific access (such as operations, finance, or support). The role you assign determines which pages and actions the team member can use.</p>

<h3>Changing roles</h3>
<p>Admins can change a user's role at any time from the user management page. Permission changes take effect on the user's next login.</p>

<h3>Sub-accounts</h3>
<p>For enterprise customers managing multiple business units or clients, CommerceShip supports account hierarchies with sub-accounts. Each sub-account has its own users and data, with the parent account maintaining oversight.</p>

<p>If you need a custom role configuration or have questions about permissions, contact us and we can discuss options for your team structure.</p>`,
  },

  // ── Integrations ─────────────────────────────────────────

  {
    title: "Connecting Your Ecommerce Platform",
    category: "Integrations",
    content: `<p>CommerceShip integrates with ecommerce platforms to automatically sync orders, customers, and tracking data.</p>

<h3>Shopify</h3>
<p>CommerceShip has a dedicated Shopify app. Once installed, orders sync automatically from your Shopify store. When you ship an order in CommerceShip, tracking information is pushed back to Shopify and your customers are notified.</p>

<h3>Other platforms</h3>
<p>CommerceShip supports connections to additional ecommerce platforms, marketplaces, WMS, OMS, and ERP systems through our integrations module.</p>

<h3>CSV import</h3>
<p>If your platform is not directly supported, you can import orders via CSV. CommerceShip supports field mapping so you can match your CSV columns to the correct order fields.</p>

<h3>API</h3>
<p>For custom integrations, use the CommerceShip RESTful JSON API to push orders, pull tracking data, and manage shipments programmatically.</p>

<p>If you need to connect a platform not listed here, let us know and we can explore integration options for your setup.</p>`,
  },

  {
    title: "Using the CommerceShip API",
    category: "Integrations",
    content: `<p>The CommerceShip API gives you programmatic access to manage orders, shipments, rates, tracking, and more.</p>

<h3>Getting started with the API</h3>
<ol>
<li>Generate an API key from your account settings.</li>
<li>Use the API key in the Authorization header of your requests.</li>
<li>The API uses RESTful JSON format.</li>
</ol>

<h3>What you can do with the API</h3>
<ul>
<li>Create and manage orders</li>
<li>Get rate quotes across carriers</li>
<li>Generate shipping labels</li>
<li>Retrieve tracking information</li>
<li>Manage carrier configurations</li>
<li>Access reports and analytics data</li>
</ul>

<h3>Webhooks</h3>
<p>CommerceShip supports webhooks to notify your systems when events occur (for example, when a shipment status changes or an order is fulfilled). Configure webhook endpoints in your account settings.</p>

<p>For API documentation and examples, contact us and we will provide access to the developer resources.</p>`,
  },

  // ── AI & Agents ──────────────────────────────────────────

  {
    title: "AI-Powered Chat and Agents",
    category: "AI & Agents",
    content: `<p>CommerceShip includes AI-powered tools that help you manage shipping operations more efficiently.</p>

<h3>AI chat</h3>
<p>Ask questions about your shipments, costs, tracking, and operations in plain language. The AI assistant can look up shipment details, explain cost breakdowns, and help you find information without navigating through multiple pages.</p>

<h3>Specialized agents</h3>
<p>CommerceShip has specialized AI agents focused on specific domains:</p>
<ul>
<li><strong>Reconciliation agent:</strong> Helps analyze carrier invoices, detect discrepancies, and identify savings opportunities.</li>
<li><strong>Contracts agent:</strong> Assists with carrier contract analysis and rate optimization.</li>
<li><strong>Support agent:</strong> Helps troubleshoot shipping issues and answer operational questions.</li>
</ul>

<h3>Agent memory</h3>
<p>AI agents remember context from past interactions so you do not need to repeat information. The more you use the agents, the more helpful they become for your specific shipping patterns.</p>

<h3>Multi-model support</h3>
<p>CommerceShip supports multiple AI providers (Anthropic and OpenAI) so you can choose the best model for your needs.</p>`,
  },

  {
    title: "MCP and External Integrations for AI",
    category: "AI & Agents",
    content: `<p>CommerceShip supports the Model Context Protocol (MCP), which lets AI assistants connect directly to your shipping data.</p>

<h3>What is MCP?</h3>
<p>MCP is a standard protocol that allows AI tools to read and interact with external data sources. CommerceShip provides an MCP server that AI assistants (like Claude or ChatGPT) can connect to for real-time access to your shipping, order, and cost data.</p>

<h3>What you can do with MCP</h3>
<ul>
<li>Query shipment status and tracking from an AI assistant</li>
<li>Get rate quotes and cost analysis through natural language</li>
<li>Review order details and fulfillment status</li>
<li>Analyze spending patterns and carrier performance</li>
</ul>

<h3>Safety controls</h3>
<p>High-risk actions (like generating labels, processing refunds, or triggering batch operations) require explicit approval before the AI can execute them. This prevents accidental changes while still giving you the speed of AI-assisted operations.</p>

<p>If you are interested in connecting CommerceShip to your AI workflows, contact us to discuss setup options.</p>`,
  },

];

// ============================================================
// API HELPERS
// ============================================================

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
    if (res.status === 422) {
      // May already exist
      const listRes = await fetch(
        `${BASE_URL}/portals/${PORTAL_SLUG}/categories?locale=en`,
        { headers }
      );
      if (listRes.ok) {
        const data = await listRes.json();
        const cats = data.payload || data;
        const found = (Array.isArray(cats) ? cats : []).find((c: any) => c.name === name);
        if (found) {
          console.log(`  Exists: "${name}" (id: ${found.id})`);
          return found.id;
        }
      }
    }
    const text = await res.text();
    throw new Error(`Failed to create category "${name}": ${res.status} ${text}`);
  }
  const data = await res.json();
  const id = data.payload?.id || data.id;
  console.log(`  Created: "${name}" (id: ${id})`);
  return id;
}

async function deleteArticle(id: number): Promise<void> {
  await fetch(
    `${BASE_URL}/portals/${PORTAL_SLUG}/articles/${id}`,
    { method: "DELETE", headers }
  );
}

async function listArticles(): Promise<any[]> {
  const res = await fetch(
    `${BASE_URL}/portals/${PORTAL_SLUG}/articles`,
    { headers }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.payload || [];
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
  // Step 1: Delete existing articles (the 3 we published earlier + any samples)
  console.log("Cleaning existing articles...");
  const existing = await listArticles();
  for (const a of existing) {
    await deleteArticle(a.id);
    console.log(`  Deleted: "${a.title}" (id: ${a.id})`);
  }

  // Step 2: Create categories
  console.log("\nCreating categories...");
  const categoryIds: Record<string, number> = {};
  for (const cat of categories) {
    categoryIds[cat.name] = await createCategory(cat.name, cat.slug, cat.description);
  }

  // Step 3: Publish articles
  console.log(`\nPublishing ${articles.length} articles...`);
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

  console.log(`\nDone! ${count} articles published across ${Object.keys(categoryIds).length} categories.`);
  console.log("Check https://help.commerceship.com");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

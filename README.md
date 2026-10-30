# Starlight Tales — Magical Printed Children's Books

A production-quality e-commerce platform built for a children's book brand selling **PRINTED PHYSICAL BOOKS ONLY**. Every order is fulfilled automatically on demand by a certified printmaker (default **Prodigi**, or selectable **Gelato** / **Printful**).

The design captures a warm, storybook feel inspired by *magicalchildrensbook.ie*, featuring soft pastels, rounded typography (Fredoka & Nunito), hand-crafted dividers, live personalized dedications typeset on inside covers, real-time POD carrier shipping calculations, and a complete protected CMS Admin dashboard.

---

## 🌟 Key Features

1. **Printed Books Only**: No digital downloads or PDFs to customers. Every book is bound in **Deluxe Keepsake Hardcover** (Case Laminate) or **Storybook Paperback** on 170gsm heavyweight silk paper.
2. **Personalized Dedications**: Parents and grandparents can enter a custom message that is previewed live and typeset directly into the opening leaf of the book.
3. **Print-on-Demand (POD) Automation**:
   - Abstract `PODProvider` architecture (`getShippingRates`, `createOrder`, `getOrderStatus`, `handleWebhook`).
   - Integrated with **Prodigi v4 API** (sandbox & live), **Gelato**, and **Printful**.
   - Automatic order transmission with SKU, 300DPI print-ready PDF URL, shipping address, and personalized dedication.
   - Status progression: `Paid` → `Sent to Printer` → `In Production` → `Shipped` → `Delivered`.
   - Automatic shipping email with tracking number and direct carrier tracking link.
4. **Live Shipping Calculations**: Real-time shipping quotes from the POD provider based on destination country and cart item weights.
5. **Full-Stack Architecture**:
   - **Backend**: Node.js + Express with SQLite (`better-sqlite3`), architected with repository pattern for drop-in PostgreSQL migration.
   - **Frontend**: React 19 + TypeScript + Tailwind CSS v4.
   - **Payments**: Stripe Checkout & Payment Element support + seamless sandbox simulation.
6. **Protected Admin CMS (`/admin`)**:
   - Secure login with PBKDF2 password hashing. Default seed admin credentials:
     - **Email:** `admin@magicalbooks.com`
     - **Password:** `MagicalBooks2026!`
   - Dashboard metrics (Revenue, orders, in-production count, failure alerts).
   - Order management with search, filter, line items, and dedicated **POD Simulator Suite**:
     - *Retry POD Submission* button for failed jobs.
     - *Simulate Status* buttons (`In Production`, `Mark as Shipped`) to test notifications.
     - *Resend Confirmation Email* & *Resend Shipping Email* buttons.
   - Book catalog and pricing manager (edit prices, sale prices, POD codes, print files).
   - Live POD Transmission & Webhook inspection logs.
   - Dispatched transactional email viewer with rendered HTML preview.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Review the variables in `.env`:
```env
# Print-on-Demand Configuration
POD_PROVIDER="prodigi" # "prodigi" | "gelato" | "printful"
PRODIGI_API_KEY="test_prodigi_api_key_sandbox"
PRODIGI_ENVIRONMENT="sandbox" # "sandbox" or "live"
PRODIGI_WEBHOOK_SECRET="whsec_prodigi_test_secret"

# Stripe Payments Configuration
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email Configuration
EMAIL_PROVIDER="mock" # "resend" | "sendgrid" | "mock"
RESEND_API_KEY=""
STORE_EMAIL="hello@starlighttales.com"
```

### 3. Launch Development Server
```bash
npm run dev
```
The server starts on port `3000` with the Express API and Vite middleware mounted.

---

## 🖨️ Connecting Real Print-on-Demand (POD) & Stripe

### Connecting Prodigi
1. Create a free account at [Prodigi.com](https://www.prodigi.com).
2. Generate your API key in **Account > API keys** (start with the **Sandbox key**).
3. Set `PRODIGI_API_KEY="your_api_key"` and `PRODIGI_ENVIRONMENT="sandbox"` in `.env`.
4. Register your webhook endpoint in Prodigi pointing to:
   `https://<your-domain>/api/webhooks/pod`
5. Print file PDFs: Real print-ready 300DPI CMYK PDF assets can be placed in Google Cloud Storage or AWS S3 and configured per variant in the Admin CMS (`/admin` > Books & Pricing).

### Connecting Stripe
1. Retrieve your test API keys from [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).
2. Set `STRIPE_SECRET_KEY="sk_test_..."` and `STRIPE_PUBLISHABLE_KEY="pk_test_..."`.
3. Set up the Stripe webhook:
   `https://<your-domain>/api/webhooks/stripe`
   Listening for `checkout.session.completed`. Set `STRIPE_WEBHOOK_SECRET="whsec_..."`.

---

## 🗄️ Database & Schema

The prototype stores data in `store.sqlite` with foreign keys and WAL mode. The data access layer in `/src/server/db.ts` uses prepared queries and can be swapped for PostgreSQL by updating the query layer.

**Core Data Models:**
- `Book`: Title, author, illustrator, slug, description, age range, category, page count, trim size, cover finish.
- `Variant`: Format (`hardcover` | `paperback`), SKU, regular price, sale price, POD product code, print file URL.
- `Order`: Customer contact, shipping address, line items, subtotal, shipping cost, payment status, POD order ID, POD status, tracking number, carrier.
- `OrderItem`: Variant details, unit price, quantity, personalized dedication message.
- `TrackingEvent`: Timestamped fulfillment events from lab and carrier.
- `PODLog`: Raw API request/response logs for auditing.
- `AdminUser`: Hashed password and roles.
- `Setting`: Store currency, free shipping threshold, banner notice.

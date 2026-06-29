# <img alt="Split Wise Logo" height="80" src="./public/hero.png" />

# Yash's Split Wise — Modern AI-Powered Expense Splitting

Created by **Yash** using **Antigravity AI** (a Google DeepMind agentic coding assistant).

**Split Wise** is a modern, premium, privacy-first alternative to Splitwise. Built as a sleek Progressive Web App (PWA), it requires **no registration or login**—your groups are saved directly to your browser's local storage. Simply create a group, share the link, and begin managing shared expenses.

---

## 🌟 Modern Key Features

### 🤖 AI-Powered Integrations
* **AI Receipt Scanning**: Instantly extract expense titles, amounts, and dates by uploading or scanning a receipt. Powered by **OpenAI GPT-4 Vision** integration.
* **AI Category Auto-Recommendation**: Type in an expense title (e.g., *"Dinner at Mario's"*) and the app will automatically recommend the correct spending category (e.g., *"Food & Drink / Dining Out"*) in real-time.

### 💸 Smart Calculations & Splits
* **Optimized Settlement Engine**: Get a clean list of who needs to pay whom. The engine computes optimized settlement steps to minimize the number of required cash transfers.
* **Flexible Split Modes**: Split bills evenly, by custom shares, by percentages, or exact amounts.
* **Multi-Currency Support**: Add expenses in any currency and let the app automatically fetch daily exchange rates or configure a custom rate.
* **Recurring Expenses**: SetupDAILY, WEEKLY, or MONTHLY recurring expenses that post automatically.

### 🎨 Premium UI & Design
* **Glassmorphic Cards**: Beautiful semi-transparent overlays with smooth borders.
* **Theme Switching**: Built-in sleek Dark Mode and Light Mode with fluid transitions.
* **Pill Navigation**: Segmented sliding menu controls with micro-icon triggers.
* **Progress Bar Balances**: Clear color-coded indicators of who is ahead (emerald) or behind (rose).

---

## 🚀 Tech Stack

* **Frontend**: [Next.js](https://nextjs.org/) (App Router & React 19)
* **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **Database**: PostgreSQL with [Prisma ORM](https://prisma.io)
* **API Layer**: [tRPC](https://trpc.io/) for end-to-end type safety
* **Hosting**: Optimised for [Vercel](https://vercel.com/) and Docker compose setups

---

## 💻 Run Locally

### 1. Clone the repository
Clone this repository to your local system and check out the `main` branch.

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure you have your PostgreSQL database connection strings set up:
```.env
POSTGRES_PRISMA_URL="postgresql://username:password@localhost:5432/splitwise"
POSTGRES_URL_NON_POOLING="postgresql://username:password@localhost:5432/splitwise"
```

### 3. Setup Dependencies
Install dependencies and generate the Prisma Client:
```bash
npm install --ignore-scripts
npx prisma generate
```

### 4. Apply Database Migrations
Deploy the database schema:
```bash
npx prisma migrate deploy
```

### 5. Launch Dev Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🛠️ Opt-In AI & Cloud Features

### AI Receipt Scanning
Activate GPT-4 Vision receipt parsing by providing your OpenAI API key and enabling documents upload:
```.env
NEXT_PUBLIC_ENABLE_EXPENSE_DOCUMENTS=true
NEXT_PUBLIC_ENABLE_RECEIPT_EXTRACT=true
OPENAI_API_KEY="your-openai-api-key"
```
*(Requires AWS S3 configurations for image hosting, see the codebase for further details).*

### AI Category Recommendation
Auto-deduce categories from titles by adding:
```.env
NEXT_PUBLIC_ENABLE_CATEGORY_EXTRACT=true
OPENAI_API_KEY="your-openai-api-key"
```

---

## ⚡ Vercel Deployment Guide

Deploying Split Wise to Vercel is highly streamlined. Follow these steps to host your own production instance:

### 1. Database Setup
Since this application uses PostgreSQL with Prisma, you will need a running database. You can provision a free Postgres instance from:
- **Supabase** (Database section)
- **Neon Serverless Postgres** (neon.tech)
- **Vercel Postgres** (built-in Vercel storage integrations)

Once provisioned, get the **Transaction Connection String** (for pooling) and the **Direct Connection String** (without pooling).

### 2. Deploy via Vercel Dashboard
1. Go to the [Vercel Dashboard](https://vercel.com) and click **Add New** > **Project**.
2. Import your GitHub repository (`https://github.com/yashwanth938/Split_Expensive_App`).
3. Under **Configure Project**, set the **Build Command** to:
   ```bash
   prisma generate && next build
   ```
4. Add the following **Environment Variables**:
   * `POSTGRES_PRISMA_URL`: Your pooled database connection string.
   * `POSTGRES_URL_NON_POOLING`: Your direct database connection string.
   * `NEXT_PUBLIC_DEFAULT_CURRENCY_CODE`: (Optional) e.g., `"USD"` or `"EUR"`.
   * `NEXT_PUBLIC_ENABLE_EXPENSE_DOCUMENTS`: (Optional) `"true"` if using receipts.
   * `NEXT_PUBLIC_ENABLE_RECEIPT_EXTRACT`: (Optional) `"true"` if using AI scanner.
   * `NEXT_PUBLIC_ENABLE_CATEGORY_EXTRACT`: (Optional) `"true"` if using AI auto-categories.
   * `OPENAI_API_KEY`: (Optional) OpenAI API key.
5. Click **Deploy**. Vercel will build the Next.js routes and compile the Prisma client.

### 3. Apply Schema Migrations
To create tables in your remote database, run the Prisma migration deploy command locally from your workspace, referencing your live database:
```bash
$env:POSTGRES_PRISMA_URL="your_live_database_connection_string"
npx prisma migrate deploy
```
Alternatively, you can run `npx prisma db push` to push the schema directly.

---

## 📄 License

MIT. See [LICENSE](./LICENSE) for details.

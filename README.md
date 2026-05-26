# 🦁 ZOE AFRICA — Africa's #1 AI-Powered Career Platform

ZOE AFRICA is a comprehensive, highly responsive, and robust full-stack career platform designed to help African professionals discover visa-sponsored international opportunities and craft applicant tracking system (ATS) proof applications.

Built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, **Node.js/Express**, **Firebase (Auth & Firestore)**, and powered by **Google Gemini AI** (using the modern `@google/genai` model engine).

---

## 🎨 Core Platform Features

- **💼 Global Job Portal**: Live-vetted job opportunities in the UK, USA, Canada, UAE, and Africa featuring direct Visa Sponsorship and sponsorship filters.
- **📄 AI-Enhanced Smart CV Builder**: A modular interactive resume editor that integrates Gemini AI to refine professional summaries, auto-format experience bullet points with metrics, and suggest market-relevant technical skills.
- **✉️ Dynamic Cover Letter Generator**: Custom, hyper-relevant cover letters tailored in real-time to specific job descriptions and applicant qualifications.
- **💬 Live ZOE AI Career Coach**: A persistent, highly supportive chatbot utilizing `gemini-3.5-flash` model architectures to provide instant mock interviews, global visa pathways, salary conversions, and professional coaching.
- **📊 Real-time Application Dashboard**: Secure, private Candidate dashboards with live updates via Google Firestore subscription streams, visual pipelines (Applied ➜ Interview ➜ Offer ➜ Recieved), and target tracking logs.
- **💳 Fully-integrated Simulator Upgrade Pathways**: Seamless visual and operational workflows allowing candidates to upgrade subscription plans (Free, Pro, Elite).

---

## 🚀 Repository Tech Stack

- **Client App**: React 19, TypeScript, Tailwind CSS, Lucide icons, Motion (Framer Motion)
- **Server proxy Engine**: Node.js, Express, TSX, Esbuild (compiles server-side endpoints cleanly for fast production boots)
- **AI Integration**: `@google/genai` system SDK (server-side proxied to protect API secrets)
- **Database & Identity**: Google Firebase Auth (Authentication) & Firestore DB (persistent schema-validated document-level state updates)

---

## 📦 File Layout Structure

```yaml
├── .env.example                # Template for server-side secret credentials
├── firebase-applet-config.json # Public Firebase Client Configuration coordinates
├── firebase-blueprint.json     # Firestore collections blueprint 
├── firestore.rules             # Rigorous Firestore schema and gatekeeper security rules
├── server.ts                   # Backend Express & Gemini endpoint routing
├── index.html                  # Client core wrapper file
├── package.json                # Project dependencies and production script matrices
├── tsconfig.json               # TypeScript compiler config
├── vite.config.ts              # Vite configuration and asset compilation pipelines
└── src/                        # Front-end React Application source root
    ├── main.tsx                # Frontend Mount entry point
    ├── App.tsx                 # Core Application layout & Firebase state synchronization listeners
    ├── types.ts                # Strict corporate TypeScript interface & enum mappings
    ├── data.ts                 # Hardcoded initial mock jobs and listing records
    ├── index.css               # Global Tailwind directives & typography overrides
    └── components/             # Reusable UI React sub-components
        ├── Navbar.tsx          # Dynamic authentication & page indicator ribbon
        ├── HomeView.tsx        # Immersive marketing landing & search filters
        ├── JobsView.tsx        # Search queries, role cards, & direct apply controls
        ├── CVBuilder.tsx       # Live fields + Gemini-powered experience rewriter
        ├── AICoach.tsx         # Live chat dialogue panel with Gemini Coach
        ├── DashboardView.tsx   # Live Firestore sync stats, history logs, & states
        ├── PricingView.tsx     # Tier comparison widgets and checkout handlers
        └── Modals.tsx          # Drawer panels (Login, Register, cover generator, and apps)
```

---

## 🛠️ Step-by-Step Local Setup

Follow these steps to setup the project on your machine:

### 1. Prerequisite Requirements
Ensure you have the following installed on your developer workspace:
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [NPM](https://www.npmjs.com/) or another modern package runner

### 2. Clone and Install Dependencies
Navigate to your repository directory and run:
```bash
# Install core frontend, backend, and TS dependencies
npm install
```

### 3. Setup Variables and Configs
Create a `.env` file at the root level matching `/ .env.example`:
```bash
# .env
GEMINI_API_KEY="YOUR_ACTUAL_SECURE_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
```
*Note: Secure API keys should strictly reside in `.env` and must never be committed to your public git branch.*

### 4. Setup Firestore Security Rules
Your Firestore collections are gated with robust document constraints and validation checks. Apply the rules locally or directly onto your Firebase console:
1. Go to **Firebase Console** ➜ **Firestore Database** ➜ **Rules** tab.
2. Replace everything with the contents inside `/firestore.rules`.
3. Save and Publish.

### 5. Start Development Environment
Launch Vite's hot-reloading development server:
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`**.

---

## 🌎 Hosting & Github Live Website Deployment

This is a **full-stack Express + React App**. Common options for hosting include:

### Option A: Render or Railway (Full-Stack Deployment - Recommended)
To preserve both your elegant frontend and the Gemini AI proxy server on a singular URL seamlessly:
1. Push your code repository directly to a new **GitHub repository**.
2. Connect your GitHub to [Render](https://render.com/) or [Railway](https://railway.app/).
3. Provision a new **Web Service**.
4. Set the following configurations:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start` (Starts compiled ES Module bundle from `dist/server.cjs`)
5. Navigate to **Environment Variables** panel in your host UI and define:
   - `GEMINI_API_KEY`: Your model API token
   - `NODE_ENV`: `production`

---

### Option B: Split static hosting (Vercel / GitHub Pages)
If you want to host the frontend dynamically on static solutions like **Vercel**, you can deploy the `/src` and `/dist` directories. However, since Vercel does not support standard server loops out of the box without Serverless Functions:
- Host the static assets on Vercel by exporting the static build (`npm run build`).
- Host your `server.ts` standalone on a free Node runner (Render, Railway, or Fly.io) and configure the client API endpoints inside your components to target that API server URL instead of the comparative local `/api/*` structures.

---

## 📄 License and Credits
Created and configured for ZOE AFRICA. Powered by Google AI Studio and Google DeepMind systems. Built with maximum craftsmanship, secure validations, and modern structural execution.

# UtilityOps AI (Next.js)

Production-ready, low-cost utility operations web app with:
- **Marketing landing page** at `/utility`
- **Working demo console** at `/demo`
- **Pluggable chat API** at `/api/chat` (rules default, optional Ollama/OpenAI-compatible)
- **Mock event API** at `/api/events` with deterministic seeded data generation
- **Optional persistence** for event/chat logs via SQLite (free-tier friendly)

## Tech Stack
- Next.js 14 App Router + TypeScript (strict)
- TailwindCSS
- Recharts
- Optional: `better-sqlite3` for local persistence

## Local Development
```bash
npm install
npm run dev
```
Open:
- `http://localhost:3000/utility`
- `http://localhost:3000/demo`

## Environment Variables
Create `.env.local`:
```bash
# deterministic mock data
MOCK_SEED=utility-seed-1

# chat provider: rules | ollama | openai
AI_PROVIDER=rules

# Ollama local mode
OLLAMA_MODEL=llama3

# OpenAI-compatible mode
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# Optional persistence
PERSISTENCE_MODE=none
SQLITE_PATH=./utility-demo.db
```

## Switching AI Providers
- **Rules (default):** zero-cost deterministic responses from mock data.
- **Ollama:** set `AI_PROVIDER=ollama`, run local Ollama endpoint on `http://localhost:11434`.
- **OpenAI-compatible:** set `AI_PROVIDER=openai` and provide API key/base URL.
- Demo chat also has a provider selector in UI; misconfigured providers automatically fall back to rules mode.

## Optional Persistence
By default app runs stateless. To store event/chat logs locally:
```bash
npm install better-sqlite3
```
Then set:
```bash
PERSISTENCE_MODE=sqlite
SQLITE_PATH=./utility-demo.db
```
If SQLite is not installed/misconfigured, app keeps running without crashing.

## Deployment (Vercel)
1. Push repo to GitHub.
2. Import project in Vercel.
3. Add env vars from `.env.local` as needed.
4. Deploy.

## Cost Minimization Notes
- Rules engine is default and free.
- No paid map tiles: outage heatmap is rendered as a local Tailwind grid.
- Optional AI providers are plug-in only.
- Optional persistence is local SQLite, no mandatory managed DB.

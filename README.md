# OpenAI-Chatbot (BetterPlanet Website Assistant)

This repo includes a self-hosted OpenAI-Chatbot so visitors can use your AI assistant from your website (no ChatGPT account required).

## What this app does

- Serves a chatbot page from your own domain.
- Accepts customer text + optional image upload.
- Sends text + image + evaluation parameters to OpenAI.
- Returns the model response into the same chat window.

## Local quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env`:
   ```bash
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-4.1-mini
   PORT=3000
   ```
3. Run:
   ```bash
   npm start
   ```
4. Open:
   `http://localhost:3000`

## Why `npm install` failed earlier (403)

The previous `npm install` error was from the execution environment proxy/security policy blocking npm registry access, not from your chatbot code.

If your GCP or AWS runtime has normal npm/Docker access, deployment there avoids that blocked environment and the install should work.

---

## Deploy to Google Cloud (Cloud Run)

### 1) Prereqs
- Google Cloud project with billing enabled.
- `gcloud` CLI authenticated.
- Artifact Registry + Cloud Run APIs enabled.

### 2) Build and push container
From this repo directory:

```bash
gcloud config set project YOUR_GCP_PROJECT_ID
gcloud builds submit --tag gcr.io/YOUR_GCP_PROJECT_ID/betterplanet-chatbot
```

### 3) Deploy to Cloud Run
```bash
gcloud run deploy betterplanet-chatbot \
  --image gcr.io/YOUR_GCP_PROJECT_ID/betterplanet-chatbot \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=YOUR_KEY,OPENAI_MODEL=gpt-4.1-mini
```

### 4) Domain mapping
- Use Cloud Run custom domain mapping to point something like `ai.betterplanetcoop.org`.
- Add DNS records in your domain provider.

---

## Deploy to AWS (App Runner - easiest path)

### 1) Build and push image to ECR
```bash
aws ecr create-repository --repository-name betterplanet-chatbot
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker build -t betterplanet-chatbot .
docker tag betterplanet-chatbot:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/betterplanet-chatbot:latest
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/betterplanet-chatbot:latest
```

### 2) Create App Runner service
- Source: ECR image above.
- Port: `3000`.
- Env vars:
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL` (optional, default already set in code)
- Health check path: `/healthz`.

### 3) Custom domain
- Attach `ai.betterplanetcoop.org` in App Runner custom domains.
- Add required CNAME records.

---

## Files

- `server.js` – Express backend and `/api/chat`, plus `/healthz`.
- `public/index.html` – chatbot UI.
- `public/app.js` – message/image upload logic.
- `public/styles.css` – chatbot styling.
- `Dockerfile` – container build for AWS/GCP deployment.

## Production hardening checklist

- Add request rate limiting.
- Enforce max upload size and strict MIME checks.
- Add authentication if the bot should be private.
- Log request IDs + error telemetry.
- Move `OPENAI_API_KEY` into Secret Manager (GCP) or Secrets Manager/SSM (AWS).

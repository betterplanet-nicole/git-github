# Utility Enrollment Full-Stack AWS App

This repository now contains a deployable serverless full-stack app for a utility-offer funnel (eligibility, lead capture, quote estimate, and callback scheduling).

## What was built

- **Infrastructure-as-code (AWS SAM)**
  - API Gateway (HTTP API)
  - Lambda backend
  - DynamoDB single-table storage
  - S3 static website bucket for frontend
- **Backend API (Python)**
  - `GET /providers?zip=#####`
  - `GET /feature-map`
  - `POST /lead`
  - `POST /quote`
  - `POST /contact`
  - `GET /admin/leads` (protected by `x-admin-token`)
- **Frontend (static HTML/JS)**
  - ZIP/provider lookup
  - Lead submission form
  - Quote estimate form
  - Callback request form
- **Feature map draft**
  - See `docs/feature-map.md`

---

## Repository layout

- `infra/template.yaml` — AWS SAM template
- `backend/src/app.py` — Lambda API handlers
- `frontend/index.html` — UI shell
- `frontend/app.js` — browser API integration
- `docs/feature-map.md` — feature map draft

---

## Deploy

### Prerequisites

- AWS CLI configured
- AWS SAM CLI installed

### Build and deploy

```bash
cd infra
sam build
sam deploy --guided
```

During guided deploy, supply:

- `StageName` (e.g., `prod`)
- `FrontendOrigin` (your frontend URL or `*` while testing)
- `AdminToken` (secure random value)

After deploy, retrieve outputs:

- `HttpApiUrl`
- `FrontendBucketName`
- `FrontendWebsiteUrl`

---

## Publish frontend

1. Set API base URL in browser scope.
   - Quick option: prepend this line at top of `frontend/app.js` deployment bundle:
     ```js
     window.API_BASE_URL = "https://<api-id>.execute-api.<region>.amazonaws.com/prod";
     ```
2. Upload frontend files to S3:

```bash
aws s3 sync ../frontend s3://<FrontendBucketName>/
```

3. Open `FrontendWebsiteUrl`.

---

## Notes

- The original target page could not be fetched from this execution environment due to outbound tunnel restrictions (`403`).
- The implementation is structured so feature labels/flows can be updated quickly once exact UX/content from the live page is confirmed.

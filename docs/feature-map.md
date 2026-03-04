# Utility Funnel Feature Map (Draft)

> Note: direct crawling of `https://talktomyenergy.com/utility/` was blocked from this environment (`403 CONNECT tunnel failed`), so this map is drafted for a standard utility-enrollment funnel and is designed to be easy to adjust once exact page copy/details are confirmed.

## 1. Visitor & Marketing Layer
- Landing hero with value proposition
- Trust badges / social proof
- CTA to begin eligibility check

## 2. Eligibility & Qualification
- ZIP code capture
- Utility provider lookup by ZIP
- Home/account qualification questions
- Consent and compliance acceptance

## 3. Savings & Offer Configuration
- Current bill amount / usage intake
- Service state/provider capture
- Program-matching eligibility score
- Savings estimate range output

## 4. Conversion & Sales Handoff
- Lead record creation
- Callback request (phone + time window)
- Sales queue population
- Status tracking (`new`, `contacted`, `converted`)

## 5. Operations & Admin
- Admin feed of new leads
- Audit timestamps and payload history
- Filtering by type/status
- Export hooks for CRM integration

## 6. Analytics & Reliability
- Funnel event logging (view → lookup → lead → quote → callback)
- CloudWatch metrics and alarms
- Dead-letter handling for async workflows
- PII handling and retention controls

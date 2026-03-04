import json
import os
import re
import uuid
from datetime import datetime, timezone
from decimal import Decimal

import boto3

TABLE_NAME = os.environ["TABLE_NAME"]
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")

DDB = boto3.resource("dynamodb")
TABLE = DDB.Table(TABLE_NAME)

FEATURE_MAP = {
    "funnels": [
        {
            "name": "Eligibility funnel",
            "features": [
                "ZIP and utility provider lookup",
                "Home ownership and account status questions",
                "Realtime eligibility scoring",
            ],
        },
        {
            "name": "Quote & savings workflow",
            "features": [
                "Usage profile intake",
                "Program matching",
                "Estimated savings range",
                "Consent capture",
            ],
        },
        {
            "name": "Lifecycle operations",
            "features": [
                "Lead management",
                "Sales callback scheduling",
                "Admin queue and status transitions",
                "Audit timestamps",
            ],
        },
    ]
}

PROVIDER_DATA = {
    "10001": ["ConEdison", "Community Solar NYC"],
    "60601": ["ComEd", "CleanChoice Energy"],
    "75201": ["Oncor", "TXU Energy"],
    "94105": ["PG&E", "Peninsula Clean Energy"],
}

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PHONE_RE = re.compile(r"^\+?[0-9\-()\s]{7,20}$")


def response(status_code: int, payload: dict):
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(payload, default=str),
    }


def parse_body(event):
    raw = event.get("body") or "{}"
    if event.get("isBase64Encoded"):
        raw = raw.encode("utf-8")
    return json.loads(raw)


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def validate_required(payload, required_fields):
    missing = [field for field in required_fields if not payload.get(field)]
    return missing


def put_entity(entity_type: str, payload: dict):
    entity_id = str(uuid.uuid4())
    created_at = now_iso()
    item = {
        "PK": f"ENTITY#{entity_type}",
        "SK": f"ID#{entity_id}",
        "GSI1PK": f"STATUS#new",
        "GSI1SK": f"{entity_type}#{created_at}",
        "entityType": entity_type,
        "entityId": entity_id,
        "status": "new",
        "createdAt": created_at,
        "payload": payload,
    }
    TABLE.put_item(Item=item)
    return {"id": entity_id, "status": "new", "createdAt": created_at}


def list_entities(entity_type: str):
    resp = TABLE.query(
        IndexName="GSI1",
        KeyConditionExpression="GSI1PK = :status",
        ExpressionAttributeValues={":status": "STATUS#new"},
        ScanIndexForward=False,
    )
    items = [i for i in resp.get("Items", []) if i.get("entityType") == entity_type]
    return items


def parse_decimal(obj):
    if isinstance(obj, list):
        return [parse_decimal(x) for x in obj]
    if isinstance(obj, dict):
        return {k: parse_decimal(v) for k, v in obj.items()}
    if isinstance(obj, Decimal):
        return float(obj)
    return obj


def handle_provider_lookup(query):
    zipcode = (query.get("zip") or "").strip()
    if not re.fullmatch(r"\d{5}", zipcode):
        return response(400, {"error": "zip must be a 5-digit code"})

    providers = PROVIDER_DATA.get(zipcode, ["Regional Utility", "Community Program Partner"])
    return response(200, {"zip": zipcode, "providers": providers})


def handle_feature_map():
    return response(200, FEATURE_MAP)


def handle_lead(payload):
    missing = validate_required(payload, ["firstName", "lastName", "email", "zip", "consent"])
    if missing:
        return response(400, {"error": "missing required fields", "fields": missing})
    if not EMAIL_RE.fullmatch(payload["email"]):
        return response(400, {"error": "invalid email"})
    if not re.fullmatch(r"\d{5}", str(payload["zip"])):
        return response(400, {"error": "zip must be a 5-digit code"})
    if payload["consent"] is not True:
        return response(400, {"error": "consent must be accepted"})

    created = put_entity("lead", payload)
    return response(201, {"message": "lead captured", **created})


def handle_quote(payload):
    missing = validate_required(payload, ["leadId", "utilityProvider", "monthlyBill", "serviceState"])
    if missing:
        return response(400, {"error": "missing required fields", "fields": missing})

    try:
        monthly_bill = float(payload["monthlyBill"])
    except (TypeError, ValueError):
        return response(400, {"error": "monthlyBill must be numeric"})

    score = max(5, min(95, int((monthly_bill / 10) + 15)))
    estimate = {"minAnnualSavings": round(monthly_bill * 0.08 * 12, 2), "maxAnnualSavings": round(monthly_bill * 0.18 * 12, 2)}
    payload["eligibilityScore"] = score
    payload["estimate"] = estimate

    created = put_entity("quote", payload)
    return response(201, {"message": "quote generated", "eligibilityScore": score, "estimate": estimate, **created})


def handle_contact(payload):
    missing = validate_required(payload, ["leadId", "phone", "preferredTime"])
    if missing:
        return response(400, {"error": "missing required fields", "fields": missing})
    if not PHONE_RE.fullmatch(payload["phone"]):
        return response(400, {"error": "invalid phone"})

    created = put_entity("contact", payload)
    return response(201, {"message": "callback request captured", **created})


def handle_admin_leads(headers):
    token = headers.get("x-admin-token", "")
    if not ADMIN_TOKEN or token != ADMIN_TOKEN:
        return response(401, {"error": "unauthorized"})

    items = list_entities("lead")
    normalized = parse_decimal(items)
    return response(200, {"count": len(normalized), "items": normalized})


def lambda_handler(event, _context):
    request_context = event.get("requestContext", {})
    http = request_context.get("http", {})
    method = http.get("method", "")
    path = http.get("path", "")

    try:
        if method == "GET" and path.endswith("/providers"):
            return handle_provider_lookup(event.get("queryStringParameters") or {})
        if method == "GET" and path.endswith("/feature-map"):
            return handle_feature_map()
        if method == "POST" and path.endswith("/lead"):
            return handle_lead(parse_body(event))
        if method == "POST" and path.endswith("/quote"):
            return handle_quote(parse_body(event))
        if method == "POST" and path.endswith("/contact"):
            return handle_contact(parse_body(event))
        if method == "GET" and path.endswith("/admin/leads"):
            return handle_admin_leads({k.lower(): v for k, v in (event.get("headers") or {}).items()})

        return response(404, {"error": "not found"})
    except json.JSONDecodeError:
        return response(400, {"error": "invalid json body"})
    except Exception as exc:  # keep response stable for API consumers
        return response(500, {"error": "internal server error", "message": str(exc)})

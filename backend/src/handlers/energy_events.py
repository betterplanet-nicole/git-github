import json
import os
from datetime import datetime, timezone

import boto3

from services.response import build_response


def lambda_handler(event, _context):
    payload = json.loads(event.get("body", "{}"))
    source = payload.get("source", "smart_meter")
    meter_id = payload.get("meter_id", "unknown")
    reading = payload.get("reading_kw", 0)

    dynamodb = boto3.resource("dynamodb")
    app_table = dynamodb.Table(os.environ["APP_TABLE"])

    item = {
        "pk": f"METER#{meter_id}",
        "sk": datetime.now(timezone.utc).isoformat(),
        "source": source,
        "reading_kw": reading,
        "event_type": payload.get("event_type", "usage"),
    }
    app_table.put_item(Item=item)

    return build_response(202, {"message": "Event ingested", "item": item})

import json
import os
from datetime import datetime, timezone
from uuid import uuid4

import boto3

from models.anomaly_model import detect_usage_anomaly
from services.response import build_response


def lambda_handler(event, _context):
    payload = json.loads(event.get("body", "{}"))
    readings = payload.get("readings", [])
    location_id = payload.get("location_id", "grid-segment-unknown")

    result = detect_usage_anomaly(readings)

    if result["is_anomaly"]:
        alerts_table = boto3.resource("dynamodb").Table(os.environ["ALERTS_TABLE"])
        alert = {
            "alert_id": str(uuid4()),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "location_id": location_id,
            "severity": "high" if abs(result["score"]) > 4 else "medium",
            "detail": result,
            "status": "open",
            "type": "grid_anomaly",
        }
        alerts_table.put_item(Item=alert)
        return build_response(200, {"detected": True, "alert": alert})

    return build_response(200, {"detected": False, "analysis": result})

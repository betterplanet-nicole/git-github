import os

import boto3

from services.response import build_response


def lambda_handler(_event, _context):
    table = boto3.resource("dynamodb").Table(os.environ["ALERTS_TABLE"])
    response = table.scan(Limit=25)
    alerts = response.get("Items", [])
    return build_response(200, {"alerts": alerts, "count": len(alerts)})

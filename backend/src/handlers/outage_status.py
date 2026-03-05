from services.response import build_response


def lambda_handler(event, _context):
    params = event.get("queryStringParameters") or {}
    location_id = params.get("location_id", "feeder-12")

    return build_response(
        200,
        {
            "location_id": location_id,
            "status": "active_outage",
            "affected_customers": 132,
            "estimated_restoration": "2026-03-04T19:30:00Z",
            "last_update": "Crew dispatched and isolation in progress",
        },
    )

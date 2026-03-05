from services.insight_service import explain_usage_spike
from services.response import build_response


def lambda_handler(event, _context):
    params = event.get("queryStringParameters") or {}
    customer_id = params.get("customer_id", "customer-demo")
    weather = params.get("weather")
    sample_usage = [18.1, 19.3, 17.9, 33.8, 21.2]

    insights = explain_usage_spike(customer_id=customer_id, usage_kwh=sample_usage, weather=weather)
    return build_response(200, insights)

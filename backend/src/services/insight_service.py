def explain_usage_spike(customer_id: str, usage_kwh: list[float], weather: str | None = None) -> dict:
    if not usage_kwh:
        return {
            "customer_id": customer_id,
            "summary": "No usage data available.",
            "drivers": [],
            "recommendations": [],
        }

    peak = max(usage_kwh)
    avg = sum(usage_kwh) / len(usage_kwh)
    increase_pct = ((peak - avg) / avg * 100) if avg else 0

    drivers = ["High HVAC demand"] if weather in {"heatwave", "cold_snap"} else ["Possible appliance overuse"]
    recommendations = [
        "Shift heavy appliance use to off-peak hours",
        "Enroll in demand-response notifications",
        "Check HVAC filters and thermostat schedule",
    ]

    return {
        "customer_id": customer_id,
        "summary": f"Your peak usage was {increase_pct:.1f}% above your average baseline.",
        "drivers": drivers,
        "recommendations": recommendations,
    }

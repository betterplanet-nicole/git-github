from statistics import mean, pstdev


def detect_usage_anomaly(readings: list[float], sigma_threshold: float = 2.5) -> dict:
    if len(readings) < 3:
        return {
            "is_anomaly": False,
            "reason": "Need at least 3 readings for anomaly detection",
            "score": 0.0,
        }

    baseline = mean(readings[:-1])
    std_dev = pstdev(readings[:-1]) or 1.0
    latest = readings[-1]
    z_score = (latest - baseline) / std_dev

    return {
        "is_anomaly": abs(z_score) >= sigma_threshold,
        "reason": "Spike detected" if z_score > 0 else "Drop detected",
        "score": round(z_score, 2),
        "baseline": round(baseline, 2),
        "latest": latest,
    }

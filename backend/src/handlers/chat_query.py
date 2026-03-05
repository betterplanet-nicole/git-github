import json

from services.response import build_response


SYSTEM_PROMPT = (
    "You are TTME Assistant, focused on outage updates, billing spike explanations, and energy-saving insights. "
    "Do not offer plan enrollment, marketplace quotes, or lead generation."
)


def lambda_handler(event, _context):
    payload = json.loads(event.get("body", "{}"))
    question = payload.get("message", "")
    channel = payload.get("channel", "chat")

    response_text = (
        "I can help with outage status, unusual usage spikes, and practical ways to reduce demand. "
        f"You asked: '{question}'."
    )

    return build_response(
        200,
        {
            "channel": channel,
            "assistant": "ttme-support-copilot",
            "system_prompt": SYSTEM_PROMPT,
            "response": response_text,
        },
    )

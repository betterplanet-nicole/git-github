import { EventSnapshot } from "./types";

type ChatRequest = {
  message: string;
  snapshot: EventSnapshot;
};

const cite = (fields: string[]) => `Data fields used: ${fields.join(", ")}.`;

const rulesReply = ({ message, snapshot }: ChatRequest) => {
  const lower = message.toLowerCase();

  if (lower.includes("bill")) {
    return {
      text: `Your bill is higher mainly due to increased usage (${snapshot.billing.currentMonthKwh} kWh vs ${snapshot.billing.previousMonthKwh} kWh). Estimated total is $${snapshot.billing.estimatedBill.toFixed(
        2
      )}. Top drivers: ${snapshot.billing.drivers.join(", ")}.`,
      citations: cite([
        "billing.currentMonthKwh",
        "billing.previousMonthKwh",
        "billing.estimatedBill",
        "billing.drivers"
      ])
    };
  }

  if (lower.includes("outage")) {
    const active = snapshot.outages.filter((item) => item.status !== "Resolved");
    return {
      text: active.length
        ? `Current outage-related events: ${active
            .map((item) => `${item.area} (${item.status}, ${item.affectedCustomers} affected)`)
            .join("; ")}.`
        : "No active outages currently reported.",
      citations: cite(["outages.area", "outages.status", "outages.affectedCustomers"])
    };
  }

  if (lower.includes("peak") || lower.includes("feeder")) {
    const peak = snapshot.usageSeries.reduce((prev, curr) =>
      curr.feederA12 > prev.feederA12 ? curr : prev
    );
    return {
      text: `Feeder A12 peaks at ${peak.feederA12} kW around ${peak.time}. Consider shifting discretionary loads outside this window.`,
      citations: cite(["usageSeries.time", "usageSeries.feederA12"])
    };
  }

  return {
    text: "I can help with billing spikes, outage checks, and feeder peak summaries. Ask a specific utility operations question.",
    citations: cite(["billing", "outages", "usageSeries"])
  };
};

const callOllama = async ({ message }: ChatRequest) => {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: process.env.OLLAMA_MODEL ?? "llama3", prompt: message, stream: false })
  });
  if (!response.ok) throw new Error("ollama request failed");
  const data = (await response.json()) as { response?: string };
  return data.response ?? "No response from local model.";
};

const callOpenAICompatible = async ({ message }: ChatRequest) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");
  const base = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const response = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      temperature: 0.2
    })
  });

  if (!response.ok) throw new Error("openai-compatible request failed");
  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? "No response available.";
};

export const generateChatResponse = async (request: ChatRequest) => {
  const provider = process.env.AI_PROVIDER ?? "rules";
  try {
    if (provider === "ollama") {
      const text = await callOllama(request);
      return { text, citations: "Data fields used: provider-generated response (external model).", provider };
    }
    if (provider === "openai") {
      const text = await callOpenAICompatible(request);
      return { text, citations: "Data fields used: provider-generated response (external model).", provider };
    }
  } catch {
    const fallback = rulesReply(request);
    return { ...fallback, provider: "rules-fallback" };
  }

  const fallback = rulesReply(request);
  return { ...fallback, provider: "rules" };
};

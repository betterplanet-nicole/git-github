import { AlertRow, EventSnapshot, Severity } from "./types";

const hashSeed = (value: string) => {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const createRng = (seed: string) => {
  let state = hashSeed(seed) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 1000) / 1000;
  };
};

const pickSeverity = (n: number): Severity => {
  if (n > 0.82) return "high";
  if (n > 0.55) return "medium";
  return "low";
};

export const generateSnapshot = (seed: string, utility = "Metro Utility North"): EventSnapshot => {
  const rng = createRng(seed);
  const now = new Date();

  const usageSeries = Array.from({ length: 18 }, (_, index) => {
    const base = 430 + Math.round(rng() * 120);
    const spike = rng() > 0.88 ? 180 : 0;
    return {
      time: `${index.toString().padStart(2, "0")}:00`,
      feederA12: base + spike,
      feederB07: base - 60 + Math.round(rng() * 70),
      feederC19: base - 20 + Math.round(rng() * 80)
    };
  });

  const alerts: AlertRow[] = Array.from({ length: 8 }, (_, i) => {
    const draw = rng();
    const severity = pickSeverity(draw);
    const status = draw > 0.75 ? "open" : draw > 0.45 ? "investigating" : "resolved";
    return {
      id: `ALT-${i + 101}`,
      type: ["Voltage swing", "Phase imbalance", "Meter tamper", "Load surge"][i % 4],
      asset: `Feeder ${["A12", "B07", "C19", "D04"][i % 4]}`,
      severity,
      status,
      timestamp: new Date(now.getTime() - i * 17 * 60000).toISOString()
    };
  });

  const heatmap = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => Math.floor(rng() * 4))
  );

  return {
    generatedAt: now.toISOString(),
    utility,
    usageSeries,
    heatmap,
    alerts,
    workload: {
      openChats: 12 + Math.floor(rng() * 8),
      deflectionRate: 64 + Math.floor(rng() * 25),
      avgHandleMinutes: 4 + Math.floor(rng() * 4)
    },
    ticketlessResolutions: Array.from({ length: 6 }, (_, i) => ({
      id: `RSL-${i + 1}`,
      intent: ["Bill explanation", "Outage status", "Payment receipt", "Peak-hour tips"][i % 4],
      channel: ["Web", "SMS", "App", "IVR"][i % 4],
      timestamp: new Date(now.getTime() - i * 23 * 60000).toISOString()
    })),
    billing: {
      currentMonthKwh: 908,
      previousMonthKwh: 742,
      estimatedBill: 186.2,
      drivers: ["Higher cooling load", "Peak-hour appliance usage", "Weekend EV charging"]
    },
    outages: [
      { area: "North Industrial", status: "Investigating", affectedCustomers: 132 },
      { area: "Riverdale", status: "Resolved", affectedCustomers: 44 },
      { area: "Midtown", status: "Monitoring", affectedCustomers: 86 }
    ]
  };
};

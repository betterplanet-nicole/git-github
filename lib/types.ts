export type UtilityContent = {
  nav: string[];
  hero: {
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
  };
  personas: string[];
  painPoints: string[];
  features: Array<{ title: string; description: string }>;
  steps: string[];
  outputs: Array<{ title: string; description: string }>;
  stats: Array<{ label: string; value: string }>;
  footerLinks: string[];
};

export type Severity = "low" | "medium" | "high";

export type AlertRow = {
  id: string;
  type: string;
  asset: string;
  severity: Severity;
  timestamp: string;
  status: "open" | "investigating" | "resolved";
};

export type EventSnapshot = {
  generatedAt: string;
  utility: string;
  usageSeries: Array<{ time: string; feederA12: number; feederB07: number; feederC19: number }>;
  heatmap: number[][];
  alerts: AlertRow[];
  workload: { openChats: number; deflectionRate: number; avgHandleMinutes: number };
  ticketlessResolutions: Array<{ id: string; intent: string; channel: string; timestamp: string }>;
  billing: { currentMonthKwh: number; previousMonthKwh: number; estimatedBill: number; drivers: string[] };
  outages: Array<{ area: string; status: string; affectedCustomers: number }>;
};

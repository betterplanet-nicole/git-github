"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { EventSnapshot } from "@/lib/types";

const heatClass = (value: number) => {
  if (value === 0) return "bg-emerald-100";
  if (value === 1) return "bg-yellow-200";
  if (value === 2) return "bg-orange-300";
  return "bg-red-400";
};

const navItems = ["Dashboard", "Outages", "Usage", "Support Chat", "Settings"];

type ChatItem = { role: "user" | "assistant"; text: string };

export const DemoDashboard = () => {
  const [snapshot, setSnapshot] = useState<EventSnapshot | null>(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatItem[]>([]);
  const [providerHint, setProviderHint] = useState("rules");
  const [providerOverride, setProviderOverride] = useState("rules");

  const refresh = async () => {
    const response = await fetch(`/api/events?seed=${Date.now()}`);
    const json = (await response.json()) as EventSnapshot;
    setSnapshot(json);
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!snapshot || !message.trim()) return;
    const userMessage = message.trim();
    setMessage("");
    setChat((prev) => [...prev, { role: "user", text: userMessage }]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, snapshot, providerOverride })
    });
    const json = (await response.json()) as { text: string; citations: string; provider: string };
    setProviderHint(json.provider);
    setChat((prev) => [...prev, { role: "assistant", text: `${json.text}\n${json.citations}` }]);
  };

  const workloadTiles = useMemo(
    () => [
      { label: "Open chats", value: snapshot?.workload.openChats ?? 0 },
      { label: "Deflection %", value: `${snapshot?.workload.deflectionRate ?? 0}%` },
      { label: "Avg handle time", value: `${snapshot?.workload.avgHandleMinutes ?? 0} min` }
    ],
    [snapshot]
  );

  if (!snapshot) {
    return <p className="p-6">Loading demo snapshot…</p>;
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-100 lg:grid-cols-[250px_1fr]">
      <aside className="border-r border-slate-200 bg-white p-4">
        <h1 className="text-lg font-bold text-brand-900">UtilityOps Demo</h1>
        <nav className="mt-5 space-y-2">
          {navItems.map((item) => (
            <button
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              key={item}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <div>
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex flex-wrap gap-2 text-sm">
            <select aria-label="Utility selector" className="rounded-md border border-slate-300 px-2 py-1">
              <option>{snapshot.utility}</option>
              <option>Central Grid Co.</option>
            </select>
            <select aria-label="Date range" className="rounded-md border border-slate-300 px-2 py-1">
              <option>Last 24h</option>
              <option>Last 7 days</option>
            </select>
          </div>
          <button
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white"
            onClick={refresh}
            type="button"
          >
            Simulate Event
          </button>
        </header>

        <main className="space-y-4 p-4">
          <section className="grid gap-4 xl:grid-cols-3">
            <article className="rounded-2xl bg-white p-4 shadow-sm xl:col-span-2">
              <h2 className="font-semibold">Real-time Feeder Usage</h2>
              <div className="mt-4 h-64" aria-label="feeder usage line chart">
                <ResponsiveContainer>
                  <LineChart data={snapshot.usageSeries}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="feederA12" stroke="#0f8fff" dot={false} />
                    <Line dataKey="feederB07" stroke="#0a4fa8" dot={false} />
                    <Line dataKey="feederC19" stroke="#0b3f86" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="font-semibold">Outage Heatmap</h2>
              <div className="mt-4 grid grid-cols-10 gap-1" aria-label="outage heatmap grid">
                {snapshot.heatmap.flatMap((row, rowIndex) =>
                  row.map((value, colIndex) => (
                    <div
                      className={`h-5 w-5 rounded-sm ${heatClass(value)}`}
                      key={`${rowIndex}-${colIndex}`}
                      title={`cell ${rowIndex},${colIndex} severity ${value}`}
                    />
                  ))
                )}
              </div>
            </article>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <article className="rounded-2xl bg-white p-4 shadow-sm xl:col-span-2">
              <h2 className="font-semibold">Alerts</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="p-2">Type</th>
                      <th className="p-2">Asset</th>
                      <th className="p-2">Severity</th>
                      <th className="p-2">Timestamp</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.alerts.map((alert) => (
                      <tr className="border-t border-slate-100" key={alert.id}>
                        <td className="p-2">{alert.type}</td>
                        <td className="p-2">{alert.asset}</td>
                        <td className="p-2 capitalize">{alert.severity}</td>
                        <td className="p-2">{new Date(alert.timestamp).toLocaleTimeString()}</td>
                        <td className="p-2 capitalize">{alert.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="font-semibold">Support Workload</h2>
              <div className="mt-3 space-y-2">
                {workloadTiles.map((tile) => (
                  <div className="rounded-lg border border-slate-200 p-3" key={tile.label}>
                    <p className="text-sm text-slate-500">{tile.label}</p>
                    <p className="text-xl font-semibold">{tile.value}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <article className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="font-semibold">Ticketless Resolution Log</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {snapshot.ticketlessResolutions.map((entry) => (
                  <li className="rounded-lg border border-slate-200 p-3" key={entry.id}>
                    <p className="font-medium">{entry.intent}</p>
                    <p className="text-slate-500">
                      {entry.channel} · {new Date(entry.timestamp).toLocaleTimeString()}
                    </p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold">Support Chat</h2>
                <label className="text-xs text-slate-600">
                  Provider
                  <select
                    aria-label="AI provider selector"
                    className="ml-2 rounded border border-slate-300 px-1 py-0.5"
                    onChange={(event) => setProviderOverride(event.target.value)}
                    value={providerOverride}
                  >
                    <option value="rules">Rules (free)</option>
                    <option value="ollama">Ollama (local)</option>
                    <option value="openai">OpenAI-compatible</option>
                  </select>
                </label>
              </div>
              <p className="text-xs text-slate-500">Provider in use: {providerHint}</p>
              <div className="mt-3 h-56 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
                {chat.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Try: “Why is my bill high this month?” or “Is there an outage in my area?”
                  </p>
                ) : null}
                {chat.map((entry, i) => (
                  <p
                    className={`whitespace-pre-line rounded-lg px-3 py-2 text-sm ${
                      entry.role === "user" ? "bg-brand-50" : "bg-slate-100"
                    }`}
                    key={`${entry.role}-${i}`}
                  >
                    {entry.text}
                  </p>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  aria-label="Chat message input"
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void sendMessage();
                  }}
                  placeholder="Ask a utility question"
                  value={message}
                />
                <button
                  className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => void sendMessage()}
                  type="button"
                >
                  Send
                </button>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
};

import React, { useMemo, useState } from "react";

const IDLE_QUOTES = [
  "No alerts. Your bill is breathing easy.",
  "Current saved today means snacks survived tomorrow.",
  "I am watching the switches, boss. You handle the demo.",
  "Quiet rooms, happy wallet.",
];

const ALERT_QUOTES = [
  "Something is still running. The electricity bill is doing push-ups.",
  "A room is pulling extra power. Time to investigate before taka flies away.",
  "Alert spotted. I would check the glowing room first.",
  "Power leak vibes detected. Small action, big savings.",
];

export default function AlertsPanel({ alerts }) {
  const hasAlerts = alerts.length > 0;

  return (
    <div className="soft-card rounded-[2rem] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-display font-semibold tracking-[0.18em] uppercase text-leaf-dark">
            Alert Timeline
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink-900">Energy Alerts</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold shadow-sm ${hasAlerts ? "bg-alertred text-white" : "bg-white/70 text-ink-500"}`}>
          {hasAlerts ? `${alerts.length} active` : "Clear"}
        </span>
      </div>

      {!hasAlerts ? null : (
        <ul className="mt-5 max-h-64 space-y-3 overflow-y-auto pr-1 scrollbar-thin">
          {alerts.map((a) => (
            <li
              key={a.id}
              className={`rounded-2xl px-4 py-3 shadow-sm ${
                a.level === "critical"
                  ? "bg-[#ffe3e6] text-[#8f2530]"
                  : "bg-sun-soft text-[#805714]"
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <span className="text-sm font-bold leading-snug">{a.message}</span>
              </div>
              <span className="mt-2 block text-[11px] font-mono opacity-70">
                {new Date(a.timestamp).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AlertAssistant({ alerts }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const hasAlerts = alerts.length > 0;
  const quotes = hasAlerts ? ALERT_QUOTES : IDLE_QUOTES;
  const quote = useMemo(() => {
    if (hasAlerts && quoteIndex === 0 && alerts[0]?.message) return alerts[0].message;
    return quotes[quoteIndex % quotes.length];
  }, [alerts, hasAlerts, quoteIndex, quotes]);

  return (
    <AssistantCard
      quote={quote}
      onClick={() => setQuoteIndex((current) => current + 1)}
      hasAlerts={hasAlerts}
    />
  );
}

function AssistantCard({ quote, onClick, hasAlerts }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-3xl bg-white/64 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-leaf/35"
      aria-label="Show assistant energy tip"
    >
      <span className="relative grid h-20 w-20 shrink-0 place-items-center">
        <span className={`assistant-orb absolute inset-0 rounded-full ${hasAlerts ? "bg-alertred/12" : "bg-leaf-soft"}`} />
        <span className="assistant-bot relative grid h-16 w-16 place-items-center rounded-[1.35rem] bg-[#f7fbf1] shadow-[0_14px_30px_rgba(66,82,73,0.18)] ring-1 ring-white">
          <span className="assistant-antenna absolute -top-4 h-5 w-1 rounded-full bg-[#9db9a4]" />
          <span className="assistant-spark absolute -right-1 -top-2 h-3 w-3 rounded-full bg-sun" />
          <span className="absolute -top-2 h-4 w-7 rounded-full bg-[#d7e5d8]" />
          <span className="absolute top-5 flex gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${hasAlerts ? "bg-alertred" : "bg-leaf"}`} />
            <span className={`h-2.5 w-2.5 rounded-full ${hasAlerts ? "bg-alertred" : "bg-leaf"}`} />
          </span>
          <span className="absolute left-3 top-9 h-2 w-2 rounded-full bg-[#f7b6a6]/70" />
          <span className="absolute right-3 top-9 h-2 w-2 rounded-full bg-[#f7b6a6]/70" />
          <span className="assistant-mouth absolute bottom-4 h-1.5 w-7 rounded-full bg-ink-500/35" />
          <span className="assistant-hand absolute -right-2 bottom-3 h-4 w-2 rounded-full bg-[#d7e5d8]" />
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-display font-black uppercase tracking-[0.18em] text-leaf-dark">
          Current Buddy
        </span>
        <span className="mt-1 block text-sm font-bold leading-snug text-ink-700">
          {quote}
        </span>
        <span className="mt-2 block text-[11px] font-bold text-ink-500">
          Click for another tip
        </span>
      </span>
    </button>
  );
}

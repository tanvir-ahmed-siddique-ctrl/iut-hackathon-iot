import React from "react";

export default function PowerMeter({ totalWatts, byRoom, todayKwh, maxWatts }) {
  const rooms = Object.entries(byRoom || {});
  const roomCapacity = Math.max(1, Math.ceil((maxWatts || 1) / Math.max(1, rooms.length)));
  const loadPercent = Math.min(100, Math.round((totalWatts / Math.max(1, maxWatts || totalWatts)) * 100));

  return (
    <aside className="soft-card rounded-[2rem] p-5 sm:p-6 h-full">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-display font-semibold tracking-[0.18em] uppercase text-leaf-dark">
            Live Usage
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink-900">
            Power Meter
          </h2>
        </div>
        <span className="rounded-full bg-alertred px-3 py-1 text-[11px] font-bold text-white shadow-sm">
          {loadPercent >= 60 ? "High" : "Normal"}
        </span>
      </div>

      <div className="mt-7 flex flex-col items-center">
        <div
          className="grid h-44 w-44 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#2f9f6b ${loadPercent * 3.6}deg, #e9eadf 0deg)`,
          }}
        >
          <div className="grid h-32 w-32 place-items-center rounded-full bg-paper-50 shadow-inner">
            <div className="text-center">
              <div className="font-mono text-4xl font-bold text-ink-900">{loadPercent}%</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                office load
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 text-center">
          <div className="font-mono text-4xl font-bold text-leaf-dark">{totalWatts}W</div>
          <div className="mt-1 text-sm text-ink-500">currently drawing power</div>
        </div>
      </div>

      <div className="mt-7 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink-900">Room Health</h3>
          <span className="font-mono text-xs text-ink-500">{todayKwh} kWh today</span>
        </div>

        {rooms.map(([room, watts]) => {
          const percent = Math.min(100, Math.round((watts / roomCapacity) * 100));
          return (
          <div key={room}>
            <div className="mb-1.5 flex justify-between text-xs font-semibold text-ink-700">
              <span>{room}</span>
              <span>{watts}W</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-mist-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-leaf via-sun to-alertred transition-all duration-700"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          );
        })}
      </div>
    </aside>
  );
}

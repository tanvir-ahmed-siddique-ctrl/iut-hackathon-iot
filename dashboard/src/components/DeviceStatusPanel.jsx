import React, { useEffect, useState } from "react";

const ROOM_ORDER = ["Drawing Room", "Work Room 1", "Work Room 2"];

export default function DeviceStatusPanel({ devices }) {
  const now = useTicker();
  const byRoom = ROOM_ORDER.map((room) => ({
    room,
    devices: devices.filter((d) => d.room === room),
  }));

  return (
    <div className="soft-card rounded-[2rem] p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-ink-900">
          Device Inventory
        </h2>
        <span className="rounded-full bg-leaf-soft px-3 py-1 text-xs font-mono font-bold text-leaf-dark">
          {devices.filter((d) => d.status === "on").length}/{devices.length} ON
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {byRoom.map(({ room, devices }) => (
          <div key={room} className="rounded-3xl bg-white/55 p-3 sm:p-4">
            <h3 className="mb-3 text-xs font-display font-bold tracking-[0.16em] text-ink-500 uppercase">
              {room}
            </h3>
            <ul className="space-y-2.5">
              {devices.map((d) => (
                <li
                  key={d.id}
                  className="rounded-2xl bg-paper-50/78 px-3 py-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <DeviceIcon type={d.type} on={d.status === "on"} />
                      <div className="min-w-0">
                        <span className="block truncate text-sm font-bold text-ink-900">{d.name}</span>
                        <span className="mt-0.5 block text-[11px] font-medium text-ink-500">
                          {d.type.toUpperCase()} - {d.wattage}W rated
                        </span>
                      </div>
                    </div>
                    <StatusPill on={d.status === "on"} />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-white/68 px-3 py-2">
                    <span className="text-[10px] font-display font-bold uppercase tracking-[0.14em] text-ink-500">
                      Duration
                    </span>
                    <span className={`font-mono text-xs font-black ${d.status === "on" ? "text-leaf-dark" : "text-stone-500"}`}>
                      {formatStateDuration(d, now)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeviceIcon({ type, on }) {
  const tone = on ? (type === "fan" ? "bg-leaf-soft text-leaf-dark" : "bg-sun-soft text-[#936315]") : "bg-stone-100 text-stone-500";
  return (
    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${tone}`}>
      {type === "fan" ? "F" : "L"}
    </span>
  );
}

function StatusPill({ on }) {
  return (
    <span
      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
        on
          ? "bg-leaf text-white"
          : "bg-stone-200 text-stone-500"
      }`}
    >
      {on ? "ON" : "OFF"}
    </span>
  );
}

function useTicker() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}

function formatStateDuration(device, now) {
  const label = device.status === "on" ? "Running for" : "Off for";
  return `${label} ${formatDuration(device.lastChanged, now)}`;
}

function formatDuration(value, now) {
  const changed = new Date(value).getTime();
  if (!Number.isFinite(changed)) return "recently";

  const seconds = Math.max(0, Math.floor((now - changed) / 1000));
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

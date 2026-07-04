import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "./hooks/useSocket.js";
import OfficeLayout from "./components/OfficeLayout.jsx";
import DeviceStatusPanel from "./components/DeviceStatusPanel.jsx";
import PowerMeter from "./components/PowerMeter.jsx";
import AlertsPanel, { AlertAssistant } from "./components/AlertsPanel.jsx";

export default function App() {
  const { snapshot, alerts, connected, alertNotice } = useSocket();
  const [toast, setToast] = useState(null);
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);

  useEffect(() => {
    if (!alertNotice) return;
    setToast({ type: "alert", message: alertNotice.message || "New energy alert received." });
    playAlertChime();
  }, [alertNotice]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!snapshot) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-ink-500 font-body">
        <div className="soft-card rounded-3xl px-6 py-5 text-sm font-medium">
          Connecting to office backend...
        </div>
        {!introDone && <IntroSequence onDone={finishIntro} />}
      </div>
    );
  }

  const devices = snapshot.devices || [];
  const onDevices = devices.filter((d) => d.status === "on");
  const fans = devices.filter((d) => d.type === "fan");
  const lights = devices.filter((d) => d.type === "light");
  const maxWatts = Math.max(1, devices.reduce((sum, d) => sum + d.wattage, 0));
  const loadPercent = Math.round((snapshot.totalWatts / maxWatts) * 100);
  const highPowerRoom = getHighPowerRoom(snapshot.byRoom);
  const allDevicesOff = onDevices.length === 0;

  return (
    <div className="min-h-screen px-3 py-4 sm:px-5 lg:px-7 lg:py-7">
      <main className="mx-auto w-full max-w-[1680px] space-y-7">
        <section className="soft-card rounded-[28px] p-4 sm:p-6 lg:p-8">
          <OfficeViewHeader connected={connected} />
          <div className="mt-6 overflow-hidden rounded-[24px] bg-white/35 p-2 sm:p-3">
            <OfficeLayout devices={devices} byRoom={snapshot.byRoom} />
          </div>
        </section>

        <StatsStrip
          totalWatts={snapshot.totalWatts}
          loadPercent={loadPercent}
          onDevices={onDevices.length}
          totalDevices={devices.length}
          fansOn={fans.filter((d) => d.status === "on").length}
          totalFans={fans.length}
          lightsOn={lights.filter((d) => d.status === "on").length}
          totalLights={lights.length}
        />

        <ActionRail
          highPowerRoom={highPowerRoom}
          maxWatts={maxWatts}
          allDevicesOff={allDevicesOff}
        />

        <DeviceStatusPanel devices={devices} />

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <PowerMeter
            totalWatts={snapshot.totalWatts}
            byRoom={snapshot.byRoom}
            todayKwh={snapshot.todayKwh}
            maxWatts={maxWatts}
          />
          <div className="space-y-5">
            <AlertAssistant alerts={alerts} />
            <AlertsPanel alerts={alerts} />
          </div>
        </section>

        <Footer />
      </main>
      <Toast toast={toast} />
      {!introDone && <IntroSequence onDone={finishIntro} />}
    </div>
  );
}

function IntroSequence({ onDone }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2600);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="intro-scene" aria-hidden="true">
      <div className="intro-copy">
        <span>Entering office monitor</span>
        <strong>Current Bachaao</strong>
      </div>
      <div className="intro-camera">
        <div className="intro-building">
          <div className="intro-sky-glow" />
          <div className="intro-trees intro-trees-left">
            {Array.from({ length: 7 }).map((_, index) => (
              <span key={`tree-left-${index}`} />
            ))}
          </div>
          <div className="intro-trees intro-trees-right">
            {Array.from({ length: 6 }).map((_, index) => (
              <span key={`tree-right-${index}`} />
            ))}
          </div>
          <div className="intro-tower intro-tower-left">
            {Array.from({ length: 28 }).map((_, index) => (
              <span key={`left-${index}`} />
            ))}
          </div>
          <div className="intro-tower intro-tower-main">
            {Array.from({ length: 64 }).map((_, index) => (
              <span key={`main-${index}`} />
            ))}
          </div>
          <div className="intro-tower intro-tower-right">
            {Array.from({ length: 40 }).map((_, index) => (
              <span key={`right-${index}`} />
            ))}
          </div>
          <div className="intro-floor">
            <div className="intro-wall" />
            <div className="intro-room">
              <span className="intro-window-line intro-window-top" />
              <span className="intro-window-line intro-window-side" />
              <span className="intro-desk" />
              <span className="intro-sofa" />
              <span className="intro-light-dot intro-light-one" />
              <span className="intro-light-dot intro-light-two" />
              <span className="intro-fan-dot" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OfficeViewHeader({ connected }) {
  const now = useClock();

  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
          CURRENT BACHAOO
        </h1>
        <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-ink-500">
        Your electricity bill shouldn't give you a heart attack. Current Bachao helps you save power before your wallet files a complaint
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-mono font-bold text-ink-700 shadow-sm">
          <span className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-leaf animate-pulse-glow" : "bg-alertred"}`} />
          <span>{connected ? "LIVE" : "DISCONNECTED"}</span>
        </div>
      </div>

      <div className="md:text-right">
        <div className="font-mono text-3xl font-black leading-none text-ink-900 sm:text-4xl lg:text-5xl">
          {now.toLocaleTimeString("en-US", { hour12: false })}
        </div>
        <div className="mt-2 text-xs font-bold text-ink-500">
          {now.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}

function useClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}

function ActionRail({ highPowerRoom, maxWatts, allDevicesOff }) {
  const percent = Math.min(100, Math.round((highPowerRoom.watts / Math.max(1, maxWatts)) * 100));

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-[18px] bg-white/72 p-5 shadow-[0_14px_34px_rgba(66,82,73,0.08)] ring-1 ring-white/70">
        <p className="text-xs font-display font-black uppercase tracking-[0.18em] text-leaf-dark">
          High Power Room
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-900">
              {highPowerRoom.room}
            </h2>
            <p className="mt-1 text-sm font-semibold text-ink-500">
              Currently drawing the most power from the office.
            </p>
          </div>
          <div className="font-mono text-3xl font-black text-alertred">{highPowerRoom.watts}W</div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-mist-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-leaf via-sun to-alertred transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className={`boss-lock-card ${allDevicesOff ? "boss-lock-card-off" : ""}`}>
        <span className="boss-lock-icon" aria-hidden="true">
          {allDevicesOff ? "OFF" : "!"}
        </span>
        <span className="min-w-0 relative z-10">
          <span className="block text-xs font-display font-black uppercase tracking-[0.2em] opacity-75">
            Boss Control
          </span>
          <span className="mt-1 block font-display text-2xl font-black leading-tight">
            {allDevicesOff ? "All Devices Are Resting" : "Boss Has The Master Switch"}
          </span>
          <span className="mt-2 block text-sm font-semibold opacity-85">
            Shutdown works from Discord only: <span className="font-mono">!lockdown</span>.
          </span>
        </span>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="pb-2 text-center text-xs font-semibold text-ink-500">
      Current Bachaao - live office energy monitor powered by one shared backend.
    </footer>
  );
}

function Toast({ toast }) {
  if (!toast) return null;

  const tone =
    toast.type === "error"
      ? "bg-alertred text-white"
      : toast.type === "success"
        ? "bg-leaf-dark text-white"
        : "bg-ink-900 text-white";

  return (
    <div className={`fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl px-5 py-4 text-sm font-bold shadow-2xl ${tone}`}>
      {toast.message}
    </div>
  );
}

function getHighPowerRoom(byRoom = {}) {
  const entries = Object.entries(byRoom);
  if (!entries.length) return { room: "No room data", watts: 0 };
  const [room, watts] = entries.reduce((highest, current) => (current[1] > highest[1] ? current : highest), entries[0]);
  return { room, watts };
}

function playAlertChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.55);
    gain.connect(context.destination);

    [660, 880].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime + index * 0.11);
      oscillator.connect(gain);
      oscillator.start(context.currentTime + index * 0.11);
      oscillator.stop(context.currentTime + 0.42 + index * 0.11);
    });
  } catch {
    // Browser audio permissions can block chimes; the toast still appears.
  }
}

function StatsStrip({ totalWatts, loadPercent, onDevices, totalDevices, fansOn, totalFans, lightsOn, totalLights }) {
  const items = [
    { label: "Live Load", value: `${totalWatts}W`, detail: `${loadPercent}% office load` },
    { label: "Running", value: `${onDevices}/${totalDevices}`, detail: "devices on" },
    { label: "Fans", value: `${fansOn}/${totalFans}`, detail: "running" },
    { label: "Lights", value: `${lightsOn}/${totalLights}`, detail: "on" },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-[10px] bg-white/72 px-4 py-4 shadow-[0_14px_34px_rgba(66,82,73,0.08)] ring-1 ring-white/70 sm:px-5">
          <p className="text-[11px] font-display font-semibold uppercase tracking-[0.16em] text-ink-500">
            {item.label}
          </p>
          <div className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-ink-900">
            {item.value}
          </div>
          <p className="mt-1 text-xs text-ink-500">{item.detail}</p>
        </div>
      ))}
    </section>
  );
}

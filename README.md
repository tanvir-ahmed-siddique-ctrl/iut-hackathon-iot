# Current Bachaao - Office Energy Monitor

Current Bachaao is a hackathon-ready office energy monitoring system for the
"Lights, Fans, Discord: The Boss's Big Idea" brief. It simulates a small office,
streams live device state to a polished web dashboard, and exposes the same
truth to a Discord bot.

The core rule is simple: one backend, one source of truth. The dashboard and
the bot do not invent or duplicate data; both read from the same backend state.

```text
Simulated Devices -> Node/Express Backend + Socket.IO -> Web Dashboard
                                                 └-----> Discord Bot
```

## What It Includes

- Live simulated office data for 3 rooms:
  - Drawing Room
  - Work Room 1
  - Work Room 2
- 15 total devices:
  - 2 fans per room
  - 3 lights per room
- Real-time React dashboard with:
  - fast cinematic high-rise office intro
  - smooth dashboard fade/scroll entrance
  - top-view 3D-style office layout
  - live fan rotation and light glow
  - hover tooltips for device name, room, status, wattage, and last-changed time
  - device inventory with running/off duration
  - total power and per-room room health
  - high-power-room highlight
  - collapsed alert timeline with internal scrolling when alerts exist
  - toast notification and subtle chime for new live alerts
  - cute frontend-only assistant with clickable energy tips
- Discord bot commands:
  - `!status`
  - `!room <drawing|work1|work2>`
  - `!usage`
  - `!lockdown`
  - `!help`
- Boss-only shutdown:
  - The web dashboard is monitoring-only for shutdown.
  - Only Discord `!lockdown` can force all devices off.
- Architecture and hardware deliverables:
  - system diagram
  - circuit schematic write-up
  - Wokwi ESP32 simulation files

## Repository Layout

```text
office-monitor/
├── backend/
│   └── Express API, Socket.IO server, in-memory store, simulator, alerts
├── bot/
│   └── discord.js bot reading from the backend REST API
├── dashboard/
│   └── React + Vite + Tailwind dashboard
├── diagrams/
│   ├── system-diagram.svg
│   ├── circuit-schematic.md
│   └── wokwi/
└── README.md
```

## Device Count Note

The problem statement says every room has 2 fans + 3 lights, which is
`5 devices x 3 rooms = 15 devices`. Some text in the brief mentions 18 devices,
but this implementation follows the fixed room setup and uses 15 devices.

The source of truth is `backend/src/store.js`, so the device list can be changed
there if the requirement changes later.

## Prerequisites

- Node.js 18+
- npm
- Discord bot token for the bot
- Optional Groq API key for friendlier LLM-generated Discord replies

## Environment Files

Create `.env` files from the examples where available.

Backend:

```bash
cd backend
cp .env.example .env
```

Dashboard:

```bash
cd dashboard
cp .env.example .env
```

Expected dashboard variable:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Bot:

```bash
cd bot
cp .env.example .env
```

Expected bot variables:

```env
DISCORD_TOKEN=your_discord_bot_token
BACKEND_URL=http://localhost:4000
BOT_PREFIX=!
ALERT_CHANNEL_ID=optional_discord_channel_id
GROQ_API_KEY=optional_groq_key
```

## Running The Project

Run each part in its own terminal.

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at:

```text
http://localhost:4000
```

The backend starts:

- Express REST API
- Socket.IO live updates
- simulated device ticker
- alert engine

### 2. Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Dashboard runs at:

```text
http://localhost:5173
```

Open it in the browser. The dashboard receives live updates through Socket.IO,
so no manual refresh is needed.

### 3. Discord Bot

```bash
cd bot
npm install
npm start
```

In Discord, use:

```text
!status
!room drawing
!room work1
!room work2
!usage
!lockdown
!help
```

## Dashboard Details

The dashboard is designed as the main monitoring interface for the boss.

Key sections:

- Cinematic intro: a fast high-rise building entry animation that fades into
  the main dashboard.
- Top-view office layout: SVG-based floor plan with rooms, walls, corridor,
  furniture, windows, doors, lights, fans, and plants.
- Live usage snapshot: shows office load, running devices, fans, and lights.
- High Power Room: highlights the room currently drawing the most watts.
- Boss Control: explains that full shutdown is only available through Discord
  `!lockdown`; the dashboard shows when all devices are off.
- Device Inventory: organized by room, with each device's wattage and how long
  it has been running or off.
- Power Meter: total watt draw, per-room breakdown, and today's kWh.
- Alert Timeline: collapsed when empty; expands and scrolls internally when
  backend alerts exist.
- Current Buddy: animated frontend-only assistant with clickable friendly
  energy tips.

## Backend API

Main endpoints:

```text
GET  /api/devices
GET  /api/rooms
GET  /api/devices/room/:room
GET  /api/usage
GET  /api/alerts
POST /api/devices/:id/toggle
POST /api/devices/lockdown
```

`POST /api/devices/lockdown` sets every device to `off`, emits Socket.IO
updates, and returns the fresh snapshot. The dashboard does not expose this as
a button; the intended flow is through Discord `!lockdown`.

## Socket.IO Events

Dashboard listens for:

```text
devices:update
device:changed
alerts:new
```

When `alerts:new` fires, the dashboard also shows a toast and plays a subtle
browser chime when allowed by the browser.

## Alerts

Alert logic lives in `backend/src/alerts.js`.

Current alert types:

- Devices left on after office hours.
- A room where all devices have been on continuously for 2+ hours.

Alerts are de-duplicated so the same condition does not spam the dashboard or
Discord.

## Discord Bot

The bot lives in `bot/src/bot.js` and reads from the backend REST API.

| Command | Purpose |
|---|---|
| `!status` | Summarizes all rooms. |
| `!room <name>` | Shows a specific room's fan/light status. |
| `!usage` | Shows current total wattage and today's kWh. |
| `!lockdown` | Boss-only command that turns all 15 devices off. |
| `!help` | Lists commands. |

If `GROQ_API_KEY` is set, `bot/src/llm.js` uses it to humanize replies while
keeping facts from the backend fixed. Without the key, it falls back to
deterministic template replies.

If `ALERT_CHANNEL_ID` is set, the bot polls `/api/alerts` and proactively posts
new alerts to that Discord channel.

## Diagrams And Hardware Concept

Required deliverables are included:

- `diagrams/system-diagram.svg`
  - high-level flow from simulated devices to backend, dashboard, and Discord.
- `diagrams/circuit-schematic.md`
  - representative ESP32/Arduino-style wiring concept for one room.
- `diagrams/wokwi/`
  - Wokwi simulation files for the hardware concept.

## Testing And Verification

Useful checks:

```bash
cd dashboard
npm run build
```

```bash
cd backend
node --check src/routes/api.js
node --check src/store.js
```

```bash
cd bot
node --check src/bot.js
```

Manual demo checks:

- Dashboard loads and shows cinematic intro.
- Office SVG updates without refresh.
- Fans animate only when `status === "on"`.
- Lights glow only when `status === "on"`.
- Device inventory durations update.
- Alert timeline receives backend alerts.
- Toast/chime fires for new live alerts.
- `!status`, `!room`, `!usage`, and `!lockdown` work in Discord.
- After `!lockdown`, dashboard shows all devices off.

## Video Demo Checklist

For a short demo video:

1. Start backend, dashboard, and bot.
2. Show the dashboard intro and live office layout.
3. Show power meter, high-power-room highlight, device inventory, and alerts.
4. Run Discord commands:
   - `!status`
   - `!room work1`
   - `!usage`
   - `!lockdown`
5. Return to dashboard and show that all devices are off.
6. Briefly explain the single-backend architecture and diagrams.

> Demo video: _add link_

# Current Bachaao - Office Energy Monitor

Current Bachaao is a monitoring system for the
"Lights, Fans, Discord: The Boss's Big Idea" brief. It simulates a small office,
streams live device state to a polished web dashboard, and exposes the same
truth to a Discord bot.

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

## Prerequisites

- Node.js 18+
- npm
- Discord bot token for the bot
- Optional Groq API key for friendlier LLM-generated Discord replies

Expected bot variables:

```env
DISCORD_TOKEN=your_discord_bot_token
BACKEND_URL=http://localhost:4000
BOT_PREFIX=!
ALERT_CHANNEL_ID=optional_discord_channel_id
GROQ_API_KEY=optional_groq_key
```

Backend setup:
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
```env
VITE_BACKEND_URL=http://localhost:4000
```

Discord bot setup:
```bash
cd bot
cp .env.example .env
npm install
npm start
```

Frontend setup:
```bash
cd dashboard
cp .env.example .env
npm install
npm run dev
```
Dashboard runs at:
```text
http://localhost:5173
```


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


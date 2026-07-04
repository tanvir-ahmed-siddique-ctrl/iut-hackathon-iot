import React from "react";

const ROOM_WIDTH = 318;
const ROOM_HEIGHT = 330;
const CORRIDOR_HEIGHT = 128;
const TOP = 46;

const ROOMS = [
  { key: "drawing", label: "Drawing Room", x: 0, floorId: "drawingFloor", floorPattern: "woodLines", accent: "#8a765b" },
  { key: "work1", label: "Work Room 1", x: ROOM_WIDTH, floorId: "workOneFloor", floorPattern: "tileGrid", accent: "#66746d" },
  { key: "work2", label: "Work Room 2", x: ROOM_WIDTH * 2, floorId: "workTwoFloor", floorPattern: "woodLines", accent: "#5d8068" },
];

const LAYOUT = {
  "light-1": { x: 108, y: 92 },
  "fan-1": { x: 160, y: 128 },
  "light-2": { x: 218, y: 186 },
  "fan-2": { x: 160, y: 254 },
  "light-3": { x: 100, y: 276 },
};

function indexDevices(devices) {
  // group + index within room/type so we can look up LAYOUT positions
  const counters = {};
  const byId = {};
  for (const d of devices) {
    const ckey = `${d.roomKey}-${d.type}`;
    counters[ckey] = (counters[ckey] || 0) + 1;
    byId[d.id] = { ...d, index: counters[ckey] };
  }
  return byId;
}

export default function OfficeLayout({ devices, byRoom = {} }) {
  const indexed = indexDevices(devices || []);
  const byRoomAndPos = {};
  for (const d of Object.values(indexed)) {
    const posKey = `${d.type}-${d.index}`;
    byRoomAndPos[`${d.roomKey}:${posKey}`] = d;
  }

  return (
    <svg
      viewBox={`0 0 ${ROOM_WIDTH * 3} ${ROOM_HEIGHT + CORRIDOR_HEIGHT + TOP + 34}`}
      className="w-full h-auto select-none"
      role="img"
      aria-label="Top-down office floor plan showing live device status"
    >
      <defs>
        <filter id="objectShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="9" stdDeviation="7" floodColor="#596a5b" floodOpacity="0.2" />
        </filter>
        <filter id="wallShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="11" floodColor="#556252" floodOpacity="0.2" />
        </filter>
        <filter id="softBlur" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <filter id="lightGlow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="13" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="fanGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="drawingFloor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8ead6" />
          <stop offset="100%" stopColor="#ead8bf" />
        </linearGradient>
        <linearGradient id="workOneFloor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#edf2ed" />
          <stop offset="100%" stopColor="#dde8df" />
        </linearGradient>
        <linearGradient id="workTwoFloor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#edf6ec" />
          <stop offset="100%" stopColor="#d7ead9" />
        </linearGradient>
        <linearGradient id="corridorFloor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f2e3c8" />
          <stop offset="100%" stopColor="#ead8b8" />
        </linearGradient>
        <linearGradient id="windowGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c5f4f4" />
          <stop offset="48%" stopColor="#f8ffff" />
          <stop offset="100%" stopColor="#a9dfea" />
        </linearGradient>
        <radialGradient id="bulbOn" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#fffdf4" />
          <stop offset="44%" stopColor="#ffd86b" />
          <stop offset="100%" stopColor="#e4a83a" />
        </radialGradient>
        <linearGradient id="deskTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#aa8260" />
          <stop offset="100%" stopColor="#76543b" />
        </linearGradient>
        <linearGradient id="sofaFabric" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a98465" />
          <stop offset="100%" stopColor="#70523d" />
        </linearGradient>
        <pattern id="woodLines" width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M 0 0 V 34 M 17 0 V 34" stroke="#c99f70" strokeWidth="1" opacity="0.22" />
          <path d="M 4 0 C 12 10 8 22 15 34" fill="none" stroke="#b98555" strokeWidth="0.8" opacity="0.16" />
        </pattern>
        <pattern id="tileGrid" width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M 34 0 H 0 V 34" fill="none" stroke="#bccac1" strokeWidth="1" opacity="0.42" />
        </pattern>
      </defs>

      <rect
        x="6"
        y="8"
        width={ROOM_WIDTH * 3 - 12}
        height={ROOM_HEIGHT + CORRIDOR_HEIGHT + TOP + 10}
        rx="34"
        fill="#f4f7ea"
      />

      <rect
        x="18"
        y={TOP - 15}
        width={ROOM_WIDTH * 3 - 36}
        height={ROOM_HEIGHT + CORRIDOR_HEIGHT + 12}
        rx="22"
        fill="#52665c"
        opacity="0.86"
        filter="url(#wallShadow)"
      />

      <Corridor />

      {ROOMS.map((room) => {
        const roomDevices = (devices || []).filter((device) => device.roomKey === room.key);
        const running = roomDevices.filter((device) => device.status === "on").length;
        const watts = byRoom[room.label] || 0;
        const roomLoad = roomDevices.length ? Math.round((running / roomDevices.length) * 100) : 0;

        return (
          <g key={room.key} transform={`translate(${room.x}, ${TOP})`}>
            <RoomShell room={room} running={running} total={roomDevices.length} watts={watts} roomLoad={roomLoad} />

            {room.key === "drawing" ? <DrawingFurniture /> : <WorkFurniture variant={room.key} />}

            <Plant x={ROOM_WIDTH - 42} y={ROOM_HEIGHT - 70} />

            {["light-1", "fan-1", "light-2", "fan-2", "light-3"].map((posKey) => {
              const device = byRoomAndPos[`${room.key}:${posKey}`];
              const pos = LAYOUT[posKey];
              if (!device || !pos) return null;
              return device.type === "fan" ? (
                <Fan key={device.id} x={pos.x} y={pos.y} device={device} />
              ) : (
                <Light key={device.id} x={pos.x} y={pos.y} device={device} />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function RoomShell({ room, running, total, watts, roomLoad }) {
  return (
    <>
      <rect x="10" y="4" width={ROOM_WIDTH - 20} height={ROOM_HEIGHT - 8} rx="15" fill="#4f6258" />
      <rect x="17" y="12" width={ROOM_WIDTH - 34} height={ROOM_HEIGHT - 23} rx="8" fill="#c9bda9" opacity="0.95" />
      <rect
        x="23"
        y="20"
        width={ROOM_WIDTH - 46}
        height={ROOM_HEIGHT - 48}
        rx="3"
        fill={`url(#${room.floorId})`}
      />
      <rect x="23" y="20" width={ROOM_WIDTH - 46} height={ROOM_HEIGHT - 48} rx="3" fill={`url(#${room.floorPattern})`} />
      <path d={`M 23 34 L ${ROOM_WIDTH - 23} 34 L ${ROOM_WIDTH - 34} 20 L 34 20 Z`} fill="#fffdf6" opacity="0.42" />
      <path d={`M ${ROOM_WIDTH - 34} 20 L ${ROOM_WIDTH - 23} 34 L ${ROOM_WIDTH - 23} ${ROOM_HEIGHT - 28} L ${ROOM_WIDTH - 34} ${ROOM_HEIGHT - 40} Z`} fill="#8a978c" opacity="0.22" />
      <Window x={75} y={-7} width={96} />
      <Door x={ROOM_WIDTH / 2 - 34} y={ROOM_HEIGHT - 8} />
      <rect x="25" y="21" width="72" height="48" rx="11" fill="#fffdf6" opacity="0.76" />
      <path
        d={`M ${ROOM_WIDTH / 2 - 33} ${ROOM_HEIGHT - 12} A 47 47 0 0 1 ${ROOM_WIDTH / 2 + 18} ${ROOM_HEIGHT + 34}`}
        fill="none"
        stroke="#8e8170"
        strokeWidth="1.5"
        opacity="0.36"
      />
      <text x="35" y="47" className="font-display" fontSize="12" fontWeight="800" fill="#17251f">
        {room.label}
      </text>
      <g transform="translate(35, 52)">
        <rect width="45" height="18" rx="9" fill="#dff3e6" />
        <text x="22.5" y="12" textAnchor="middle" fontSize="8" fontWeight="900" fill={room.accent}>
          {watts}W
        </text>
      </g>
      <text x={ROOM_WIDTH - 32} y="47" textAnchor="end" fontSize="9" fontWeight="800" fill="#6e7b72">
        {running}/{total} on - {roomLoad}%
      </text>
    </>
  );
}

function Corridor() {
  const y = TOP + ROOM_HEIGHT - 2;
  return (
    <g>
      <rect x="18" y={y} width={ROOM_WIDTH * 3 - 36} height={CORRIDOR_HEIGHT} rx="0" fill="#52665c" opacity="0.92" />
      <rect x="27" y={y + 12} width={ROOM_WIDTH * 3 - 54} height={CORRIDOR_HEIGHT - 24} rx="5" fill="url(#corridorFloor)" />
      <rect x="27" y={y + 12} width={ROOM_WIDTH * 3 - 54} height={CORRIDOR_HEIGHT - 24} rx="5" fill="url(#woodLines)" opacity="0.75" />
      <path d={`M 27 ${y + 12} H ${ROOM_WIDTH * 3 - 27}`} stroke="#fff8e8" strokeWidth="2" opacity="0.3" />
      <Plant x="86" y={y + 58} />
      <Router x={ROOM_WIDTH * 1.5} y={y + 96} />
      <SideWindow x="18" y={y + 24} />
      <SideWindow x={ROOM_WIDTH * 3 - 29} y={y + 28} />
    </g>
  );
}

function Window({ x, y, width }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width={width} height="8" rx="4" fill="#89dce0" opacity="0.65" />
      <rect x="8" y="2" width={width - 16} height="4" rx="2" fill="url(#windowGlass)" />
      <line x1={width / 2} y1="1" x2={width / 2} y2="8" stroke="#5caeb8" strokeWidth="1" opacity="0.45" />
    </g>
  );
}

function SideWindow({ x, y }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width="8" height="66" rx="4" fill="#89dce0" opacity="0.65" />
      <rect x="2" y="8" width="4" height="50" rx="2" fill="url(#windowGlass)" />
    </g>
  );
}

function Door({ x, y }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width="68" height="13" rx="4" fill="#f4ead8" />
      <path d="M 4 2 C 30 17 35 45 35 63" fill="none" stroke="#8e8170" strokeWidth="1.2" opacity="0.38" />
    </g>
  );
}

function Router({ x, y }) {
  return (
    <g transform={`translate(${x}, ${y})`} filter="url(#objectShadow)">
      <rect x="-22" y="-10" width="44" height="20" rx="4" fill="#eef2e9" />
      <rect x="-15" y="-4" width="30" height="5" rx="2" fill="#b8c3bb" />
      <path d="M -14 -10 V -25 M 14 -10 V -25" stroke="#53675d" strokeWidth="2" />
      <circle cx="-8" cy="4" r="2" fill="#2f9f6b" />
      <circle cx="0" cy="4" r="2" fill="#f2b84b" />
      <circle cx="8" cy="4" r="2" fill="#2f9f6b" />
    </g>
  );
}

function Light({ x, y, device }) {
  const on = device.status === "on";

  return (
    <g className="device-hotspot cursor-pointer" transform={`translate(${x}, ${y})`} tabIndex="0">
      <title>{buildDeviceTitle(device)}</title>
      {on && <circle r="48" fill="#ffd86b" opacity="0.18" filter="url(#lightGlow)" />}
      {on && <circle r="25" fill="#fff1a8" opacity="0.23" />}
      <rect x="-16" y="-16" width="32" height="32" rx="11" fill={on ? "#fff2bc" : "#d9d1bf"} filter="url(#objectShadow)" />
      <circle
        r="10.5"
        fill={on ? "url(#bulbOn)" : "#bbb4a5"}
        stroke={on ? "#d7941e" : "#928979"}
        strokeWidth="1.4"
        className={on ? "animate-pulse-glow" : ""}
      />
      <circle r="3.5" fill={on ? "#fffdf6" : "#827a6b"} />
      <DeviceTooltip device={device} x={x > 190 ? -136 : 14} y={-78} />
    </g>
  );
}

function Fan({ x, y, device }) {
  const on = device.status === "on";

  return (
    <g className="device-hotspot cursor-pointer" transform={`translate(${x}, ${y})`} tabIndex="0">
      <title>{buildDeviceTitle(device)}</title>
      {on && <circle r="34" fill="#9ce9bb" opacity="0.12" filter="url(#fanGlow)" />}
      {on && <circle className="fan-air-ring" r="27" fill="none" stroke="#9ce9bb" strokeWidth="1.4" opacity="0.28" />}
      <circle r="23" fill="#20342a" opacity="0.08" />
      <circle r="18" fill="#f3f8ef" stroke="#b9c8bf" strokeWidth="1.2" opacity="0.88" />
      <g className="fan-rotor" filter={on ? "url(#fanGlow)" : undefined}>
        {on && (
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 0 0"
            to="360 0 0"
            dur="0.58s"
            repeatCount="indefinite"
          />
        )}
        {[0, 120, 240].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <path
              d="M -3 -5 C 2 -16 9 -28 7 -39 C 18 -34 25 -24 23 -16 C 19 -7 8 -2 2 2 Z"
              fill={on ? "#3eb879" : "#9aa79f"}
              opacity={on ? "0.9" : "0.74"}
            />
            <path
              d="M 2 -31 C 10 -28 15 -23 16 -17"
              fill="none"
              stroke="#fffdf6"
              strokeWidth="1.2"
              opacity="0.28"
            />
          </g>
        ))}
      </g>
      <circle r="7.5" fill={on ? "#20784f" : "#6d7c72"} stroke="#fffdf6" strokeWidth="1.4" />
      <circle r="2.6" fill="#fffdf6" opacity="0.9" />
      <DeviceTooltip device={device} x={x > 190 ? -138 : 16} y={-82} />
    </g>
  );
}

function DeviceTooltip({ device, x, y }) {
  const status = device.status.toUpperCase();
  const changed = formatChanged(device.lastChanged);

  return (
    <g className="device-tooltip" transform={`translate(${x}, ${y})`}>
      <rect width="122" height="66" rx="12" fill="#fffdf6" stroke="#dce8dc" strokeWidth="1" filter="url(#objectShadow)" />
      <text x="12" y="18" fontSize="10" fontWeight="900" fill="#17251f">
        {device.name}
      </text>
      <text x="12" y="34" fontSize="8.5" fontWeight="700" fill="#6e7b72">
        {device.room}
      </text>
      <text x="12" y="51" fontSize="9" fontWeight="900" fill={device.status === "on" ? "#20784f" : "#647268"}>
        {status}
      </text>
      <text x="55" y="51" fontSize="9" fontWeight="900" fill="#17251f">
        {device.status === "on" ? `${device.wattage}W now` : `${device.wattage}W rated`}
      </text>
      <text x="12" y="62" fontSize="7.5" fontWeight="700" fill="#6e7b72">
        Changed {changed}
      </text>
    </g>
  );
}

function buildDeviceTitle(device) {
  const watts = device.status === "on" ? `${device.wattage}W now` : `${device.wattage}W rated`;
  return `${device.name} - ${device.room}\nStatus: ${device.status.toUpperCase()}\nPower: ${watts}\nChanged: ${formatChanged(device.lastChanged)}`;
}

function formatChanged(value) {
  const changed = new Date(value).getTime();
  if (!Number.isFinite(changed)) return "recently";

  const seconds = Math.max(0, Math.floor((Date.now() - changed) / 1000));
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `${hours}h ${remainingMinutes}m ago` : `${hours}h ago`;
}

function DrawingFurniture() {
  return (
    <g filter="url(#objectShadow)">
      <rect x="95" y="148" width="118" height="82" rx="26" fill="#d9b993" opacity="0.42" />
      <g transform="translate(44, 116)">
        <rect x="0" y="26" width="58" height="138" rx="20" fill="url(#sofaFabric)" />
        <rect x="9" y="35" width="40" height="118" rx="17" fill="#b08b6a" opacity="0.9" />
        <line x1="29" y1="39" x2="29" y2="149" stroke="#75533b" strokeWidth="1.4" opacity="0.32" />
      </g>
      <g transform="translate(116, 150)">
        <rect width="92" height="86" rx="24" fill="#a67d5b" />
        <rect x="13" y="10" width="66" height="66" rx="17" fill="#c19b73" opacity="0.64" />
      </g>
      <g transform="translate(86, 246) rotate(-23)">
        <rect width="48" height="36" rx="11" fill="#b79573" />
      </g>
      <g transform="translate(226, 178)">
        <rect width="48" height="92" rx="16" fill="#8e6a52" />
        <rect x="8" y="9" width="32" height="34" rx="11" fill="#a78265" />
        <rect x="8" y="50" width="32" height="34" rx="11" fill="#a78265" />
      </g>
      <g transform="translate(118, 238)">
        <rect width="72" height="38" rx="15" fill="#b8895e" />
        <ellipse cx="36" cy="19" rx="23" ry="10" fill="#f2d4a9" opacity="0.42" />
      </g>
    </g>
  );
}

function WorkFurniture({ variant }) {
  const chairFill = variant === "work2" ? "#557967" : "#5d6862";

  return (
    <g filter="url(#objectShadow)">
      <Desk x={62} y={112} chairFill={chairFill} />
      <Desk x={188} y={112} chairFill={chairFill} flip />
      <Desk x={62} y={232} chairFill={chairFill} />
      <Desk x={188} y={232} chairFill={chairFill} flip />
      <rect x="110" y="181" width="100" height="34" rx="14" fill="#cda97c" opacity="0.54" />
      <rect x="126" y="190" width="68" height="15" rx="7" fill="#fff8e7" opacity="0.6" />
    </g>
  );
}

function Desk({ x, y, chairFill, flip = false }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="0" width="68" height="38" rx="8" fill="url(#deskTop)" />
      <rect x="7" y="7" width="24" height="15" rx="3" fill="#2f3b35" opacity="0.85" />
      <rect x="39" y="8" width="20" height="16" rx="3" fill="#e9dfcc" opacity="0.82" />
      <circle cx={flip ? 50 : 18} cy="59" r="14" fill={chairFill} />
      <rect x={flip ? 39 : 7} y="44" width="22" height="16" rx="8" fill={chairFill} opacity="0.84" />
    </g>
  );
}

function Plant({ x, y }) {
  return (
    <g transform={`translate(${x}, ${y})`} filter="url(#objectShadow)">
      <rect x="-10" y="13" width="20" height="16" rx="4" fill="#8c684c" />
      <ellipse cx="0" cy="1" rx="13" ry="19" fill="#3e925d" />
      <ellipse cx="-10" cy="6" rx="10" ry="15" fill="#4fa86f" transform="rotate(-30 -10 6)" />
      <ellipse cx="11" cy="6" rx="10" ry="15" fill="#63b87e" transform="rotate(28 11 6)" />
    </g>
  );
}

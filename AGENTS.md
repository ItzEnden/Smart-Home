# Smart Home Server

Next.js application for Smart Home control panel with ESP8266 sensor integration via WebSocket.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Motion
- **Communication:** WebSocket (real-time bidirectional)
- **Hardware:** ESP8266 (MQ-2 gas sensor, PIR motion sensor)

## Architecture

**Not a Single Page Application (SPA).** This is a **Next.js App Router** application with:

- **Server Components** — Rendered on server (SSR/SSG), no client-side JavaScript
- **Client Components** — Rendered in browser with hooks, state, events (`"use client"`)
- **File-based Routing** — Each `page.tsx` is a separate route, not client-side navigation
- **WebSocket Server** — Separate Node.js server for real-time sensor communication

### Data Flow

```
ESP8266 Sensors
     │
     │ WebSocket (real-time, bidirectional)
     ▼
WebSocket Server (port 3001)
     │
     │ Store in memory + Broadcast
     ▼
sensor-store.ts (Map)
     │
     │ Real-time WebSocket updates
     ▼
useSensorData hooks
     │
     │ React state update
     ▼
UI Components (re-render)
```

## Running the Application

### Docker (Recommended)

```bash
# Build Docker image
docker build -t smart-home .

# Run container
docker run -p 3000:3000 -p 3001:3001 smart-home
```

Docker runs both Next.js (port 3000) and WebSocket server (port 3001).

### Development

```bash
npm run dev:all
```

Runs both Next.js (port 3000) and WebSocket server (port 3001).

### Production

```bash
npm run build
npm run start          # Next.js on port 3000
npm run ws-server      # WebSocket on port 3001
```

## ESP Integration

### WebSocket Connection

**URL:** `ws://YOUR_SERVER_IP:3001`

**Arduino Libraries Required:**
- `WebSocketsClient` by Markus Sattler

**Message Format (ESP → Server):**
```json
{
  "room": "kitchen",
  "sensor": "gas",
  "value": 250,
  "timestamp": 12345678,
  "api_key": "optional-api-key"
}
```

**Fields:**
- `room` — `kitchen`, `hallway`, `bathroom`, `office`, `street`
- `sensor` — `gas`, `motion`, `temperature`, `humidity`, `water_leak`
- `value` — sensor reading (number, string: `"detected"`, `"clear"`, or boolean)
- `timestamp` — milliseconds since boot (optional, auto-generated if omitted)
- `api_key` — API key if authentication is enabled (optional)

### Room to Device Mapping

| Room | Device ID | Sensors |
|------|-----------|---------|
| `kitchen` | `esp_kitchen_01` | MQ-2 (gas) |
| `hallway` | `esp_hallway_01` | PIR (motion) |
| `bathroom` | `esp_bathroom_01` | water_leak |
| `office` | `esp_office_01` | humidity, temperature |
| `street` | `esp_street_01` | — |

## Project Structure

```
Smart-Home/
├── server/
│   └── websocket-server.ts       # Standalone WebSocket server (port 3001)
├── scripts/
│   └── test-websocket-client.js  # WebSocket test client for testing
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── ws-sensors/
│   │   │       └── route.ts      # API route (if needed)
│   │   ├── bathroom/
│   │   │   └── page.tsx          # Bathroom room page
│   │   ├── events/
│   │   │   └── page.tsx          # Event log page
│   │   ├── hallway/
│   │   │   └── page.tsx          # Hallway room page (motion sensor)
│   │   ├── kitchen/
│   │   │   └── page.tsx          # Kitchen page with gas sensor display
│   │   ├── office/
│   │   │   └── page.tsx          # Office room page
│   │   ├── settings/
│   │   │   └── page.tsx          # Settings page
│   │   ├── street/
│   │   │   └── page.tsx          # Street/outdoor sensors page
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Main dashboard
│   ├── components/
│   │   ├── Main page/            # Dashboard cards
│   │   ├── PageTransition.tsx    # Page transition wrapper
│   │   └── TopBar.tsx            # Top navigation bar
│   ├── hooks/
│   │   └── useSensorData.ts      # React hooks for WebSocket
│   └── lib/
│       └── sensor-store.ts       # Sensor data storage
├── .env                          # Environment variables
├── README.md                     # Project documentation
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript configuration
```

## Testing

### WebSocket Test Client

Test client script for simulating ESP8266 sensor data transmission.

**Location:** `scripts/test-websocket-client.js`

**Usage:**
```bash
# Single test (6 messages, then exit)
npm run test:ws

# Infinite test (repeats cycles until Ctrl+C)
npm run test:ws -- --infinite

# Custom WebSocket URL
node scripts/test-websocket-client.js ws://192.168.1.100:3001

# Custom URL + infinite mode
node scripts/test-websocket-client.js ws://192.168.1.100:3001 --infinite
```

**Output:** Sends test messages and displays all received WebSocket messages in real-time.

## Key Files

| File | Purpose |
|------|---------|
| `server/websocket-server.ts` | Standalone WebSocket server (port 3001) |
| `scripts/test-websocket-client.js` | WebSocket test client for ESP simulation |
| `src/hooks/useSensorData.ts` | React hooks for WebSocket connection |
| `src/lib/sensor-store.ts` | In-memory sensor data storage & utilities |
| `src/app/page.tsx` | Main dashboard with room cards |
| `src/app/kitchen/page.tsx` | Kitchen page with gas sensor display |
| `src/app/hallway/page.tsx` | Hallway page with motion sensor & light control |

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `WS_PORT` | WebSocket server port | `3001` | No |
| `WS_HOST` | WebSocket server host | `0.0.0.0` | No |
| `SENSOR_API_KEY` | API key for ESP authentication | — | No |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL for client | `ws://localhost:3001` | No |

## Security

- **API Key** — Set `SENSOR_API_KEY` in `.env` for authentication
- **Validation** — Server validates all incoming data
-

## Git Branch Naming

- Feature branches use appropriate prefixes: `feature/`, `bugfix/`, `hotfix/`
- Quint reasoning branches use same prefixes as corresponding features (e.g., `feature/cv-integration`)
- Worktrees stored in `.worktrees/<name>` (without prefix duplication)

Examples:
- CV integration → `feature/cv-integration` branch, `.worktrees/cv-integration` tree
- Robot identification → `feature/robot-integration` branch, `.worktrees/robot-integration` tree
 
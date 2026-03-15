# Bounded Context: Smart Home Application

## Project Overview

**Name:** Smart Home Control Panel
**Domain:** IoT / Home Automation
**Type:** Full-stack web application with real-time sensor integration

## Tech Stack

- **Framework:** Next.js 15 (App Router) - NOT a Single Page Application
- **Language:** TypeScript (strict mode enabled)
- **Styling:** Tailwind CSS 4.x
- **Animations:** Motion (framer-motion successor)
- **Real-time Communication:** WebSocket (ws library)
- **Server:** Standalone Node.js WebSocket server (port 3001)
- **Hardware Integration:** ESP8266 microcontrollers

## Architecture

**Architecture Pattern:** Client-Server with bidirectional real-time communication

**Data Flow:**
```
ESP8266 Sensors (MQ-2, PIR, DHT, water sensors)
    ↓
WebSocket Client (ws://server:3001)
    ↓
WebSocket Server (Node.js, port 3001)
    ↓
In-Memory Sensor Store (Map<string, SensorData>)
    ↓
WebSocket Broadcast → Connected Clients
    ↓
React useSensorData hooks
    ↓
UI Components (re-render on data update)
```

**Component Structure:**
- Server Components (SSR): Static layout, cards without interactivity
- Client Components ("use client"): Real-time sensor displays, controls, state management

## Vocabulary

| Term | Definition |
|------|------------|
| **Room** | Physical location in the home: `kitchen`, `hallway`, `bathroom`, `office`, `living-room`, `street` |
| **Device** | ESP8266 microcontroller with ID pattern: `esp_{room}_01` |
| **Sensor** | Type of measurement: `gas`, `motion`, `temperature`, `humidity`, `water_leak` |
| **Sensor Key** | Composite identifier: `{deviceId}_{sensorType}`, e.g., `esp_kitchen_01_gas` |
| **WebSocket Message** | JSON payload with `type` field: `initial`, `sensor_update`, `client_count`, `error`, `ack` |
| **Sensor Data** | Interface: `{ value, timestamp, history[] }` |
| **History** | Array of recent sensor readings (max 100 entries) |

## Invariants

### Architecture Invariants
1. **Separation of Concerns:**
   - WebSocket server (`server/websocket-server.ts`) is standalone and runs independently
   - Next.js app (`src/app/`) is client-only for WebSocket communication
   - No circular dependencies between server and client

2. **State Management:**
   - Single source of truth: in-memory `sensorDataStore` (Map) on WebSocket server
   - Client state is derived from WebSocket messages, never modified directly
   - Server broadcasts all updates to all connected clients

3. **Real-time Architecture:**
   - All sensor updates must be broadcast immediately to all clients
   - WebSocket connection must auto-reconnect with exponential backoff
   - Connection status must be visible in UI

### Data Invariants
1. **Sensor Key Format:** `{deviceId}_{sensorType}` - never deviate
2. **Timestamp Format:** ISO 8601 string (`toISOString()`)
3. **History Limit:** Maximum 100 entries per sensor, FIFO
4. **Value Types:** `number | boolean | string` - must handle all three types

### API Invariants
1. **Message Format:** All WebSocket messages must have `type` and `timestamp` fields
2. **Room Mapping:** `roomToDeviceMap` must match actual ESP8266 device IDs
3. **API Key:** Optional via `SENSOR_API_KEY` env var - when set, reject unauthenticated messages

### Configuration Invariants
1. **Port Assignment:**
   - Next.js: `3000` (development), `3000` (production)
   - WebSocket Server: `3001` (default), configurable via `WS_PORT`
2. **Environment Variables:**
   - `WS_HOST`: WebSocket server bind address (default: `0.0.0.0`)
   - `NEXT_PUBLIC_WS_URL`: Client WebSocket URL (default: `ws://hostname:3001`)
   - `SENSOR_API_KEY`: Optional authentication key

### Performance Invariants
1. **Broadcast Latency:** Sensor updates must be broadcast within 100ms of receipt
2. **Connection Health:** Ping interval 30s to detect dead connections
3. **History Memory:** Max 100 entries × 5 rooms × ~4 sensors = 2000 entries max

### Security Invariants
1. **API Key Validation:** When `SENSOR_API_KEY` is set, reject messages without matching key
2. **Input Validation:** All incoming JSON must be parsed with error handling
3. **CORS:** WebSocket server accepts connections from any origin (intended for local network)

### Development Invariants
1. **TypeScript Strict Mode:** Must remain enabled (`strict: true` in tsconfig.json)
2. **React Strict Mode:** Must remain enabled (`reactStrictMode: true`)
3. **ESLint:** Build ignores lint errors (`ignoreDuringBuilds: true`) - intentional

### Testing Invariants
1. **WebSocket Test Client:** Must be able to simulate all sensor types
2. **Test Data:** Must match expected ESP8266 message format
3. **Room Coverage:** Test must cover all 6 rooms

## Scope (G)

This bounded context applies to:
- **Environment:** Local network deployment (LAN/WiFi)
- **Hardware:** ESP8266-based sensor nodes
- **Protocol:** WebSocket bidirectional communication
- **Scale:** ~6 rooms, ~4 sensors per room, ~24 concurrent clients max

**Out of Scope:**
- Cloud deployment (AWS/GCP/Azure)
- MQTT protocol
- Mobile app clients
- Database persistence (currently in-memory only)
- Authentication beyond API key
- HTTPS/WSS (HTTP/WS only)

## Known Constraints

1. **No Persistence:** Sensor data is lost on server restart (in-memory Map)
2. **Single Server:** No clustering or load balancing support
3. **No Retry Policy:** Failed WebSocket messages are not retried
4. **No Offline Support:** Clients must be connected to receive updates
5. **Hardware Dependency:** ESP8266-specific message format and libraries

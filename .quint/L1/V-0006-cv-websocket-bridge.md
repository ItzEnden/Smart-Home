# V-0006: CV WebSocket Bridge

**Status:** L1 (Substantiated) → Promoted to L2
**Kind:** system
**Scope:** CV integration with minimal server modifications
**Derived from:** H-0006

## Verification Performed

### Type Check (C.3 Kind-CAL)
- **Status:** PASSED
- **Analysis:** Hypothesis correctly classified as "system" (code/architecture change)
- **WebSocket message format matches existing SensorMessage interface:**
  - `room` (string) ✓
  - `sensor` (string) ✓
  - `value` (string: "Denis", "CHUZHOY", "Searching...") ✓
  - `timestamp` (number) ✓
- **No type incompatibilities detected**

### Constraint Check
- **Status:** PASSED
- **Architecture Invariant 1 (Separation of Concerns):** CV process runs independently, WebSocket server is standalone — **RESPECTED**
- **Architecture Invariant 2 (State Management):** Single source of truth remains `sensorDataStore` on WebSocket server — **RESPECTED**
- **Architecture Invariant 3 (Real-time Architecture):** Face detections broadcast immediately to all clients — **RESPECTED**
- **Data Invariant 1 (Sensor Key Format):** Key would be `cv_camera_01_face_recognition` — **RESPECTED**
- **Data Invariant 4 (Value Types):** Value is string (name) — **RESPECTED**
- **API Invariant 1 (Message Format):** Python sends message with required fields — **RESPECTED**
- **Performance Invariant 1 (Broadcast Latency):** WebSocket is low-latency, <100ms achievable — **RESPECTED**
- **No invariants violated**

### Logical Consistency
- **Status:** PASSED
- **Method (Python WebSocket client → Server → Broadcast) → Outcome (UI displays face detections)**
- **Causal chain:**
  1. CV process connects as WebSocket client to existing server
  2. Face detected → Python sends message with detected name
  3. Server receives message → stores in sensorDataStore
  4. Server broadcasts to all clients
  5. Next.js UI receives update → displays face detection
- **Method directly leads to expected outcome without logical gaps**
- **Existing ESP8266 pattern proves this works**

## Verdict: PASS

**Reasoning:** The hypothesis is logically sound. Using the WebSocket client pattern (already proven by ESP8266 integration) ensures zero architectural changes. The method directly produces the expected outcome through the existing broadcast mechanism. All invariants are respected, and type compatibility is verified.

## Notes

**Dependencies:**
- `websockets` Python library (new dependency)
- Python runtime in production environment

**Potential Issue:**
- Python process lifecycle is independent from server (needs separate monitoring)

---

**Verification Date:** 2026-03-15

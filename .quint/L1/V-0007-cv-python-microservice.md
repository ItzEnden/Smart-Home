# V-0007: CV Python Microservice with HTTP API

**Status:** L1 (Substantiated) → Promoted to L2
**Kind:** system
**Scope:** CV integration with explicit microservice architecture
**Derived from:** H-0007

## Verification Performed

### Type Check (C.3 Kind-CAL)
- **Status:** PASSED
- **Analysis:** Hypothesis correctly classified as "system" (code/architecture change)
- **WebSocket message format matches existing SensorMessage interface**
- **HTTP API endpoints are well-typed (FastAPI provides automatic typing)**
- **No type incompatibilities detected**

### Constraint Check
- **Status:** PASSED
- **Architecture Invariant 1 (Separation of Concerns):** CV microservice is standalone, WebSocket server is standalone — **RESPECTED**
- **Architecture Invariant 2 (State Management):** Single source of truth remains `sensorDataStore` on WebSocket server — **RESPECTED**
- **Architecture Invariant 3 (Real-time Architecture):** Face detections broadcast immediately via WebSocket push — **RESPECTED**
- **Data Invariant 1 (Sensor Key Format):** Key would be `cv_camera_01_face_recognition` — **RESPECTED**
- **API Invariant 1 (Message Format):** CV service sends WebSocket messages with required fields — **RESPECTED**
- **Configuration Invariant 1 (Port Assignment):** Adds port 3002 for CV service — **ACCEPTABLE** (no conflict with 3000, 3001)
- **Performance Invariant 1 (Broadcast Latency):** WebSocket push is low-latency — **RESPECTED**
- **No invariants violated**

### Logical Consistency
- **Status:** PASSED
- **Method (CV microservice with HTTP API + WebSocket push) → Outcome (explicit API, health checks, queries)**
- **Causal chain:**
  1. CV microservice runs on port 3002
  2. Exposes HTTP endpoints for queries (`GET /faces/status`)
  3. Background CV loop sends WebSocket push to port 3001
  4. Server broadcasts to all clients
  5. UI displays face detections
  6. External services can query HTTP API
- **HTTP API provides query capability, WebSocket provides real-time push**
- **Method directly leads to expected outcomes**

## Verdict: PASS

**Reasoning:** The hypothesis is logically sound. Running CV as a separate microservice with both HTTP API (for queries) and WebSocket (for real-time push) provides the stated benefits. Architecture invariants are respected, and the dual-interface approach (HTTP + WebSocket) is a proven pattern.

## Notes

**Dependencies:**
- FastAPI Python library (new dependency)
- `websockets` Python library (new dependency)
- Python runtime in production environment
- Additional port 3002 to manage

**Complexity:**
- Two network protocols to manage (HTTP + WebSocket)
- More moving parts than WebSocket bridge alone

---

**Verification Date:** 2026-03-15

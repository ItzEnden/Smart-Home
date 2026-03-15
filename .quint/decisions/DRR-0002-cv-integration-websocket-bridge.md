# DRR-0002: CV Integration via WebSocket Bridge

**Date:** 2026-03-15
**Status:** Adopted
**Type:** System Decision

## Context

The Smart Home system needs to integrate computer vision (CV) capabilities for face recognition. The system currently uses a WebSocket server (port 3001) to receive sensor data from ESP8266 devices, with real-time updates pushed to the Next.js dashboard.

### Problem Statement

How should we integrate a Python CV module for face recognition into the existing Smart Home architecture?

### Constraints

- Must integrate with existing WebSocket server (port 3001)
- Must provide real-time face detection events to the dashboard
- Python required (cv2, face_recognition packages)
- Minimal disruption to existing architecture preferred

---

## Decision

We decided to use **T-0006: CV WebSocket Bridge** — a Python CV module that acts as a WebSocket client, connecting to the existing WebSocket server and broadcasting face detection events.

---

## Rationale

**Selected Hypothesis:** T-0006 (CV WebSocket Bridge)

### Evidence-Based Comparison

| Hypothesis | R_eff | Weakest Link | Congruence | Evidence |
|------------|-------|--------------|------------|----------|
| **T-0006** (WebSocket Bridge) | **0.72** | External sources (0.8) × CL2 | CL2 (10% penalty) | 2 sources |
| T-0007 (Python Microservice) | 0.72 | External sources (0.8) × CL2 | CL2 (10% penalty) | 3 sources |

Both options achieved identical R_eff scores (0.72), indicating comparable reliability from an evidence perspective.

### Selection Factors

Despite equal R_eff scores, **T-0006 was chosen** for the following reasons:

1. **Architectural Consistency:** Follows the existing ESP8266 pattern — sensors connect as WebSocket clients to the central server
2. **Simplicity:** Single responsibility (CV only), minimal dependencies (only `websockets` Python package)
3. **No New Ports:** Avoids port management overhead (T-0007 would require port 3002)
4. **Maintainability:** Preserves existing architecture; no need for HTTP API endpoints or additional documentation
5. **Deployment Simplicity:** One fewer service to configure and monitor

### External Validation

The `websockets` Python library was validated as:
- **Production-Ready:** Explicitly described as "built for production"
- **Backpressure Handling:** Only library to handle backpressure correctly (critical for real-time CV streaming)
- **Low Latency:** Provides "full-duplex, low-latency communication"

**Evidence Level:** L2 (Corroborated - external research via Tavily)

**Sources:**
- [deepin-community/python-websockets - GitHub](https://github.com/deepin-community/python-websockets)
- [The Complete Guide to Python WebSocket Library (2025 Edition)](https://www.videosdk.live/developer-hub/websocket/python-websocket-library)

---

## Consequences

### Positive Outcomes

1. **Unified Messaging:** All sensors (ESP8266 + CV) use the same WebSocket protocol
2. **Simplified Deployment:** No new HTTP endpoints or port allocations
3. **Consistent UI:** Dashboard receives CV events the same way as sensor events
4. **Lower Complexity:** Single responsibility for CV module — face detection and broadcasting only

### Trade-offs

1. **No HTTP API:** CV data is only available via WebSocket (cannot be consumed by non-WebSocket clients)
2. **Coupling to WS Server:** CV module depends on WS server availability
3. **No Query Interface:** Cannot query historical face detection events without additional storage

### Next Steps

- Create Python CV module directory
- Add `websockets` to Python dependencies
- Implement WebSocket client connection logic
- Implement face detection with cv2/face_recognition
- Format messages per SensorMessage interface
- Test integration with existing WebSocket server
- Update dashboard to handle face_recognition sensor type
- Deploy and monitor

---

## Validity

Revisit this decision if:
- Multiple CV consumers are needed (non-WebSocket clients)
- CV module complexity grows (retraining, enrollment) requiring HTTP API
- Performance issues arise with WebSocket broadcasting
- Architecture changes away from central WebSocket server pattern

---

## Relations

```
DRR-0002 --selects--> T-0006 (CV WebSocket Bridge)
DRR-0002 --rejects--> T-0007 (CV Python Microservice)
```

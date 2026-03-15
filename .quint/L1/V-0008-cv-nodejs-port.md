# V-0008: Port CV to Node.js

**Status:** L1 (Substantiated)
**Kind:** system
**Scope:** Technology stack unification, eliminating Python dependency
**Derived from:** H-0008

## Verification Performed

### Type Check (C.3 Kind-CAL)
- **Status:** PASSED
- **Analysis:** Hypothesis correctly classified as "system" (code/architecture change)
- **WebSocket message format matches existing SensorMessage interface**
- **TypeScript types for CV module are native to stack**
- **No type incompatibilities detected**

### Constraint Check
- **Status:** PASSED
- **Architecture Invariant 1 (Separation of Concerns):** CV module is another module, WebSocket server is standalone — **RESPECTED**
- **Architecture Invariant 2 (State Management):** Single source of truth remains `sensorDataStore` on WebSocket server — **RESPECTED**
- **Architecture Invariant 3 (Real-time Architecture):** Face detections broadcast immediately — **RESPECTED**
- **Data Invariant 1 (Sensor Key Format):** Key would be `cv_camera_01_face_recognition` — **RESPECTED**
- **API Invariant 1 (Message Format):** CV module sends WebSocket messages with required fields — **RESPECTED**
- **Performance Invariant 1 (Broadcast Latency):** In-process call is <10ms — **RESPECTED**
- **No invariants violated**

### Logical Consistency
- **Status:** PASSED
- **Method (Port CV to Node.js using MediaPipe) → Outcome (unified stack, simplified deployment)**
- **Causal chain:**
  1. CV module implemented in TypeScript using MediaPipe
  2. Module imported into WebSocket server
  3. Face detection runs in Node.js process
  4. Results broadcast directly to clients
  5. Deployment: single Node.js runtime, single Docker image
- **Method directly leads to expected outcomes**

## Verdict: PASS

**Reasoning:** The hypothesis is logically sound. Porting CV to Node.js achieves the stated benefits (unified stack, simplified deployment). Architecture invariants are respected, and TypeScript integration eliminates cross-language complexity. The causal chain from method to outcome holds.

## Notes

**Dependencies:**
- `@mediapipe/face_detection` npm package (new dependency)
- `@mediapipe/camera_utils` npm package (new dependency)
- Webcam access in Node.js environment

**Feasibility Considerations:**
- **Face Detection:** MediaPipe Face Detection works well in JS — ✓
- **Face Recognition:** Requires custom implementation (face encoding, comparison) — ⚠️
- **YOLO:** Not required for current CV code (only uses face_recognition) — ✓

**Trade-offs:**
- **Positive:** Unified stack, no Python runtime, easier deployment
- **Negative:** High development effort (rewrite), less mature ML libraries

---

**Verification Date:** 2026-03-15

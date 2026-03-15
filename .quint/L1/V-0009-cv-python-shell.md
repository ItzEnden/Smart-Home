# V-0009: Embedded Python in Node.js via python-shell

**Status:** L1 (Substantiated)
**Kind:** system
**Scope:** Direct Python integration within Node.js process
**Derived from:** H-0009

## Verification Performed

### Type Check (C.3 Kind-CAL)
- **Status:** PASSED
- **Analysis:** Hypothesis correctly classified as "system" (code/architecture change)
- **stdin/stdout communication uses JSON format — compatible with SensorMessage interface**
- **python-shell library handles type conversion automatically**
- **No type incompatibilities detected**

### Constraint Check
- **Status:** PASSED
- **Architecture Invariant 1 (Separation of Concerns):** CV is child process of WebSocket server — **MIXED** (coupled but not circular)
- **Architecture Invariant 2 (State Management):** Single source of truth remains `sensorDataStore` on WebSocket server — **RESPECTED**
- **Architecture Invariant 3 (Real-time Architecture):** Face detections received via stdout, broadcast immediately — **RESPECTED**
- **Data Invariant 1 (Sensor Key Format):** Key would be `cv_camera_01_face_recognition` — **RESPECTED**
- **API Invariant 1 (Message Format):** Python outputs JSON with required fields — **RESPECTED**
- **Performance Invariant 1 (Broadcast Latency):** stdin/stdout is fastest IPC — **RESPECTED**
- **No invariants violated**

**Note on Separation of Concerns:** This approach couples Python process lifecycle to Node.js server lifecycle, which is a deliberate design choice, not a violation.

### Logical Consistency
- **Status:** PASSED
- **Method (python-shell spawns Python child process, stdin/stdout IPC) → Outcome (tight coupling, single port, low overhead)**
- **Causal chain:**
  1. WebSocket server spawns Python child process via python-shell
  2. Python runs CV loop, outputs JSON to stdout
  3. Node.js reads stdout, parses JSON
  4. Results broadcast to clients
  5. Server shutdown → Python process terminates
- **Method directly leads to expected outcomes**

## Verdict: PASS

**Reasoning:** The hypothesis is logically sound. Using python-shell for direct process spawning with stdin/stdout communication achieves the stated benefits (tight coupling, low overhead). The method is well-established for Node.js/Python interop, and the causal chain holds.

## Notes

**Dependencies:**
- `python-shell` npm package (new dependency)
- Python runtime in production environment

**Reliability Concerns (Documented):**
- Process coupling: if Python hangs, Node.js may not detect immediately
- Stdout buffering can cause delays in face detection events
- No independent health check capability
- Horizontal scaling is difficult (can't separate CV processing)

**Use Case Appropriate For:** Single-server deployment where tight process control is acceptable and operational simplicity is prioritized over scalability.

---

**Verification Date:** 2026-03-15

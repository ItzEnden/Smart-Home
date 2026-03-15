# H-0009: Embedded Python in Node.js via python-shell (Hybrid)

**Status:** L0 (Conjecture)
**Validated By:** T-0009 (L2) → **REJECTED** (moved to invalid/)
**Verified By:** V-0009 (L1 - Substantiated)
**Kind:** system
**Scope:** Direct Python integration within Node.js process
**Decision Context:** H-0005 (CV Integration Strategy Decision)

## Method (The Recipe)

Use python-shell library to spawn Python CV process from Node.js and communicate via stdin/stdout.

**Architecture:**
```
WebSocket Server (Node.js, port 3001)
    │
    │ Spawns Python process via python-shell
    │ stdin: send commands, stdout: receive face detections
    ▼
CV Python Process (child process)
    │
    │ Runs face recognition loop
    │ Outputs JSON: {"name": "Denis", "confidence": 0.95}
    ▼
WebSocket Server broadcasts: { "room": "hallway", "sensor": "face_recognition", "value": "Denis" }
```

**Node.js Code (websocket-server.ts):**
```typescript
import PythonShell from 'python-shell';

const cvProcess = PythonShell.run('scripts/cv_detect.py', {
  mode: 'json',
  pythonPath: '/usr/bin/python3'
});

cvProcess.on('message', (message) => {
  // Message from Python: { "name": "Denis", "timestamp": 1234567890 }
  broadcast({
    type: 'sensor_update',
    key: 'hallway_face_recognition',
    deviceId: 'cv_camera_01',
    sensorType: 'face_recognition',
    data: {
      value: message.name,
      timestamp: new Date().toISOString()
    }
  });
});

cvProcess.on('error', (err) => {
  console.error('CV process error:', err);
});

cvProcess.end(() => {
  console.log('CV process terminated');
});
```

**Modified CV Python (cv_detect.py):**
```python
import json
import sys

def cv_loop():
    while True:
        # ... CV processing ...
        if detected_name:
            # Output JSON to stdout for Node.js to read
            print(json.dumps({
                "name": detected_name,
                "timestamp": int(time.time())
            }))
            sys.stdout.flush()
        time.sleep(0.1)  # Avoid spamming

if __name__ == '__main__':
    cv_loop()
```

## Expected Outcome

- CV runs as child process of Node.js server
- Direct stdin/stdout communication (no network overhead)
- Unified process management (Node.js spawns/kills Python)
- CV lifecycle tied to server lifecycle

## Rationale

```json
{
  "source": "Hybrid approach",
  "anomaly": "Need CV integration with tight process coupling, minimal network overhead",
  "approach": "Use python-shell for direct process spawning and stdin/stdout communication",
  "alternatives_rejected": [
    "WebSocket bridge (adds network layer overhead)",
    "HTTP microservice (HTTP overhead, separate port)",
    "Full Node.js port (high effort, may lose Python ML advantages)"
  ]
}
```

## Dependencies

- H-0005 (CV Integration Strategy Decision) - provides decision context
- python-shell npm package (new dependency)
- Python runtime in production environment

## Notes

**Pros:**
- No network overhead (stdin/stdout is fastest IPC)
- Tightly coupled to server lifecycle
- Single WebSocket port (3001) only
- Python can use mature ML libraries

**Cons:**
- Process coupling: if Python crashes, server may not know
- Difficult to monitor Python process independently
- Stdin/stdout buffering can cause delays
- Hard to scale horizontally (can't separate CV processing)

**Reliability Concerns:**
- Python process hangs → server doesn't detect
- Stdout buffering → delayed face detection events
- No health check capability
- Process restart needs manual implementation

**Use Case:** If single-server deployment and tight process control is acceptable.

---

**Parent ID:** H-0005

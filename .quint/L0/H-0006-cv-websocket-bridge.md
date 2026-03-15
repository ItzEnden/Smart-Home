# H-0006: CV WebSocket Bridge (Conservative)

**Status:** L0 (Conjecture)
**Verified By:** V-0006 (L1 - Substantiated)
**Kind:** system
**Scope:** CV integration with minimal server modifications
**Decision Context:** H-0005 (CV Integration Strategy Decision)

## Method (The Recipe)

Run CV Python process independently as WebSocket client to existing WebSocket server.

**Architecture:**
```
CV Python Process
    │
    │ WebSocket Client (connects to ws://localhost:3001)
    │ Sends: { "room": "hallway", "sensor": "face_recognition", "value": "Denis" }
    ▼
WebSocket Server (Node.js, port 3001)
    │
    │ Broadcasts to all clients
    ▼
Next.js UI (displays detected faces)
```

**CV Process Modifications:**
```python
# Replace cv2.imshow loop with WebSocket integration
import websockets
import asyncio

async def cv_loop():
    while True:
        # ... CV processing ...
        # When face detected:
        await websocket.send(json.dumps({
            "room": "hallway",  # or dynamic room based on camera location
            "sensor": "face_recognition",
            "value": detected_name,  # "Denis" or "CHUZHOY" or "Searching..."
            "timestamp": int(time.time())
        }))

asyncio.run(cv_loop())
```

**No server code changes required.** CV process acts as another "device" like ESP8266.

## Expected Outcome

- CV results broadcast to all connected clients via existing WebSocket infrastructure
- Zero server code modifications
- CV process can be started/stopped independently
- Uses same sensor data format as ESP devices

## Rationale

```json
{
  "source": "Conservative approach",
  "anomaly": "Need CV integration without breaking existing architecture",
  "approach": "Treat CV process as another WebSocket client, reuse existing sensor pattern",
  "alternatives_rejected": [
    "Python microservice with HTTP API (adds HTTP layer complexity)",
    "Porting to Node.js (high effort, losing mature Python CV libraries)",
    "Embedded Python in Node.js (performance concerns, IPC complexity)"
  ]
}
```

## Dependencies

- H-0005 (CV Integration Strategy Decision) - provides decision context
- Existing WebSocket server (`server/websocket-server.ts`)
- Existing SensorMessage interface

## Notes

**Room Semantics:** CV camera is location-specific, maps well to "room" field.

**Performance:** WebSocket is low-overhead, suitable for real-time face detection events.

**Face Database:** CV process manages its own `faces/` directory locally.

---

**Parent ID:** H-0005

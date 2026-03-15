# H-0007: CV Python Microservice with HTTP API (Moderate)

**Status:** L0 (Conjecture)
**Verified By:** V-0007 (L1 - Substantiated)
**Kind:** system
**Scope:** CV integration with explicit microservice architecture
**Decision Context:** H-0005 (CV Integration Strategy Decision)

## Method (The Recipe)

Run CV as standalone Python microservice (FastAPI/Flask) with REST API endpoint.

**Architecture:**
```
CV Python Microservice (FastAPI, port 3002)
    │
    │ HTTP API: GET /faces/status, POST /faces/detect
    ▼
WebSocket Server (Node.js, port 3001)
    │
    │ Polls CV service or receives webhooks
    │ Broadcasts: { "room": "hallway", "sensor": "face_recognition", "value": "Denis" }
    ▼
Next.js UI
```

**CV Service (FastAPI):**
```python
from fastapi import FastAPI
import websockets

app = FastAPI()

# Internal state
current_detected_face = None

@app.get("/faces/status")
async def get_face_status():
    return {"detected": current_detected_face, "timestamp": time.time()}

# Background task: CV processing + WebSocket push
async def cv_background():
    async with websockets.connect("ws://localhost:3001") as ws:
        # ... CV loop ...
        await ws.send(json.dumps({
            "room": "hallway",
            "sensor": "face_recognition",
            "value": detected_name
        }))
```

**WebSocket Server Modifications:**
```typescript
// Optional: health check for CV service
app.get('/health/cv', async (req, res) => {
  const response = await axios.get('http://localhost:3002/health');
  res.json(response.data);
});
```

## Expected Outcome

- Explicit API contract for CV service (documented, testable)
- CV service can be queried independently (useful for other consumers)
- Health monitoring via HTTP endpoints
- WebSocket push for real-time, HTTP for queries

## Rationale

```json
{
  "source": "Moderate approach",
  "anomaly": "Need CV integration with explicit service boundary and observability",
  "approach": "Python microservice with HTTP API for queries + WebSocket for real-time push",
  "alternatives_rejected": [
    "Pure WebSocket client (no query capability, harder to debug)",
    "Porting to Node.js (high effort, losing Python CV ecosystem)",
    "Embedded Python (architectural mixing, hard to scale)"
  ]
}
```

## Dependencies

- H-0005 (CV Integration Strategy Decision) - provides decision context
- Existing WebSocket server
- FastAPI/Flask Python framework (new dependency)

## Notes

**Pros:**
- Clear API contract via OpenAPI/Swagger
- Independent health checks
- Multiple consumers can query CV service
- Better observability (logs, metrics)

**Cons:**
- Additional port (3002) to manage
- Requires websockets library in Python for real-time
- More moving parts to monitor

**Use Case:** If multiple services need CV data (robot, alarm system, analytics).

---

**Parent ID:** H-0005

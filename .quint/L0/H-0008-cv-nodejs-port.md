# H-0008: Port CV to Node.js (Radical)

**Status:** L0 (Conjecture)
**Validated By:** T-0008 (L2) → **REJECTED** (moved to invalid/)
**Verified By:** V-0008 (L1 - Substantiated)
**Kind:** system
**Scope:** Technology stack unification, eliminating Python dependency
**Decision Context:** H-0005 (CV Integration Strategy Decision)

## Method (The Recipe)

Rewrite CV logic using Node.js libraries: MediaPipe or TensorFlow.js face-api.js.

**Architecture:**
```
CV Module (Node.js, TypeScript)
    │
    │ Direct integration with WebSocket server
    ▼
WebSocket Server (Node.js, port 3001)
    │
    │ CV is just another module, no separate process
    │ Broadcasts: { "room": "hallway", "sensor": "face_recognition", "value": "Denis" }
    ▼
Next.js UI
```

**Node.js CV Implementation (using MediaPipe Face Detection):**
```typescript
import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';

const faceDetection = new FaceDetection({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
}});

faceDetection.onResults((results) => {
  if (results.detections.length > 0) {
    const detected = recognizeFace(results.detections[0]);
    // Broadcast directly to WebSocket clients
    broadcast({
      type: 'sensor_update',
      key: 'hallway_face_recognition',
      deviceId: 'cv_camera_01',
      sensorType: 'face_recognition',
      data: { value: detected.name, timestamp: new Date().toISOString() }
    });
  }
});

// Start camera
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceDetection.send({image: videoElement});
  },
  width: 640,
  height: 480
});
camera.start();
```

**No external Python process needed.** Everything runs in Node.js.

## Expected Outcome

- Unified technology stack (TypeScript/Node.js only)
- No Python runtime dependency in production
- Face recognition is just another sensor module
- Simplified deployment (single Docker image)

## Rationale

```json
{
  "source": "Radical approach",
  "anomaly": "Python CV code doesn't fit Node.js architecture, dual runtime is complexity",
  "approach": "Rewrite CV logic using Node.js ML libraries for technology stack unification",
  "alternatives_rejected": [
    "WebSocket bridge from Python (maintains dual runtime)",
    "Python microservice (adds HTTP layer complexity)",
    "Embedded Python (IPC complexity, doesn't solve dual runtime)"
  ]
}
```

## Dependencies

- H-0005 (CV Integration Strategy Decision) - provides decision context
- MediaPipe TensorFlow.js or face-api.js (new dependency)
- Webcam access in Node.js environment

## Notes

**Pros:**
- Single runtime, simplified deployment
- Type safety across entire stack
- Native integration with WebSocket server
- No Python packaging/deployment issues

**Cons:**
- High development effort (rewrite CV logic)
- ML library ecosystem less mature than Python
- Performance may be worse (JavaScript JIT vs Python C extensions)
- Face encoding comparison may require custom implementation

**Feasibility Assessment:**
- **Face Detection:** MediaPipe Face Detection works well in JS
- **Face Recognition:** Requires custom implementation or face-api.js (less mature)
- **YOLO:** TensorFlow.js has YOLO models but heavier than Python

**Estimated Effort:** High (3-5 days rewrite + testing)

---

**Parent ID:** H-0005

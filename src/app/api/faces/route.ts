import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { WebSocket } from "ws";
import { faceDB, FaceRole } from "@/lib/face-db";

function notifyReloadFaces() {
  const port = process.env.WS_PORT || 3001;
  const ws = new WebSocket(`ws://localhost:${port}`);
  ws.on("open", () => {
    ws.send(JSON.stringify({ type: "reload_faces" }), () => {
      ws.close();
    });
  });
  ws.on("error", (err) => {
    console.error(`[FacesAPI] reload_faces notify failed: ${err.message}`);
  });
}

const FACES_DIR = path.join(process.cwd(), "faces");

export async function GET() {
  const profiles = faceDB.getProfiles();
  return NextResponse.json(profiles);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const role = formData.get("role") as FaceRole;
  const file = formData.get("file") as File | null;

  if (!name || !role) {
    return NextResponse.json({ error: "name and role required" }, { status: 400 });
  }

  let imageFile: string | undefined;
  if (file && file.size > 0) {
    if (!fs.existsSync(FACES_DIR)) {
      fs.mkdirSync(FACES_DIR, { recursive: true });
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    imageFile = `${name}.${ext}`;
    const bytes = await file.arrayBuffer();
    fs.writeFileSync(path.join(FACES_DIR, imageFile), Buffer.from(bytes));
    console.log(`[FacesAPI] Saved face image: faces/${imageFile}`);
    notifyReloadFaces();
  }

  const profile = faceDB.addProfile({
    name,
    role,
    addedDate: new Date().toLocaleDateString("ru-RU"),
    imageFile,
  });

  return NextResponse.json(profile, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const profile = faceDB.getProfile(id);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (profile.imageFile) {
    const imagePath = path.join(FACES_DIR, profile.imageFile);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`[FacesAPI] Deleted face image: faces/${profile.imageFile}`);
    }
    notifyReloadFaces();
  }

  faceDB.deleteProfile(id);
  return NextResponse.json({ ok: true });
}

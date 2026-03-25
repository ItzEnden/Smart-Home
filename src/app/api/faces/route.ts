import { NextRequest, NextResponse } from "next/server";
import { faceDB, FaceRole } from "@/lib/face-db";

export async function GET() {
  const profiles = faceDB.getProfiles();
  return NextResponse.json(profiles);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, role } = body as { name: string; role: FaceRole };

  if (!name || !role) {
    return NextResponse.json({ error: "name and role required" }, { status: 400 });
  }

  const profile = faceDB.addProfile({
    name,
    role,
    addedDate: new Date().toLocaleDateString("ru-RU"),
  });

  return NextResponse.json(profile, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const deleted = faceDB.deleteProfile(id);
  if (!deleted) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

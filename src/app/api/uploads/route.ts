import { NextRequest, NextResponse } from "next/server";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Demo uploads: return a data URL instead of writing to disk.
 * Amplify SSR has a read-only filesystem, so public/uploads/ cannot be used.
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Photo is required" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG or WebP allowed" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Photo must be under 5MB" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const mime = file.type === "image/jpg" ? "image/jpeg" : file.type;
    const url = `data:${mime};base64,${bytes.toString("base64")}`;

    return NextResponse.json({ url }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

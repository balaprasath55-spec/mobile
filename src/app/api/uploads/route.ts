import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

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
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const name = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);

    return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

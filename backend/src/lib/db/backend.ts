import { connectDB } from "@/lib/mongodb";
import * as mem from "@/lib/memory-store";

let backend: "mongo" | "memory" | null = null;

export async function pickBackend(): Promise<"mongo" | "memory"> {
  if (backend) return backend;
  try {
    await connectDB();
    backend = "mongo";
  } catch (err) {
    console.warn("[db] MongoDB unavailable — using in-memory fallback:", (err as Error).message);
    mem.ensureSeeded();
    backend = "memory";
  }
  return backend;
}

export function usingMemoryFallback() {
  return backend === "memory";
}

export function resetBackendChoice() {
  backend = null;
}

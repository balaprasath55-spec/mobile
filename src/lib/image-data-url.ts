/** Client-side image → data URL (Amplify has no writable filesystem). */
export async function fileToDataUrl(file: File, maxEdge = 1280, quality = 0.75): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only images are allowed");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Photo must be under 5MB");
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not process photo");
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    // Fallback if createImageBitmap / canvas fails
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read photo"));
      reader.readAsDataURL(file);
    });
  }
}

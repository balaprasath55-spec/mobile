/**
 * Downloads phone product thumbnails from Wikimedia Commons (CC BY-SA / public domain).
 * Run: npx tsx scripts/download-pricing-phones.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "pricing", "phones");

const FILES: Record<string, string> = {
  "iphone-x.png": "File:IPhone X.png",
  "iphone-11.jpg": "File:IPhone 11 RED.jpg",
  "iphone-12.png": "File:Iphone-12-product--red.png",
  "iphone-13.jpg": "File:IPhone 13 Pro.jpg",
  "iphone-14.jpg": "File:IPhone 14 Pro Deep Purple.jpg",
  "iphone-15.jpg": "File:Apple iPhone 15 Pro.jpg",
  "iphone-16.jpg": "File:IPhone 16 Pro series.jpg",
  "iphone-17.jpg": "File:IPhone 16 Pro series.jpg",
  "galaxy-s.png": "File:Samsung S24 Ultra Phone.png",
  "galaxy-note.png": "File:Samsung Galaxy Note 20 front.png",
  "galaxy-z-flip.jpg": "File:Samsung-Galaxy-Z-Flip-5 novy-pant.jpg",
  "galaxy-z-fold.jpg": "File:Samsung Galaxy Fold 5.jpg",
  "moto-razr.png": "File:Moto Razr 2020.png",
  "moto-edge.jpg": "File:Motorola edge 40 neo.jpg",
};

async function commonsThumb(fileTitle: string, width = 220): Promise<string | null> {
  const params = new URLSearchParams({
    action: "query",
    titles: fileTitle,
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: String(width),
    format: "json",
  });
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
      headers: { "User-Agent": "MRMobileZone/1.0 (pricing thumbnails; contact@example.com)" },
    });
    const text = await res.text();
    if (text.startsWith("You are")) {
      const wait = 5000 * (attempt + 1);
      console.log(`  rate limited, waiting ${wait}ms...`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    const data = JSON.parse(text) as {
      query?: { pages?: Record<string, { imageinfo?: { thumburl?: string }[] }> };
    };
    const pages = data.query?.pages ?? {};
    for (const page of Object.values(pages)) {
      const thumb = page.imageinfo?.[0]?.thumburl;
      if (thumb) return thumb;
    }
    return null;
  }
  return null;
}

async function download(url: string): Promise<Buffer> {
  const res = await fetch(url, {
    headers: { "User-Agent": "MRMobileZone/1.0 (pricing thumbnails; local dev)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.slice(0, 5).toString("utf8").startsWith("<!DOC")) {
    throw new Error("Received HTML instead of image");
  }
  return buf;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  let ok = 0;
  let fail = 0;

  for (const [filename, title] of Object.entries(FILES)) {
    try {
      const thumb = await commonsThumb(title);
      if (!thumb) {
        console.error(`FAIL ${filename}: no thumb for ${title}`);
        fail++;
        continue;
      }
      const buf = await download(thumb);
      await writeFile(path.join(OUT_DIR, filename), buf);
      console.log(`OK   ${filename} (${buf.length} bytes)`);
      ok++;
      await new Promise((r) => setTimeout(r, 2500));
    } catch (e) {
      console.error(`FAIL ${filename}:`, e instanceof Error ? e.message : e);
      fail++;
    }
  }

  console.log(`\nDone: ${ok} ok, ${fail} failed → ${OUT_DIR}`);
  if (fail > 0) process.exit(1);
}

main();

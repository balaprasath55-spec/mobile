/**
 * Phone product thumbnails from Wikimedia Commons (CC BY-SA / free licenses).
 * Sources downloaded via scripts/download-pricing-phones.ts → public/pricing/phones/
 */

const PHONES = "/pricing/phones";

const SERIES_IMAGES: Record<string, string> = {
  "iphone-all": `${PHONES}/iphone-15.jpg`,
  "galaxy-s": `${PHONES}/galaxy-s.png`,
  "galaxy-z-flip": `${PHONES}/galaxy-z-flip.jpg`,
  "galaxy-z-fold": `${PHONES}/galaxy-z-fold.jpg`,
  "moto-razr": `${PHONES}/moto-razr.png`,
  "moto-edge": `${PHONES}/moto-edge.jpg`,
};

const IPHONE_IMAGES: Record<string, string> = {
  "iphone-x": `${PHONES}/iphone-x.png`,
  "iphone-xr": `${PHONES}/iphone-x.png`,
  "iphone-xs": `${PHONES}/iphone-x.png`,
  "iphone-xs-max": `${PHONES}/iphone-x.png`,
  "iphone-11": `${PHONES}/iphone-11.jpg`,
  "iphone-11-pro": `${PHONES}/iphone-11.jpg`,
  "iphone-11-pro-max": `${PHONES}/iphone-11.jpg`,
  "iphone-12": `${PHONES}/iphone-12.png`,
  "iphone-12-pro": `${PHONES}/iphone-12.png`,
  "iphone-12-pro-max": `${PHONES}/iphone-12.png`,
  "iphone-13": `${PHONES}/iphone-13.jpg`,
  "iphone-13-pro": `${PHONES}/iphone-13.jpg`,
  "iphone-13-pro-max": `${PHONES}/iphone-13.jpg`,
  "iphone-14": `${PHONES}/iphone-14.jpg`,
  "iphone-14-plus": `${PHONES}/iphone-14.jpg`,
  "iphone-14-pro": `${PHONES}/iphone-14.jpg`,
  "iphone-14-pro-max": `${PHONES}/iphone-14.jpg`,
  "iphone-15": `${PHONES}/iphone-15.jpg`,
  "iphone-15-plus": `${PHONES}/iphone-15.jpg`,
  "iphone-15-pro": `${PHONES}/iphone-15.jpg`,
  "iphone-15-pro-max": `${PHONES}/iphone-15.jpg`,
  "iphone-16": `${PHONES}/iphone-16.jpg`,
  "iphone-16-plus": `${PHONES}/iphone-16.jpg`,
  "iphone-16-pro": `${PHONES}/iphone-16.jpg`,
  "iphone-16-pro-max": `${PHONES}/iphone-16.jpg`,
  "iphone-17": `${PHONES}/iphone-17.jpg`,
  "iphone-17-pro": `${PHONES}/iphone-17.jpg`,
  "iphone-17-pro-max": `${PHONES}/iphone-17.jpg`,
  "iphone-17-air": `${PHONES}/iphone-17.jpg`,
};

function samsungModelImage(modelId: string): string | null {
  if (modelId.startsWith("note-")) return `${PHONES}/galaxy-note.png`;
  if (modelId.startsWith("s")) return `${PHONES}/galaxy-s.png`;
  if (modelId.startsWith("z-flip")) return `${PHONES}/galaxy-z-flip.jpg`;
  if (modelId.startsWith("z-fold")) return `${PHONES}/galaxy-z-fold.jpg`;
  return null;
}

function motoModelImage(modelId: string): string | null {
  if (modelId.startsWith("razr")) return `${PHONES}/moto-razr.png`;
  if (modelId.startsWith("edge")) return `${PHONES}/moto-edge.jpg`;
  return null;
}

export function getSeriesImage(seriesId: string): string {
  return SERIES_IMAGES[seriesId] ?? `${PHONES}/galaxy-s.png`;
}

export function getModelImage(modelId: string, seriesId: string): string {
  if (IPHONE_IMAGES[modelId]) return IPHONE_IMAGES[modelId];
  const samsung = samsungModelImage(modelId);
  if (samsung) return samsung;
  const moto = motoModelImage(modelId);
  if (moto) return moto;
  return getSeriesImage(seriesId);
}

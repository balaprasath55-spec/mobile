/**
 * Seed MongoDB from mobile_zone_service.json + catalog data.
 * Place mobile_zone_service.json in the backend folder (cwd).
 */
import { config } from "dotenv";
import { resolve } from "path";
import { seedMongoDirect } from "../src/lib/db/index";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const force = process.argv.includes("--force");
  console.log("Connecting to MongoDB and importing shop data…");
  const result = await seedMongoDirect(force);
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err.message ?? err);
  process.exit(1);
});

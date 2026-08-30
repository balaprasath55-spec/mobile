/** Try multiple MongoDB URI formats and report which connects. */
import { config } from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function mask(uri: string) {
  return uri.replace(/:([^:@/]+)@/, ":***@");
}

function buildDirectUri(srvUri: string) {
  const match = srvUri.match(/^mongodb\+srv:\/\/([^@]+)@([^/?]+)(\/[^?]*)?(\?.*)?$/);
  if (!match) return null;
  const creds = match[1];
  const path = match[3] ?? "/mrmobilezone";
  const query = match[4]?.replace(/^\?/, "") ?? "";
  const hosts =
    "ac-orcnoqx-shard-00-00.yylyuld.mongodb.net:27017," +
    "ac-orcnoqx-shard-00-01.yylyuld.mongodb.net:27017," +
    "ac-orcnoqx-shard-00-02.yylyuld.mongodb.net:27017";
  const params = new URLSearchParams(query);
  params.set("ssl", "true");
  params.set("authSource", "admin");
  if (!params.has("replicaSet")) params.set("replicaSet", "atlas-orcnoqx-shard-0");
  return `mongodb://${creds}@${hosts}${path}?${params.toString()}`;
}

async function tryUri(label: string, uri: string, write = false) {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000, family: 4 });
    const db = mongoose.connection.db?.databaseName;
    if (write && mongoose.connection.db) {
      await mongoose.connection.db.collection("_seed_probe").insertOne({ t: Date.now() });
      await mongoose.connection.db.collection("_seed_probe").deleteMany({ t: { $exists: true } });
    }
    console.log(`OK [${label}] db=${db} write=${write} uri=${mask(uri)}`);
    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.log(`FAIL [${label}] write=${write}: ${(err as Error).message}`);
    await mongoose.disconnect().catch(() => undefined);
    return false;
  }
}

async function main() {
  const srv = process.env.MONGODB_URI?.trim();
  const direct = process.env.MONGODB_URI_DIRECT?.trim();
  const built = srv?.startsWith("mongodb+srv://") ? buildDirectUri(srv) : null;
  const singleHost = srv && credsFromSrv(srv)
    ? `mongodb://${credsFromSrv(srv)}@ac-orcnoqx-shard-00-00.yylyuld.mongodb.net:27017/mrmobilezone?ssl=true&authSource=admin&directConnection=true`
    : null;

  if (srv) await tryUri("srv", srv);
  if (direct) await tryUri("direct-env", direct);
  if (built) await tryUri("direct-built", built, true);
  for (const n of ["00", "01", "02"]) {
    const host = `ac-orcnoqx-shard-00-${n}.yylyuld.mongodb.net:27017`;
    const creds = srv ? credsFromSrv(srv) : null;
    if (creds) {
      const u = `mongodb://${creds}@${host}/mrmobilezone?ssl=true&authSource=admin&directConnection=true`;
      await tryUri(`shard-${n}`, u, true);
    }
  }
}

function credsFromSrv(srvUri: string) {
  const m = srvUri.match(/^mongodb\+srv:\/\/([^@]+)@/);
  return m?.[1] ?? null;
}

main().catch(console.error);

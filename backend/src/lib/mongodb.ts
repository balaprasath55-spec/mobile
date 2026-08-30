import mongoose from "mongoose";

const globalForMongo = globalThis as unknown as {
  mongooseConn?: typeof mongoose;
  mongoosePromise?: Promise<typeof mongoose>;
  connectFailed?: boolean;
};

function parseSrvUri(uri: string) {
  const match = uri.match(/^mongodb\+srv:\/\/([^@]+)@([^/?]+)(\/[^?]*)?(\?.*)?$/);
  if (!match) return null;
  return {
    creds: match[1],
    path: match[3] ?? "/mrmobilezone",
    query: match[4]?.replace(/^\?/, "") ?? "",
  };
}

function buildReplicaSetUri(creds: string, path: string, query: string) {
  const hosts =
    "ac-orcnoqx-shard-00-00.yylyuld.mongodb.net:27017," +
    "ac-orcnoqx-shard-00-01.yylyuld.mongodb.net:27017," +
    "ac-orcnoqx-shard-00-02.yylyuld.mongodb.net:27017";
  const params = new URLSearchParams(query);
  params.set("ssl", "true");
  params.set("authSource", "admin");
  params.set("replicaSet", "atlas-orcnoqx-shard-0");
  params.set("readPreference", "primary");
  return `mongodb://${creds}@${hosts}${path}?${params.toString()}`;
}

function buildShardUri(creds: string, path: string, query: string, shard: string) {
  const params = new URLSearchParams(query);
  params.set("ssl", "true");
  params.set("authSource", "admin");
  params.set("directConnection", "true");
  return `mongodb://${creds}@ac-orcnoqx-shard-00-${shard}.yylyuld.mongodb.net:27017${path}?${params.toString()}`;
}

function getUriCandidates(): string[] {
  const direct = process.env.MONGODB_URI_DIRECT?.trim();
  if (direct) return [direct];

  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!uri.startsWith("mongodb+srv://")) return [uri];

  const parsed = parseSrvUri(uri);
  if (!parsed) return [uri];

  return [
    buildReplicaSetUri(parsed.creds, parsed.path, parsed.query),
    ...["00", "01", "02"].map((s) => buildShardUri(parsed.creds, parsed.path, parsed.query, s)),
  ];
}

export function resetMongoConnection() {
  globalForMongo.connectFailed = false;
  globalForMongo.mongooseConn = undefined;
  globalForMongo.mongoosePromise = undefined;
  void mongoose.disconnect();
}

async function connectUri(uri: string, timeoutMs: number) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: timeoutMs,
    family: 4,
  });
}

async function establishConnection() {
  const errors: string[] = [];
  const candidates = getUriCandidates();

  for (let i = 0; i < candidates.length; i++) {
    const uri = candidates[i];
    const isShard = uri.includes("directConnection=true");
    try {
      await mongoose.disconnect().catch(() => undefined);
      await connectUri(uri, i === 0 ? 25000 : 12000);

      if (isShard) {
        const hello = await mongoose.connection.db!.admin().command({ hello: 1 });
        if (!hello.isWritablePrimary) {
          errors.push(`shard not primary: ${hello.me}`);
          await mongoose.disconnect().catch(() => undefined);
          continue;
        }
      }

      return mongoose;
    } catch (err) {
      errors.push((err as Error).message);
      await mongoose.disconnect().catch(() => undefined);
    }
  }

  throw new Error(`MongoDB connect failed: ${errors.join(" | ")}`);
}

export async function connectDB(opts?: { fresh?: boolean }) {
  if (opts?.fresh) resetMongoConnection();
  if (globalForMongo.connectFailed && !opts?.fresh) {
    throw new Error("MongoDB connection previously failed");
  }
  if (globalForMongo.mongooseConn) return globalForMongo.mongooseConn;

  if (!globalForMongo.mongoosePromise) {
    globalForMongo.mongoosePromise = establishConnection().catch((err) => {
      globalForMongo.connectFailed = true;
      globalForMongo.mongoosePromise = undefined;
      throw err;
    });
  }

  globalForMongo.mongooseConn = await globalForMongo.mongoosePromise;
  return globalForMongo.mongooseConn;
}

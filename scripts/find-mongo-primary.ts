import { config } from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function hello(label: string, uri: string) {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000, family: 4 });
    const result = await mongoose.connection.db!.admin().command({ hello: 1 });
    console.log(
      label,
      "me=",
      result.me,
      "primary=",
      result.primary,
      "isWritablePrimary=",
      result.isWritablePrimary,
      "setName=",
      result.setName
    );
    await mongoose.disconnect();
  } catch (err) {
    console.log(label, "FAIL", (err as Error).message);
    await mongoose.disconnect().catch(() => undefined);
  }
}

async function main() {
  const srv = process.env.MONGODB_URI!;
  const m = srv.match(/^mongodb\+srv:\/\/([^@]+)@/);
  const creds = m?.[1];
  if (!creds) return;

  for (const n of ["00", "01", "02"]) {
    const uri = `mongodb://${creds}@ac-orcnoqx-shard-00-${n}.yylyuld.mongodb.net:27017/mrmobilezone?ssl=true&authSource=admin&directConnection=true`;
    await hello(`shard-${n}`, uri);
  }
}

main();

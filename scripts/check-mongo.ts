import { config } from "dotenv";
import { resolve } from "path";
import { resetBackendChoice } from "../src/lib/db/backend";
import { resetMongoConnection, connectDB } from "../src/lib/mongodb";
import { Customer, Repair } from "../src/lib/models";
import mongoose from "mongoose";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  resetBackendChoice();
  resetMongoConnection();
  await connectDB({ fresh: true });
  const customers = await Customer.estimatedDocumentCount();
  const repairs = await Repair.estimatedDocumentCount();
  const sample = await Customer.findOne().sort({ name: 1 }).lean();
  console.log(
    JSON.stringify(
      {
        connected: true,
        host: mongoose.connection.host,
        database: mongoose.connection.db?.databaseName,
        customers,
        repairs,
        sampleCustomer: sample ? { id: sample._id, name: sample.name, phone: sample.phone } : null,
      },
      null,
      2
    )
  );
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(JSON.stringify({ connected: false, error: e.message }));
  process.exit(1);
});

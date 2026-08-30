/**
 * Mark all repairs as DELIVERED (historical shop import cleanup).
 * Usage: npx tsx scripts/mark-all-repairs-delivered.ts
 */
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

  const customers = await Customer.countDocuments();
  const total = await Repair.countDocuments();
  const byStatus = await Repair.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  const repeatAgg = await Repair.aggregate([
    { $group: { _id: "$customerId", jobs: { $sum: 1 } } },
    { $match: { jobs: { $gt: 1 } } },
    { $count: "customers" },
  ]);
  const customersWithMultipleJobs = repeatAgg[0]?.customers ?? 0;

  console.log("Before update:");
  console.log(
    JSON.stringify(
      { customers, repairs: total, diff: total - customers, customersWithMultipleJobs, byStatus },
      null,
      2
    )
  );

  const result = await Repair.updateMany(
    {},
    [
      {
        $set: {
          status: "DELIVERED",
          deliveredAt: {
            $ifNull: ["$deliveredAt", { $ifNull: ["$deliveryDate", "$createdAt"] }],
          },
        },
      },
    ],
    { updatePipeline: true }
  );

  const after = await Repair.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  console.log("\nUpdated:", result.modifiedCount, "repairs");
  console.log("After update:", JSON.stringify({ byStatus: after }, null, 2));

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

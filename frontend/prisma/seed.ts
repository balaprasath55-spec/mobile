import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  await prisma.adminUser.upsert({
    where: { email: "admin@mrmobilezone.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@mrmobilezone.com",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  const brandData: Record<string, string[]> = {
    Apple: ["iPhone 13", "iPhone 14", "iPhone 15", "iPhone 15 Pro", "iPad Air"],
    Samsung: ["Galaxy S23", "Galaxy S24", "Galaxy A54", "Galaxy Z Flip5"],
    Xiaomi: ["Redmi Note 13", "Xiaomi 14", "POCO F5"],
    OnePlus: ["OnePlus 11", "OnePlus 12", "OnePlus Nord 3"],
    Vivo: ["Vivo V29", "Vivo X100", "Vivo Y100"],
    Oppo: ["Oppo Reno 11", "Oppo Find X6", "Oppo A78"],
  };

  const brands: { id: string; name: string; models: { id: string; name: string }[] }[] = [];

  for (const [name, models] of Object.entries(brandData)) {
    const brand = await prisma.brand.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, isActive: true },
    });

    const modelRows = [];
    for (const modelName of models) {
      const existing = await prisma.model.findFirst({
        where: { brandId: brand.id, name: modelName },
      });
      const model =
        existing ??
        (await prisma.model.create({
          data: { brandId: brand.id, name: modelName, isActive: true },
        }));
      modelRows.push(model);
    }
    brands.push({ id: brand.id, name, models: modelRows });
  }

  const issueNames = [
    "Display",
    "Battery",
    "Back Glass",
    "Touch Glass",
    "Face ID",
    "Motherboard/Water Damage",
  ];

  const issues = [];
  for (const name of issueNames) {
    const issue = await prisma.issue.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, isActive: true },
    });
    issues.push(issue);
  }

  const priceRanges: Record<string, { min: number; max: number }> = {
    Display: { min: 2500, max: 28000 },
    Battery: { min: 1200, max: 6500 },
    "Back Glass": { min: 1800, max: 12000 },
    "Touch Glass": { min: 1500, max: 9000 },
    "Face ID": { min: 4500, max: 18000 },
    "Motherboard/Water Damage": { min: 3500, max: 25000 },
  };

  for (const brand of brands) {
    for (const model of brand.models) {
      for (const issue of issues) {
        const range = priceRanges[issue.name];
        const premium = brand.name === "Apple" ? 1.4 : brand.name === "Samsung" ? 1.15 : 1;
        await prisma.priceEstimate.upsert({
          where: {
            modelId_issueId: { modelId: model.id, issueId: issue.id },
          },
          update: {
            priceMin: Math.round(range.min * premium),
            priceMax: Math.round(range.max * premium),
            isActive: true,
          },
          create: {
            modelId: model.id,
            issueId: issue.id,
            priceMin: Math.round(range.min * premium),
            priceMax: Math.round(range.max * premium),
            isActive: true,
          },
        });
      }
    }
  }

  console.log("Seed complete: SUPER_ADMIN, brands, models, issues, price estimates.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

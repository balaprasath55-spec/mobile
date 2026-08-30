import type { DemoBrand, DemoEstimate, DemoIssue, DemoModel } from "@/lib/demo-store";

export function buildCatalogSeed(): {
  brands: DemoBrand[];
  models: DemoModel[];
  issues: DemoIssue[];
  estimates: DemoEstimate[];
} {
  const brands: DemoBrand[] = [
    { id: "brand_apple", name: "Apple", isActive: true },
    { id: "brand_samsung", name: "Samsung", isActive: true },
    { id: "brand_xiaomi", name: "Xiaomi", isActive: true },
    { id: "brand_redmi", name: "Redmi", isActive: true },
    { id: "brand_poco", name: "POCO", isActive: true },
    { id: "brand_oneplus", name: "OnePlus", isActive: true },
    { id: "brand_vivo", name: "Vivo", isActive: true },
    { id: "brand_oppo", name: "Oppo", isActive: true },
    { id: "brand_realme", name: "Realme", isActive: true },
    { id: "brand_motorola", name: "Motorola", isActive: true },
    { id: "brand_google", name: "Google", isActive: true },
    { id: "brand_nothing", name: "Nothing", isActive: true },
    { id: "brand_iqoo", name: "iQOO", isActive: true },
    { id: "brand_honor", name: "Honor", isActive: true },
    { id: "brand_huawei", name: "Huawei", isActive: true },
    { id: "brand_nokia", name: "Nokia", isActive: true },
    { id: "brand_asus", name: "Asus", isActive: true },
    { id: "brand_infinix", name: "Infinix", isActive: true },
    { id: "brand_tecno", name: "Tecno", isActive: true },
    { id: "brand_lava", name: "Lava", isActive: true },
  ];

  const modelSeed: Record<string, string[]> = {
    brand_apple: [
      "iPhone 11", "iPhone 12", "iPhone 12 Pro", "iPhone 13", "iPhone 13 Pro", "iPhone 14",
      "iPhone 14 Pro", "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
      "iPhone 16", "iPhone 16 Pro", "iPhone 16 Pro Max", "iPhone SE (3rd gen)", "iPad Air",
      "iPad Pro 11", "iPad mini",
    ],
    brand_samsung: [
      "Galaxy S21", "Galaxy S22", "Galaxy S23", "Galaxy S23 Ultra", "Galaxy S24", "Galaxy S24 Ultra",
      "Galaxy S25", "Galaxy A14", "Galaxy A34", "Galaxy A54", "Galaxy A55", "Galaxy M34",
      "Galaxy Z Flip5", "Galaxy Z Flip6", "Galaxy Z Fold5", "Galaxy Z Fold6", "Galaxy Note 20", "Galaxy Tab S9",
    ],
    brand_xiaomi: ["Xiaomi 12", "Xiaomi 13", "Xiaomi 14", "Xiaomi 14 Ultra", "Xiaomi 15", "Mix Fold 3"],
    brand_redmi: [
      "Redmi Note 11", "Redmi Note 12", "Redmi Note 13", "Redmi Note 13 Pro", "Redmi Note 14",
      "Redmi 12", "Redmi 13C", "Redmi K70",
    ],
    brand_poco: ["POCO F5", "POCO F6", "POCO X5 Pro", "POCO X6", "POCO M6 Pro", "POCO C65"],
    brand_oneplus: [
      "OnePlus 10 Pro", "OnePlus 11", "OnePlus 12", "OnePlus 12R", "OnePlus 13",
      "OnePlus Nord CE 3", "OnePlus Nord 3", "OnePlus Nord 4", "OnePlus Open",
    ],
    brand_vivo: [
      "Vivo V27", "Vivo V29", "Vivo V30", "Vivo V40", "Vivo X100", "Vivo X100 Pro",
      "Vivo Y100", "Vivo Y200", "Vivo T3", "Vivo X Fold 3", "Vivo X Fold 3 Pro",
    ],
    brand_oppo: [
      "Oppo A78", "Oppo A59", "Oppo Reno 10", "Oppo Reno 11", "Oppo Reno 12",
      "Oppo Find X5", "Oppo Find X6", "Oppo Find N3", "Oppo F25",
    ],
    brand_realme: [
      "Realme 11", "Realme 12", "Realme 12 Pro", "Realme GT 5", "Realme GT 6",
      "Realme Narzo 60", "Realme Narzo 70", "Realme C67", "Realme C75",
    ],
    brand_motorola: [
      "Moto G84", "Moto G54", "Moto G73", "Moto Edge 40", "Moto Edge 50", "Moto Edge 50 Pro",
      "Moto Edge 60 Fusion", "Razr 40", "Razr 50",
    ],
    brand_google: [
      "Pixel 6a", "Pixel 7", "Pixel 7a", "Pixel 8", "Pixel 8 Pro", "Pixel 8a", "Pixel 9", "Pixel 9 Pro",
    ],
    brand_nothing: ["Nothing Phone (1)", "Nothing Phone (2)", "Nothing Phone (2a)", "Nothing Phone (3a)"],
    brand_iqoo: ["iQOO Z7", "iQOO Z9", "iQOO Neo 7", "iQOO Neo 9", "iQOO 12", "iQOO 13"],
    brand_honor: ["Honor 90", "Honor 200", "Honor X9b", "Honor Magic 6", "Honor Magic V2"],
    brand_huawei: ["Huawei P30", "Huawei P40", "Huawei Mate 40", "Huawei Nova 11", "Huawei Mate X3"],
    brand_nokia: ["Nokia G42", "Nokia G22", "Nokia X30", "Nokia C32"],
    brand_asus: ["ROG Phone 7", "ROG Phone 8", "Zenfone 10", "Zenfone 11"],
    brand_infinix: ["Infinix Hot 40", "Infinix Note 40", "Infinix Zero 30", "Infinix GT 20"],
    brand_tecno: ["Tecno Spark 20", "Tecno Camon 30", "Tecno Pova 5", "Tecno Phantom V"],
    brand_lava: ["Lava Blaze 2", "Lava Agni 2", "Lava Yuva 3", "Lava Storm"],
  };

  const models: DemoModel[] = [];
  for (const [brandId, names] of Object.entries(modelSeed)) {
    names.forEach((name, i) => {
      models.push({ id: `model_${brandId}_${i}`, brandId, name, isActive: true });
    });
  }

  const issues: DemoIssue[] = [
    "Display", "Battery", "Back Glass", "Touch Glass", "Face ID", "Motherboard/Water Damage",
  ].map((name, i) => ({ id: `issue_${i}`, name, isActive: true }));

  const ranges: Record<string, { min: number; max: number }> = {
    Display: { min: 2500, max: 28000 },
    Battery: { min: 1200, max: 6500 },
    "Back Glass": { min: 1800, max: 12000 },
    "Touch Glass": { min: 1500, max: 9000 },
    "Face ID": { min: 4500, max: 18000 },
    "Motherboard/Water Damage": { min: 3500, max: 25000 },
  };

  const estimates: DemoEstimate[] = [];
  for (const model of models) {
    const brand = brands.find((b) => b.id === model.brandId)!;
    const premium = brand.name === "Apple" ? 1.4 : brand.name === "Samsung" ? 1.15 : 1;
    for (const issue of issues) {
      const range = ranges[issue.name];
      estimates.push({
        id: `est_${model.id}_${issue.id}`,
        modelId: model.id,
        issueId: issue.id,
        priceMin: Math.round(range.min * premium),
        priceMax: Math.round(range.max * premium),
        isActive: true,
      });
    }
  }

  return { brands, models, issues, estimates };
}

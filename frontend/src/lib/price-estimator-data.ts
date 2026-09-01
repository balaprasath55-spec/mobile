export type PriceVariant = {
  name: string;
  min?: number;
  max?: number;
  fixed?: number;
};

export type PriceLine = {
  name: string;
  min?: number;
  max?: number;
  fixed?: number;
  note?: string;
  variants?: PriceVariant[];
};

export type EstimatorModel = {
  id: string;
  name: string;
  code?: string;
  lines: PriceLine[];
};

export type EstimatorSeries = {
  id: string;
  name: string;
  models: EstimatorModel[];
};

export type EstimatorBrand = {
  id: string;
  name: string;
  series: EstimatorSeries[];
};

const backVariants = (og: number, cog: number, copy: number): PriceLine => ({
  name: "Back glass / cover",
  variants: [
    { name: "Original glass (OG)", fixed: og },
    { name: "China glass (C OG)", fixed: cog },
    { name: "Copy glass", fixed: copy },
  ],
});

const backRange = (min: number, max: number): PriceLine => ({
  name: "Back glass / cover",
  min,
  max,
});

const battery = (min: number, max: number): PriceLine => ({
  name: "Battery replacement",
  min,
  max,
});

const displayGlass = (min: number, max: number): PriceLine => ({
  name: "Display glass replacement",
  min,
  max,
});

const display = (min: number, max: number): PriceLine => ({
  name: "Display replacement",
  min,
  max,
});

const fixed = (name: string, price: number): PriceLine => ({ name, fixed: price });

const range = (name: string, min: number, max: number): PriceLine => ({ name, min, max });

const fromPrice = (name: string, min: number): PriceLine => ({
  name,
  min,
  note: "from",
});

function iphoneModel(
  id: string,
  name: string,
  lines: PriceLine[],
  code?: string
): EstimatorModel {
  return { id, name, code, lines };
}

const IPHONE_MODELS: EstimatorModel[] = [
  iphoneModel("iphone-x", "iPhone X", [
    backRange(700, 950),
    battery(500, 1500),
    displayGlass(500, 900),
  ]),
  iphoneModel("iphone-xr", "iPhone XR", [
    backRange(700, 950),
    battery(800, 1500),
    displayGlass(800, 900),
  ]),
  iphoneModel("iphone-xs", "iPhone XS", [
    backRange(700, 950),
    battery(500, 1500),
    displayGlass(500, 900),
  ]),
  iphoneModel("iphone-xs-max", "iPhone XS Max", [
    backRange(700, 950),
    battery(1000, 1900),
    displayGlass(1000, 1500),
  ]),
  iphoneModel("iphone-11", "iPhone 11", [
    backRange(860, 1100),
    battery(800, 1500),
    displayGlass(800, 1000),
  ]),
  iphoneModel("iphone-11-pro", "iPhone 11 Pro", [
    backRange(860, 1100),
    battery(1000, 1900),
    displayGlass(1000, 1200),
  ]),
  iphoneModel("iphone-11-pro-max", "iPhone 11 Pro Max", [
    backRange(860, 1100),
    battery(1200, 2300),
    displayGlass(1200, 1600),
  ]),
  iphoneModel("iphone-12", "iPhone 12", [
    backRange(1100, 1500),
    battery(1000, 1900),
    displayGlass(1000, 1500),
  ]),
  iphoneModel("iphone-12-pro", "iPhone 12 Pro", [
    backRange(1100, 1500),
    battery(1200, 2300),
    displayGlass(1200, 1900),
  ]),
  iphoneModel("iphone-12-pro-max", "iPhone 12 Pro Max", [
    backRange(1100, 1500),
    battery(1400, 2500),
    displayGlass(1400, 2000),
  ]),
  iphoneModel("iphone-13", "iPhone 13", [
    backRange(999, 1600),
    battery(1300, 2300),
    displayGlass(1100, 1900),
  ]),
  iphoneModel("iphone-13-pro", "iPhone 13 Pro", [
    backRange(999, 1600),
    battery(1400, 2700),
    displayGlass(1400, 2200),
  ]),
  iphoneModel("iphone-13-pro-max", "iPhone 13 Pro Max", [
    backRange(999, 1600),
    battery(1500, 2800),
    displayGlass(1500, 2300),
  ]),
  iphoneModel("iphone-14", "iPhone 14", [
    backVariants(2700, 1500, 990),
    battery(1300, 2500),
    displayGlass(1300, 1900),
  ]),
  iphoneModel("iphone-14-plus", "iPhone 14 Plus", [
    battery(1400, 2700),
    displayGlass(1400, 2000),
  ]),
  iphoneModel("iphone-14-pro", "iPhone 14 Pro", [
    backRange(1500, 1900),
    battery(1400, 2800),
    displayGlass(1500, 2200),
  ]),
  iphoneModel("iphone-14-pro-max", "iPhone 14 Pro Max", [
    backRange(1500, 1900),
    battery(1500, 3200),
    displayGlass(1600, 2600),
  ]),
  iphoneModel("iphone-15", "iPhone 15", [
    backVariants(2900, 1600, 1110),
    battery(1400, 2700),
    displayGlass(1400, 2300),
  ]),
  iphoneModel("iphone-15-plus", "iPhone 15 Plus", [
    battery(1500, 2900),
    displayGlass(1500, 2300),
  ]),
  iphoneModel("iphone-15-pro", "iPhone 15 Pro", [
    backVariants(4000, 2400, 1500),
    battery(1600, 3300),
    displayGlass(1600, 2900),
  ]),
  iphoneModel("iphone-15-pro-max", "iPhone 15 Pro Max", [
    backVariants(4900, 2400, 1700),
    battery(1700, 3600),
    displayGlass(1700, 3000),
  ]),
  iphoneModel("iphone-16", "iPhone 16", [
    battery(1800, 2900),
    displayGlass(1800, 2400),
  ]),
  iphoneModel("iphone-16-plus", "iPhone 16 Plus", [
    battery(1900, 3100),
    displayGlass(1900, 2900),
  ]),
  iphoneModel("iphone-16-pro", "iPhone 16 Pro", [
    battery(2000, 3600),
    displayGlass(2000, 3300),
  ]),
  iphoneModel("iphone-16-pro-max", "iPhone 16 Pro Max", [
    battery(2300, 3800),
    displayGlass(2300, 3600),
  ]),
  iphoneModel("iphone-17", "iPhone 17", [
    battery(2500, 4200),
    displayGlass(2000, 2800),
  ]),
  iphoneModel("iphone-17-pro", "iPhone 17 Pro", [
    battery(2700, 4500),
    displayGlass(2700, 4500),
  ]),
  iphoneModel("iphone-17-pro-max", "iPhone 17 Pro Max", [
    battery(2800, 4800),
    displayGlass(2800, 4800),
  ]),
  iphoneModel("iphone-17-air", "iPhone 17 Air", [
    battery(2500, 4500),
    displayGlass(2500, 4500),
  ]),
];

const SAMSUNG_S_MODELS: EstimatorModel[] = [
  { id: "note-20-ultra", name: "Galaxy Note 20 Ultra", lines: [display(6000, 12000)] },
  { id: "note-20", name: "Galaxy Note 20", lines: [display(6000, 12000)] },
  { id: "s20", name: "Galaxy S20", lines: [display(4000, 8000)] },
  { id: "s20-plus", name: "Galaxy S20 Plus", lines: [fromPrice("Display replacement", 1000)] },
  { id: "s21", name: "Galaxy S21", lines: [display(5000, 9000)] },
  { id: "s21-plus", name: "Galaxy S21 Plus", lines: [fromPrice("Display replacement", 1000)] },
  { id: "s21-ultra", name: "Galaxy S21 Ultra", lines: [display(6000, 12000)] },
  { id: "s22", name: "Galaxy S22", lines: [display(5000, 9000)] },
  { id: "s22-plus", name: "Galaxy S22 Plus", lines: [fromPrice("Display replacement", 1000)] },
  { id: "s22-ultra", name: "Galaxy S22 Ultra", lines: [display(7000, 19000)] },
  { id: "s23-fe", name: "Galaxy S23 FE", lines: [{ name: "Display replacement", note: "Contact for quote" }] },
  { id: "s23", name: "Galaxy S23", lines: [display(5000, 10000)] },
  { id: "s23-plus", name: "Galaxy S23 Plus", lines: [fromPrice("Display replacement", 1000)] },
  { id: "s23-ultra", name: "Galaxy S23 Ultra", lines: [display(7000, 18000)] },
  { id: "s24-fe", name: "Galaxy S24 FE", lines: [display(3000, 7000)] },
  { id: "s24", name: "Galaxy S24", lines: [display(5000, 10000)] },
  { id: "s24-plus", name: "Galaxy S24 Plus", lines: [fromPrice("Display replacement", 1000)] },
  { id: "s24-ultra", name: "Galaxy S24 Ultra", lines: [display(8000, 17000)] },
  { id: "s25", name: "Galaxy S25", lines: [display(5000, 10000)] },
  { id: "s25-plus", name: "Galaxy S25 Plus", lines: [display(5000, 12000)] },
  { id: "s25-ultra", name: "Galaxy S25 Ultra", lines: [display(9000, 16000)] },
  { id: "s26", name: "Galaxy S26", lines: [display(5000, 13000)] },
];

function zFlip(id: string, name: string, lines: PriceLine[]): EstimatorModel {
  return { id, name, lines };
}

const SAMSUNG_Z_FLIP: EstimatorModel[] = [
  zFlip("z-flip-1", "Galaxy Z Flip", [
    fixed("Sub screen", 1099),
    fixed("Sub display glass", 600),
    fixed("Inner screen", 8000),
    fixed("Battery", 990),
    fixed("Back door", 800),
  ]),
  zFlip("z-flip-3", "Galaxy Z Flip 3", [
    fixed("Sub screen", 1500),
    fixed("Sub display glass", 900),
    range("Inner screen", 5000, 11000),
    fixed("Battery", 990),
    fixed("Back door", 800),
  ]),
  zFlip("z-flip-4", "Galaxy Z Flip 4", [
    fixed("Sub screen", 1500),
    fixed("Sub display glass", 900),
    range("Inner screen", 5000, 11000),
    fixed("Battery", 990),
    fixed("Back door", 800),
  ]),
  zFlip("z-flip-5", "Galaxy Z Flip 5", [
    range("Sub screen", 3000, 5000),
    fixed("Sub display glass", 1000),
    range("Inner screen", 5000, 18000),
    fixed("Battery", 990),
    fixed("Back door", 800),
  ]),
  zFlip("z-flip-6", "Galaxy Z Flip 6", [
    range("Sub screen", 3000, 5000),
    fixed("Sub display glass", 1200),
    range("Inner screen", 8000, 17000),
    fixed("Battery", 1200),
    fixed("Back door", 800),
  ]),
  zFlip("z-flip-7", "Galaxy Z Flip 7", [
    range("Sub screen", 3000, 5000),
    fixed("Sub display glass", 1200),
    range("Inner screen", 9000, 19000),
    fixed("Battery", 1200),
    fixed("Back door", 900),
  ]),
  zFlip("z-flip-7-fe", "Galaxy Z Flip 7 FE", [
    range("Sub screen", 4000, 5000),
    fixed("Sub display glass", 1200),
    range("Inner screen", 8000, 14000),
    fixed("Battery", 1400),
    fixed("Back door", 1000),
  ]),
];

function zFold(id: string, name: string, lines: PriceLine[]): EstimatorModel {
  return { id, name, lines };
}

const SAMSUNG_Z_FOLD: EstimatorModel[] = [
  zFold("z-fold-1", "Galaxy Z Fold", [
    fixed("Main screen", 4000),
    fixed("Sub display glass", 1200),
    fixed("Inner screen", 10000),
    fixed("Battery", 990),
    fixed("Back door", 800),
  ]),
  zFold("z-fold-2", "Galaxy Z Fold 2", [
    fixed("Main screen", 10000),
    fixed("Sub display glass", 999),
    fixed("Inner screen", 13000),
    fixed("Battery", 990),
    fixed("Back door", 800),
  ]),
  zFold("z-fold-3", "Galaxy Z Fold 3", [
    fixed("Main screen", 8000),
    fixed("Sub display glass", 999),
    range("Inner screen", 14000, 19000),
    fixed("Battery", 990),
    fixed("Back door", 800),
  ]),
  zFold("z-fold-4", "Galaxy Z Fold 4", [
    range("Main screen", 5000, 7000),
    fixed("Sub display glass", 999),
    range("Inner screen", 15000, 23000),
    fixed("Battery", 990),
    fixed("Back door", 800),
  ]),
  zFold("z-fold-5", "Galaxy Z Fold 5", [
    fixed("Main screen", 7000),
    range("Inner screen", 15000, 23000),
    fixed("Battery", 1200),
    fixed("Back door", 800),
  ]),
  zFold("z-fold-6", "Galaxy Z Fold 6", [
    range("Main screen", 4000, 6000),
    fixed("Sub display glass", 1200),
    range("Inner screen", 15000, 35000),
    fixed("Battery", 1200),
    fixed("Back door", 900),
  ]),
  zFold("z-fold-7", "Galaxy Z Fold 7", [
    range("Main screen", 6000, 8000),
    fixed("Sub display glass", 1400),
    range("Inner screen", 15000, 38000),
    fixed("Battery", 1400),
    fixed("Back door", 1000),
  ]),
];

function motoRazr(id: string, name: string, innerMax: number): EstimatorModel {
  const subScreen = name.includes("60") ? 5200 : name.includes("50") ? 5200 : 4800;
  return {
    id,
    name,
    lines: [
      fixed("Sub screen", subScreen),
      fixed("Sub display glass", 1200),
      range("Inner screen", 5000, innerMax),
      fixed("Battery", 990),
      fixed("Back door", 600),
    ],
  };
}

const MOTO_RAZR: EstimatorModel[] = [
  motoRazr("razr-40", "Moto Razr 40", 11000),
  motoRazr("razr-40-ultra", "Moto Razr 40 Ultra", 11000),
  motoRazr("razr-50", "Moto Razr 50", 11000),
  motoRazr("razr-50-ultra", "Moto Razr 50 Ultra", 12000),
  motoRazr("razr-60", "Moto Razr 60", 14000),
  motoRazr("razr-60-ultra", "Moto Razr 60 Ultra", 14000),
];

function motoEdge(
  id: string,
  name: string,
  motherboard: number
): EstimatorModel {
  return {
    id,
    name,
    lines: [
      display(2900, 4900),
      range("Display glass replacement", 1500, 2000),
      fixed("Motherboard", motherboard),
      fixed("Battery", 1000),
      fixed("Back door", 700),
    ],
  };
}

const MOTO_EDGE: EstimatorModel[] = [
  motoEdge("edge-40", "Moto Edge 40", 4000),
  motoEdge("edge-40-neo", "Moto Edge 40 Neo", 4000),
  motoEdge("edge-50", "Moto Edge 50", 5000),
  motoEdge("edge-50-fusion", "Moto Edge 50 Fusion", 6000),
  motoEdge("edge-50-ultra", "Moto Edge 50 Ultra", 6000),
  motoEdge("edge-60-fusion", "Moto Edge 60 Fusion", 6000),
  motoEdge("edge-60", "Moto Edge 60", 8000),
  motoEdge("edge-60-pro", "Moto Edge 60 Pro", 8000),
  motoEdge("edge-70-fusion", "Moto Edge 70 Fusion", 9000),
  motoEdge("edge-70", "Moto Edge 70", 10000),
  motoEdge("edge-70-pro", "Moto Edge 70 Pro", 6000),
];

export const PRICE_ESTIMATOR_BRANDS: EstimatorBrand[] = [
  {
    id: "iphone",
    name: "iPhone",
    series: [{ id: "iphone-all", name: "iPhone models", models: IPHONE_MODELS }],
  },
  {
    id: "samsung",
    name: "Samsung",
    series: [
      { id: "galaxy-s", name: "Galaxy S & Note", models: SAMSUNG_S_MODELS },
      { id: "galaxy-z-flip", name: "Galaxy Z Flip", models: SAMSUNG_Z_FLIP },
      { id: "galaxy-z-fold", name: "Galaxy Z Fold", models: SAMSUNG_Z_FOLD },
    ],
  },
  {
    id: "moto",
    name: "Motorola",
    series: [
      { id: "moto-razr", name: "Moto Razr", models: MOTO_RAZR },
      { id: "moto-edge", name: "Moto Edge", models: MOTO_EDGE },
    ],
  },
];

export function findEstimatorModel(brandId: string, modelId: string): EstimatorModel | null {
  const brand = PRICE_ESTIMATOR_BRANDS.find((b) => b.id === brandId);
  if (!brand) return null;
  for (const series of brand.series) {
    const model = series.models.find((m) => m.id === modelId);
    if (model) return model;
  }
  return null;
}

import { SITE } from "@/lib/utils";

export type IphoneDisplay = {
  id: string;
  model: string;
  price: number;
  image: string;
  imageAlt: string;
};

/** iPhone removed displays with sensor flex — prices in INR. */
export const IPHONE_DISPLAYS: IphoneDisplay[] = [
  {
    id: "iphone-11",
    model: "iPhone 11",
    price: 2700,
    image: "/displays/iphone-11.webp",
    imageAlt: "iPhone 11 display with touch screen",
  },
  {
    id: "iphone-xr",
    model: "iPhone XR",
    price: 2700,
    image: "/displays/iphone-xr.webp",
    imageAlt: "iPhone XR display with touch screen",
  },
  {
    id: "iphone-12",
    model: "iPhone 12",
    price: 5700,
    image: "/displays/iphone-12.webp",
    imageAlt: "iPhone 12 display with touch screen",
  },
  {
    id: "iphone-13-pro",
    model: "iPhone 13 Pro",
    price: 9900,
    image: "/displays/iphone-13-pro.webp",
    imageAlt: "iPhone 13 Pro LCD display with touch screen",
  },
  {
    id: "iphone-13-pro-max",
    model: "iPhone 13 Pro Max",
    price: 11800,
    image: "/displays/iphone-13-pro-max.webp",
    imageAlt: "iPhone 13 Pro Max display with touch screen",
  },
  {
    id: "iphone-14",
    model: "iPhone 14",
    price: 7900,
    image: "/displays/iphone-14.webp",
    imageAlt: "iPhone 14 LCD display with touch screen",
  },
  {
    id: "iphone-14-plus",
    model: "iPhone 14 Plus",
    price: 9900,
    image: "/displays/iphone-14-plus.webp",
    imageAlt: "iPhone 14 Plus LCD display with touch screen",
  },
  {
    id: "iphone-14-pro",
    model: "iPhone 14 Pro",
    price: 12900,
    image: "/displays/iphone-14-pro.webp",
    imageAlt: "iPhone 14 Pro LCD display with touch screen",
  },
  {
    id: "iphone-15",
    model: "iPhone 15",
    price: 10900,
    image: "/displays/iphone-15.webp",
    imageAlt: "iPhone 15 display with touch screen",
  },
  {
    id: "iphone-15-pro",
    model: "iPhone 15 Pro",
    price: 17900,
    image: "/displays/iphone-15-pro.webp",
    imageAlt: "iPhone 15 Pro display",
  },
  {
    id: "iphone-15-pro-max",
    model: "iPhone 15 Pro Max",
    price: 18800,
    image: "/displays/iphone-15-pro-max.webp",
    imageAlt: "iPhone 15 Pro Max display with touch screen",
  },
  {
    id: "iphone-16",
    model: "iPhone 16",
    price: 14000,
    image: "/displays/iphone-16.webp",
    imageAlt: "iPhone 16 display with touch screen",
  },
  {
    id: "iphone-16-plus",
    model: "iPhone 16 Plus",
    price: 15000,
    image: "/displays/iphone-16-plus.webp",
    imageAlt: "iPhone 16 Plus display with touch screen",
  },
  {
    id: "iphone-16-pro",
    model: "iPhone 16 Pro",
    price: 18500,
    image: "/displays/iphone-16-pro.webp",
    imageAlt: "iPhone 16 Pro display with touch screen",
  },
  {
    id: "iphone-16-pro-max",
    model: "iPhone 16 Pro Max",
    price: 21500,
    image: "/displays/iphone-16-pro-max.webp",
    imageAlt: "iPhone 16 Pro Max display with touch screen",
  },
  {
    id: "iphone-17",
    model: "iPhone 17",
    price: 21000,
    image: "/displays/iphone-17.webp",
    imageAlt: "iPhone 17 OLED display with touch screen",
  },
  {
    id: "iphone-17-pro",
    model: "iPhone 17 Pro",
    price: 25000,
    image: "/displays/iphone-17-pro.webp",
    imageAlt: "iPhone 17 Pro OLED display with touch screen",
  },
  {
    id: "iphone-17-pro-max",
    model: "iPhone 17 Pro Max",
    price: 28000,
    image: "/displays/iphone-17-pro-max.jpg",
    imageAlt: "iPhone 17 Pro Max display",
  },
  {
    id: "iphone-17-air",
    model: "iPhone 17 Air",
    price: 26500,
    image: "/displays/iphone-17-air.jpg",
    imageAlt: "iPhone 17 Air display",
  },
];

export function displayWhatsAppUrl(display: IphoneDisplay) {
  const text = [
    "Hi MR Mobile Zone,",
    "",
    `I'd like to order an iPhone removed display with sensor flex:`,
    `• Model: ${display.model}`,
    `• Listed price: ₹${display.price.toLocaleString("en-IN")}`,
    "",
    "Please confirm availability and next steps.",
  ].join("\n");
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function displaysWhatsAppUrl() {
  const text = [
    "Hi MR Mobile Zone,",
    "",
    "I'd like to enquire about iPhone removed displays with sensor flex.",
    "Please share availability and pricing.",
  ].join("\n");
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

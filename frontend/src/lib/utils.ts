import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number | string) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export const motionEase = [0.22, 1, 0.36, 1] as const;

export const SITE = {
  name: "MR Mobile Zone Service",
  shortName: "MR Mobile Zone",
  tagline: "Premium mobile & tablet repair in Chennai",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+918667024499",
  phoneDisplay: "086670 24499",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "918667024499",
  email: "hello@mrmobilezone.com",
  address: "8, Broadway, Asirvada Puram, George Town, Chennai, Greater Chennai, Tamil Nadu 600001",
  addressShort: "George Town, Chennai",
  streetAddress: "8, Broadway, Asirvada Puram, George Town",
  postalCode: "600001",
  mapQuery: "MR+MOBILE+ZONE+SERVICE+Chennai",
  mapsUrl: "https://maps.app.goo.gl/nxAUswXRPYVioscF9",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.998616149343!2d80.28406667507869!3d13.099273987227944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526f94435b9439%3A0x9465250617909645!2sMR%20MOBILE%20ZONE%20SERVICE!5e0!3m2!1sen!2sin!4v1785673474478!5m2!1sen!2sin",
  mapLat: 13.099274,
  mapLng: 80.2866416,
  hours: [
    { day: "Sunday", time: "Closed" },
    { day: "Monday", time: "10 am – 10 pm" },
    { day: "Tuesday", time: "10 am – 9:30 pm" },
    { day: "Wednesday", time: "10:30 am – 9:30 pm" },
    { day: "Thursday", time: "10:30 am – 9:30 pm" },
    { day: "Friday", time: "9:30 am – 12:30 pm, 2 – 10 pm" },
    { day: "Saturday", time: "10:30 am – 9:30 pm" },
  ],
  rating: 4.4,
  reviewCount: 347,
  instagramFollowers: 146000,
  youtubeSubscribers: 32100,
  customersServed: 11000,
} as const;

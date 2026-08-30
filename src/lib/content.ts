export const services = [
  {
    slug: "display-repair",
    title: "Display Repair",
    summary: "OEM-grade screen replacements with pixel-perfect colour calibration.",
    description:
      "Cracked, dead, or flickering displays fixed with genuine-quality panels. We calibrate colour, brightness, and True Tone where supported.",
    icon: "Smartphone",
    turnaround: "30–90 mins",
  },
  {
    slug: "battery-replacement",
    title: "Battery Replacement",
    summary: "Restore all-day battery life with certified cells and proper adhesives.",
    description:
      "Swollen or weak batteries replaced safely. We recycle old cells responsibly and reseal devices to factory standards.",
    icon: "Battery",
    turnaround: "45–60 mins",
  },
  {
    slug: "back-glass",
    title: "Back Glass",
    summary: "Laser-assisted back glass repair without disturbing internals.",
    description:
      "Precision back glass replacement for iPhone and flagship Android devices, with a clean finish and wireless charging preserved.",
    icon: "Layers",
    turnaround: "1–2 hrs",
  },
  {
    slug: "motherboard-water-damage",
    title: "Motherboard & Water Damage",
    summary: "Microsoldering and ultrasonic cleaning for complex board failures.",
    description:
      "Liquid damage recovery, power IC repair, and board-level diagnostics by specialists with microsoldering stations.",
    icon: "Cpu",
    turnaround: "1–5 days",
  },
  {
    slug: "iphone-ipad",
    title: "iPhone & iPad Specialist",
    summary: "Face ID, True Tone, and Apple-ecosystem repairs done right.",
    description:
      "Dedicated Apple workflow for Face ID, charging ports, cameras, and iPad digitizers, with data safety first.",
    icon: "Tablet",
    turnaround: "Same day",
  },
  {
    slug: "courier-repair",
    title: "All-India Courier Repair",
    summary: "Secure pan-India pickup and delivery for remote customers.",
    description:
      "Ship your device from anywhere in India. Tracked logistics, photo documentation, and insured return shipping.",
    icon: "Truck",
    turnaround: "3–7 days",
  },
] as const;

export const faqs = [
  {
    category: "General",
    items: [
      {
        q: "How long does a typical screen repair take?",
        a: "Most display replacements are completed in 30–90 minutes while you wait, depending on model and parts availability.",
      },
      {
        q: "Do you use genuine parts?",
        a: "We offer OEM-grade and genuine-quality options. We always explain the difference and pricing before starting work.",
      },
      {
        q: "Is my data safe during repair?",
        a: "Yes. We never ask for your passwords unless required for testing, and we document device condition before opening.",
      },
    ],
  },
  {
    category: "Pricing",
    items: [
      {
        q: "Are estimates free?",
        a: "Yes. Use our online price estimator or walk in for a free diagnosis. Final quotes are confirmed after inspection.",
      },
    ],
  },
  {
    category: "Courier Service",
    items: [
      {
        q: "How does courier repair work?",
        a: "Book an enquiry, pack your device securely, and ship via your preferred courier. We diagnose, repair, and return with tracking.",
      },
      {
        q: "Which cities are covered?",
        a: "We accept devices from across India. Turnaround typically ranges from 3–7 business days including transit.",
      },
    ],
  },
] as const;

export const testimonials = [
  {
    name: "Suresh R.",
    location: "Seven Wells",
    rating: 5,
    source: "Justdial",
    text: "Quick service and good customer interaction. Display replaced with original quality and proper testing before handover.",
  },
  {
    name: "Anitha M.",
    location: "Broadway, Chennai",
    rating: 5,
    source: "Google",
    text: "Experienced technicians and fair pricing. They explained the issue clearly and finished my phone the same day.",
  },
  {
    name: "Karthik V.",
    location: "George Town",
    rating: 4,
    source: "Justdial",
    text: "Came for screen repair. Quality check was thorough. Shop gets crowded but workmanship is solid.",
  },
  {
    name: "Meena L.",
    location: "Courier · Madurai",
    rating: 5,
    source: "Google",
    text: "All-India courier option worked well. Regular updates and phone returned working perfectly.",
  },
  {
    name: "Praveen S.",
    location: "Mannadi",
    rating: 5,
    source: "Justdial",
    text: "Best quality service for the price. Battery and display work done carefully. Recommended.",
  },
  {
    name: "Nisha A.",
    location: "Chennai",
    rating: 4,
    source: "Google",
    text: "Motherboard-level diagnosis was honest. They only charged after confirming the repair path.",
  },
] as const;

export const galleryItems = [
  {
    id: "shop",
    category: "Shop",
    title: "Workshop · George Town",
    image: "/gallery/shop.jpg",
  },
  {
    id: "display",
    category: "Display",
    title: "Display replacement",
    image: "/gallery/display.jpg",
  },
  {
    id: "battery",
    category: "Battery",
    title: "Battery service",
    image: "/gallery/battery.jpg",
  },
  {
    id: "backglass",
    category: "Back glass",
    title: "Back glass repair",
    image: "/gallery/backglass.jpg",
  },
  {
    id: "board",
    category: "Board",
    title: "Board-level work",
    image: "/gallery/board.jpg",
  },
] as const;

export const socialLinks = {
  instagram: "https://www.instagram.com/mr.mobile_zone_service",
  facebook: "https://www.facebook.com/mobilezoneservice",
  youtube: "https://www.youtube.com/@mr.mobilezoneservice/videos",
  google: "https://maps.app.goo.gl/nxAUswXRPYVioscF9",
  whatsappChannel: "https://whatsapp.com/channel/0029VaI1HjZ0bIdjIGu7m60J",
} as const;

/** Latest channel videos — thumbnails link out to YouTube (no in-page playback). */
export const youtubeVideos = [
  {
    id: "H8xfI8apMTc",
    title: "iPhone 17 Pro Max glass repair: save money",
  },
  {
    id: "MeHEWIzp0v0",
    title: "OnePlus Open inner & outer display replacement",
  },
  {
    id: "RUdb4d3rjTs",
    title: "Samsung S24 Ultra original display replacement",
  },
  {
    id: "qF5tCN_RSL8",
    title: "Vivo X Fold 3 Pro foldable display issue",
  },
  {
    id: "Q9i_y5g4XXU",
    title: "Display flex bonding to driver IC conversion",
  },
  {
    id: "7UGDkMYe8oE",
    title: "Mobilia Live Expo 2026: full visit review",
  },
] as const;

export const processSteps = [
  { title: "Diagnose", desc: "Free inspection with photo documentation" },
  { title: "Quote", desc: "Clear pricing before any work begins" },
  { title: "Repair", desc: "ESD-safe benches and calibrated tools" },
  { title: "Quality check", desc: "Multi-point testing before handover" },
  { title: "Deliver", desc: "Care tips and handover checklist included" },
] as const;

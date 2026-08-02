import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enquiry",
  description: "Submit a repair enquiry to MR Mobile Zone Service.",
  alternates: { canonical: "/enquiry" },
};

export default function EnquiryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

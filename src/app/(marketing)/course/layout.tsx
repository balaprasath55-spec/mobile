import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Repair Course",
  description: "Coming soon: MR Mobile Zone repair courses.",
  alternates: { canonical: "/courses" },
};

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return children;
}

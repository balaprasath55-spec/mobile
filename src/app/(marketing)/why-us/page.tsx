import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Why Choose Us",
  description: "What sets MR Mobile Zone apart from typical phone repair shops.",
  alternates: { canonical: "/why-us" },
};

const rows = [
  ["Transparent quote before work", "Yes", "Often vague"],
  ["Board-level microsoldering", "Yes", "Rare"],
  ["Photo documentation", "Yes", "Uncommon"],
  ["All-India courier workflow", "Yes", "Local only"],
  ["Warranty on parts & labour", "30–180 days", "Varies / none"],
];

export default function WhyUsPage() {
  return (
    <Section>
      <SectionHeading
        title="Why MR Mobile Zone"
        subtitle="Premium process, specialist tools, and a community that keeps coming back."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { t: "Specialist depth", d: "Face ID, True Tone, power IC — not just glass swaps." },
          { t: "Calm communication", d: "Status updates and clear pricing, every time." },
          { t: "Proven at scale", d: "146k+ Instagram community and 11k+ customer records." },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl bg-surface p-6 dark:bg-navy-800">
            <h3 className="font-display text-xl font-semibold text-navy dark:text-white">{c.t}</h3>
            <p className="mt-2 text-sm text-muted">{c.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 overflow-x-auto rounded-2xl border border-navy/5 dark:border-white/10">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-navy text-white">
            <tr>
              <th className="px-4 py-3 font-medium">Capability</th>
              <th className="px-4 py-3 font-medium">MR Mobile Zone</th>
              <th className="px-4 py-3 font-medium">Typical shop</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-t border-navy/5 dark:border-white/10">
                <td className="px-4 py-3 text-navy dark:text-white">{r[0]}</td>
                <td className="px-4 py-3 text-accent">{r[1]}</td>
                <td className="px-4 py-3 text-muted">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

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
          <div key={c.t} className="rounded-2xl bg-surface p-5 sm:p-6 dark:bg-navy-800">
            <h3 className="font-display text-lg font-semibold text-navy dark:text-white sm:text-xl">{c.t}</h3>
            <p className="mt-2 text-sm text-muted">{c.d}</p>
          </div>
        ))}
      </div>

      {/* Mobile-friendly comparison cards */}
      <ul className="mt-10 space-y-3 md:hidden">
        {rows.map((r) => (
          <li key={r[0]} className="rounded-2xl border border-navy/5 bg-white p-4 dark:border-white/10 dark:bg-navy-800">
            <p className="font-medium text-navy dark:text-white">{r[0]}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted">MR Mobile Zone</p>
                <p className="mt-0.5 font-medium text-accent">{r[1]}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted">Typical shop</p>
                <p className="mt-0.5 text-muted">{r[2]}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-12 hidden overflow-x-auto rounded-2xl border border-navy/5 dark:border-white/10 md:block">
        <table className="w-full text-left text-sm">
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

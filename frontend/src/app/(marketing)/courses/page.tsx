import type { Metadata } from "next";
import Image from "next/image";
import { Clock, GraduationCap, Wrench, Cpu, Battery, Briefcase } from "lucide-react";
import { CourseNotifyForm } from "@/components/marketing/course-notify-form";
import { Section, SectionHeading } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Repair Courses",
  description:
    "MR Mobile Zone repair courses: hands-on training from our Chennai workshop. Courses will be available soon.",
  alternates: { canonical: "/courses" },
};

/** Landscape certificate photos — first row */
const landscapeGraduates = [8, 1, 2, 3, 7].map((i) => ({
  image: `/courses/student-${i}.jpg`,
  alt: `MR Mobile Zone Service training graduate ${i + 1} with Certificate of Training`,
}));

/** Portrait certificate photos — second row */
const portraitGraduates = [4, 5, 6, 0, 9].map((i) => ({
  image: `/courses/student-${i}.jpg`,
  alt: `MR Mobile Zone Service training graduate ${i + 1} with Certificate of Training`,
}));

const upcoming = [
  {
    icon: Wrench,
    title: "Display & glass repair",
    level: "Beginner",
    duration: "5 days",
    desc: "Screen replacement, bonding, polarizer basics, and QC checks on iPhone & Android.",
  },
  {
    icon: Battery,
    title: "Battery & charging systems",
    level: "Beginner",
    duration: "3 days",
    desc: "Safe battery swaps, charge-port repair, power IC overview, and customer handover tips.",
  },
  {
    icon: Cpu,
    title: "Microsoldering fundamentals",
    level: "Intermediate",
    duration: "7 days",
    desc: "Board-level intro: jumpers, IC reballing basics, water damage triage on real boards.",
  },
  {
    icon: GraduationCap,
    title: "Face ID & sensors",
    level: "Intermediate",
    duration: "4 days",
    desc: "Dot projector / IR camera handling, flex replacements, and calibration workflows.",
  },
  {
    icon: Briefcase,
    title: "Shop setup & business",
    level: "All levels",
    duration: "2 days",
    desc: "Parts sourcing, pricing, CRM habits, and courier repair operations.",
  },
  {
    icon: Clock,
    title: "Weekend crash workshop",
    level: "Beginner",
    duration: "2 days",
    desc: "Fast track for hobbyists: common walk-in jobs with live demos on the bench.",
  },
] as const;

export default function CoursesPage() {
  return (
    <>
      <Section className="pb-8 md:pb-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Coming soon
          </p>
          <SectionHeading
            title="Repair courses"
            subtitle="Hands-on mobile repair training from the MR Mobile Zone workshop in Chennai. Courses will be available soon. Join the waitlist for launch dates."
            align="center"
          />
        </div>
      </Section>

      <Section className="bg-surface !pt-0 dark:bg-navy-900/50">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-navy dark:text-white md:text-2xl">
              Planned modules
            </h2>
            <p className="mt-1 text-sm text-muted">Preview only. Final syllabus may change at launch.</p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
            Not open for enrollment yet
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((c) => {
            const Icon = c.icon;
            return (
              <article
                key={c.title}
                className="relative flex flex-col rounded-2xl border border-navy/5 bg-white p-5 soft-shadow dark:border-white/10 dark:bg-navy-800"
              >
                <span className="absolute right-4 top-4 rounded-full bg-navy/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted dark:bg-white/10">
                  Soon
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 pr-12 font-display text-lg font-semibold text-navy dark:text-white">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{c.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                  <span className="rounded-full bg-surface px-2.5 py-1 dark:bg-navy-900">{c.level}</span>
                  <span className="rounded-full bg-surface px-2.5 py-1 dark:bg-navy-900">{c.duration}</span>
                </div>
                <button
                  type="button"
                  disabled
                  className="mt-5 h-11 w-full cursor-not-allowed rounded-full bg-navy/10 text-sm font-medium text-muted dark:bg-white/10"
                >
                  Available soon
                </button>
              </article>
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionHeading
          title="Students who completed the course"
          subtitle="Certified graduates from MR Mobile Zone Service training — hands-on repair skills, certificate on completion."
        />
        <div className="space-y-4">
          {/* Row 1 — horizontal photos */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
            {landscapeGraduates.map((g) => (
              <figure
                key={g.image}
                className="overflow-hidden rounded-2xl border border-navy/5 bg-surface soft-shadow dark:border-white/10 dark:bg-navy-900"
              >
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src={g.image}
                    alt={g.alt}
                    fill
                    className="object-contain object-top"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  />
                </div>
              </figure>
            ))}
          </div>

          {/* Row 2 — vertical photos */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
            {portraitGraduates.map((g) => (
              <figure
                key={g.image}
                className="overflow-hidden rounded-2xl border border-navy/5 bg-surface soft-shadow dark:border-white/10 dark:bg-navy-900"
              >
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={g.image}
                    alt={g.alt}
                    fill
                    className="object-contain object-top"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-surface dark:bg-navy-900/50">
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy dark:text-white">What to expect</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>• Live bench practice in our Chennai workshop</li>
              <li>• Genuine-quality parts & ESD-safe tools</li>
              <li>• Tamil + English instruction</li>
              <li>• Certificate on completion</li>
              <li>• Limited batch sizes for personal attention</li>
            </ul>
            <p className="mt-6 text-sm text-muted">
              Exact fees, dates, and seats will be announced when enrollment opens. Leave your contact and we’ll
              message you first.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 soft-shadow dark:bg-navy-800">
            <h3 className="font-display text-lg font-semibold text-navy dark:text-white">Get launch updates</h3>
            <p className="mt-1 text-sm text-muted">We’ll notify you when courses go live.</p>
            <div className="mt-5">
              <CourseNotifyForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

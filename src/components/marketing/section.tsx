import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-12 md:py-24", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function SectionHeading({
  title,
  subtitle,
  align = "left",
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-8 md:mb-14", align === "center" && "mx-auto max-w-2xl text-center")}>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-navy dark:text-white sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-2 text-sm text-muted sm:mt-3 sm:text-base md:text-lg">{subtitle}</p> : null}
    </div>
  );
}

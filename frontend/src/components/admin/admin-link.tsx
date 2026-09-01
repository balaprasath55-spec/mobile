import Link from "next/link";
import type { ComponentProps } from "react";

/** Admin navigation — no Next.js prefetch (avoids background RSC/API work). */
export function AdminLink(props: ComponentProps<typeof Link>) {
  return <Link prefetch={false} {...props} />;
}

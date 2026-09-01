import { redirect } from "next/navigation";

/** Contact is merged into /about#contact */
export default function ContactPage() {
  redirect("/about#contact");
}

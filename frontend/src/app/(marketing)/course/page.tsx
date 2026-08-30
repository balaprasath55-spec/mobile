import { redirect } from "next/navigation";

/** Old URL — keep working by sending visitors to /courses */
export default function CourseRedirectPage() {
  redirect("/courses");
}

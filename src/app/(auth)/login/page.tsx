import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LoginForm from "@/components/admin/login-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin login" };

export default async function LoginPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  if (session) redirect("/dashboard");

  return <LoginForm />;
}

import { Suspense } from "react";
import LoginForm from "@/components/admin/login-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin login" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-muted">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}

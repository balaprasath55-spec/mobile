import { Suspense } from "react";
import LoginForm from "@/components/admin/login-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin login" };

export default async function LoginPage() {
  // Do not auto-redirect when a session exists: on Amplify, Node may decode
  // the JWT while Edge middleware cannot (secret mismatch), which caused
  // /login ↔ /dashboard redirect loops. Client sign-in still goes to dashboard.
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-muted">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}

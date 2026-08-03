"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState(
    params.get("error") === "Configuration"
      ? "Auth configuration error. Redeploy the latest build, then try again."
      : params.get("error")
        ? "Sign-in failed. Check email/password or server auth settings."
        : ""
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError(
        res.error === "Configuration"
          ? "Auth configuration error. Redeploy the latest build, then try again."
          : "Invalid email or password"
      );
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 dark:bg-navy-900">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 soft-shadow dark:bg-navy-800">
        <h1 className="font-display text-2xl font-semibold text-navy dark:text-white">Admin login</h1>
        <p className="mt-2 text-sm text-muted">MR Mobile Zone Service</p>
        <div className="mt-6 space-y-3">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            required
            defaultValue="admin@mrmobilezone.com"
            className="h-12 text-base"
          />
          <Input name="password" type="password" placeholder="Password" required className="h-12 text-base" />
        </div>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="mt-6 h-12 w-full text-base" variant="accent" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        <Link href="/" className="mt-4 block text-center text-sm text-accent">
          ← Back to site
        </Link>
      </form>
    </div>
  );
}

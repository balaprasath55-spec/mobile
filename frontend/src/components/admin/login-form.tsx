"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_AUTH_COOKIE, DEMO_LOGIN, isDemoLogin } from "@/lib/demo-auth";

function setDemoCookie() {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${DEMO_AUTH_COOKIE}=1; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`;
}

export default function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");

    if (!isDemoLogin(email, password)) {
      setLoading(false);
      setError("Invalid email or password");
      return;
    }

    setDemoCookie();
    // Hard navigation so Amplify middleware always sees the new cookie
    window.location.href = "/dashboard";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 dark:bg-navy-900">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 soft-shadow dark:bg-navy-800">
        <h1 className="font-display text-2xl font-semibold text-navy dark:text-white">Admin login</h1>
        <p className="mt-2 text-sm text-muted">MR Mobile Zone Service · Demo</p>
        <div className="mt-6 space-y-3">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            required
            defaultValue={DEMO_LOGIN.email}
            className="h-12 text-base"
          />
          <Input name="password" type="password" placeholder="Password" required className="h-12 text-base" />
        </div>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="mt-6 h-12 w-full text-base" variant="accent" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        <p className="mt-3 text-center text-xs text-muted">
          Demo: {DEMO_LOGIN.email} / {DEMO_LOGIN.password}
        </p>
        <Link href="/" className="mt-4 block text-center text-sm text-accent">
          ← Back to site
        </Link>
      </form>
    </div>
  );
}

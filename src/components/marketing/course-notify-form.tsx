"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CourseNotifyForm() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/course/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fd.get("name"), contact: fd.get("contact") }),
    });
    setLoading(false);
    setMsg(res.ok ? "You’re on the list! We’ll notify you." : "Could not save. Try again.");
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <Input name="name" placeholder="Name" required className="h-12 text-base" />
      <Input name="contact" placeholder="Email or phone" required className="h-12 text-base" />
      <Button type="submit" variant="accent" disabled={loading} className="h-12">
        {loading ? "Saving…" : "Notify me"}
      </Button>
      {msg ? <p className="text-sm text-muted">{msg}</p> : null}
    </form>
  );
}

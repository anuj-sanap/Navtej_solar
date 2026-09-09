"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const supabase = createSupabaseBrowserClient();
    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: String(formData.get("fullName") ?? ""),
              phone: String(formData.get("phone") ?? ""),
              address: String(formData.get("address") ?? ""),
            },
          },
        });

    if (result.error) {
      setStatus(result.error.message);
      setPending(false);
      return;
    }

    if (mode === "register" && !result.data.session) {
      setStatus("Check your email to confirm your account, then log in.");
      setPending(false);
      return;
    }

    router.replace(new URLSearchParams(window.location.search).get("next") ?? "/");
    router.refresh();
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-5rem)] items-center bg-background py-16">
        <Container>
          <div className="mx-auto max-w-md rounded-3xl bg-white p-7 shadow-[0_16px_45px_rgba(11,37,90,.08)] sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#b07d00]">Navtej account</p>
            <h1 className="mt-4 text-4xl font-semibold text-brand-primary">{mode === "login" ? "Welcome back." : "Create your account."}</h1>
            <p className="mt-3 text-sm leading-6 text-text-secondary">Save your project conversations and keep your solar planning in one place.</p>
            <form onSubmit={submit} className="mt-8 grid gap-5">
              {mode === "register" && (
                <>
                  <label className="text-sm font-bold text-brand-primary">Full name<input name="fullName" required className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary" /></label>
                  <label className="text-sm font-bold text-brand-primary">Phone number<input name="phone" required type="tel" pattern="[0-9+() -]{10,20}" className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary" /></label>
                  <label className="text-sm font-bold text-brand-primary">Address<textarea name="address" required rows={3} className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary" /></label>
                </>
              )}
              <label className="text-sm font-bold text-brand-primary">Email<input name="email" required type="email" className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary" /></label>
              <label className="text-sm font-bold text-brand-primary">Password<input name="password" required minLength={8} type="password" className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-brand-primary" /></label>
              {status && <p role="status" className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-brand-primary">{status}</p>}
              <button disabled={pending} className="min-h-12 rounded-full bg-brand-primary px-6 py-3 text-sm font-bold text-white disabled:opacity-60">{pending ? "Please wait..." : mode === "login" ? "Log in" : "Register"}</button>
            </form>
            <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setStatus(""); }} className="mt-6 text-sm font-bold text-brand-primary underline">{mode === "login" ? "Need an account? Register" : "Already registered? Log in"}</button>
            <Link href="/" className="mt-4 block text-sm text-text-secondary">Return to homepage</Link>
          </div>
        </Container>
      </main>
    </>
  );
}

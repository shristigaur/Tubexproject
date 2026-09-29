"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function ForgotPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const data = await api("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      setSuccess(data.message || "If an account exists, a verification code has been sent.");
      
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      }, 1500);

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to send request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={loading || !!success}
          className="
            mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3
            text-sm outline-none transition focus:border-slate-900
            focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-50
          "
        />
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !!success}
        className="
          w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold
          text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60
        "
      >
        {loading ? "Sending code..." : "Send verification code"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Remember your password?{" "}
        <Link href="/login" className="font-semibold text-slate-950 hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}

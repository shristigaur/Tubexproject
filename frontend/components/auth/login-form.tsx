"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { api } from "@/lib/api";
import { GoogleAuthButton } from "./google-auth-button";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Email validation
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      if (data.requiresOtp) {
        setSuccess(data.message || "Please verify your email.");
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        }, 700);
        return;
      }

      setSuccess(data.message || "Login successful!");

      setTimeout(() => {
        router.push(data.user?.role === "SELLER" ? "/seller-dashboard" : "/explore-channels");
      }, 700);
    } catch (error: any) {


      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-900"
        >
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
          disabled={loading}
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            text-sm
            outline-none
            transition
            focus:border-slate-900
            focus:ring-2
            focus:ring-slate-900/10
            disabled:cursor-not-allowed
            disabled:bg-slate-50
          "
        />
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-900"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative mt-2">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              pr-12
              text-sm
              outline-none
              transition
              focus:border-slate-900
              focus:ring-2
              focus:ring-slate-900/10
              disabled:cursor-not-allowed
              disabled:bg-slate-50
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-slate-400
              transition
              hover:text-slate-900
            "
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div
          role="status"
          className="
            rounded-xl
            border
            border-green-200
            bg-green-50
            px-4
            py-3
            text-sm
            text-green-700
          "
        >
          {success}
        </div>
      )}

      {/* Login Button */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          rounded-xl
          bg-slate-950
          px-4
          py-3.5
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-slate-800
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-slate-400">
            OR
          </span>
        </div>
      </div>

      {/* Google */}
      <GoogleAuthButton />

      {/* Signup Link */}
      <p className="text-center text-sm text-slate-500">
        Don't have an account?{" "}

        <Link
          href="/signup"
          className="font-semibold text-slate-950 hover:underline"
        >
          Create account
        </Link>
      </p>
    </form>
  );
}


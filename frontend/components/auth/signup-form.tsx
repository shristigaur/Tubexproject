"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, X } from "lucide-react";

import { api } from "@/lib/api";
import { GoogleAuthButton } from "./google-auth-button";
import { auth } from "@/lib/firebase";
import { sendSignInLinkToEmail } from "firebase/auth";

export function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password validation rules
  const passwordRules = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passwordIsValid =
    passwordRules.minLength &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.number &&
    passwordRules.special;

  // Form submit
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Name validation
    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (!passwordIsValid) {
      setError("Please create a stronger password.");
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Terms validation
    if (!acceptTerms) {
      setError("Please accept the Terms and Conditions.");
      return;
    }

    try {
      setLoading(true);

      await api("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
          acceptTerms,
        }),
      });

      // Send Firebase Email Link
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const actionCodeSettings = {
        url: `${appUrl}/verify-email`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email.trim().toLowerCase(), actionCodeSettings);

      // Save email locally for Firebase to verify
      window.localStorage.setItem("emailForSignIn", email.trim().toLowerCase());

      setSuccess("Account created! Redirecting to email verification...");

      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}&sent=true`);
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-900"
        >
          Full name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your full name"
          autoComplete="name"
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
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-900"
        >
          Password
        </label>

        <div className="relative mt-2">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a strong password"
            autoComplete="new-password"
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
            onClick={() => setShowPassword((value) => !value)}
            disabled={loading}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-slate-400
              transition
              hover:text-slate-900
            "
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Password Rules */}
        {password.length > 0 && (
          <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-3">
            <PasswordRule
              valid={passwordRules.minLength}
              text="At least 8 characters"
            />

            <PasswordRule
              valid={passwordRules.uppercase}
              text="One uppercase letter"
            />

            <PasswordRule
              valid={passwordRules.lowercase}
              text="One lowercase letter"
            />

            <PasswordRule
              valid={passwordRules.number}
              text="One number"
            />

            <PasswordRule
              valid={passwordRules.special}
              text="One special character"
            />
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-slate-900"
        >
          Confirm password
        </label>

        <div className="relative mt-2">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Enter your password again"
            autoComplete="new-password"
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
            onClick={() =>
              setShowConfirmPassword((value) => !value)
            }
            disabled={loading}
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
              showConfirmPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {/* Password Match */}
        {confirmPassword.length > 0 && (
          <div className="mt-2">
            <PasswordRule
              valid={password === confirmPassword}
              text="Passwords match"
            />
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(event) => setAcceptTerms(event.target.checked)}
          disabled={loading}
          className="mt-1 h-4 w-4 rounded border-slate-300"
        />

        <span className="text-sm leading-6 text-slate-500">
          I agree to TubeX&apos;s{" "}
          <Link
            href="/terms"
            className="font-medium text-slate-900 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium text-slate-900 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {/* Error Message */}
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

      {/* Success Message */}
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

      {/* Create Account Button */}
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
        {loading ? "Creating account..." : "Create account"}
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

      {/* Google Button */}
      <GoogleAuthButton />

      {/* Login Link */}
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-slate-950 hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}

/* --------------------------------
   Password Rule Component
--------------------------------- */

function PasswordRule({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-xs ${
        valid ? "text-green-600" : "text-slate-400"
      }`}
    >
      {valid ? <Check size={14} /> : <X size={14} />}

      <span>{text}</span>
    </div>
  );
}

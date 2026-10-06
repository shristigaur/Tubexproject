"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  async function handleSendEmail(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await api("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setStep(2);
      setResendCooldown(60);
      setSuccess("");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      // NOTE: Based on the previous backend setup, the route is /verify-reset-otp
      await api("/api/auth/verify-reset-otp", {
        method: "POST",
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
      });
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await api("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp,
          newPassword,
        }),
      });
      
      setSuccess("Password updated successfully");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full">
      {/* Left Panel */}
      <div className="hidden relative flex-col justify-end bg-slate-900 lg:flex lg:w-[54%]">
        <Image
          src="/assets/new-reference.jpg"
          alt="Authentication Background"
          fill
          sizes="(max-width: 1024px) 100vw, 54vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 p-12 text-white">
          <h2 className="font-serif max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
            "Built for creators ready to sell, and buyers ready to grow."
          </h2>
          <div className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
            TUBEX
          </div>
          <p className="mt-2 text-lg text-white/70">
            A global marketplace for buying and selling YouTube channels.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white p-8 lg:p-12">
        <div className="w-full max-w-[480px]">
          <div className="mb-8">
            <Link href="/" className="mb-8 block text-3xl font-bold text-slate-900 lg:hidden">
              TubeX
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Reset Password
            </h1>
            <p className="mt-2 text-slate-500">
              {step === 1 && "Enter your email to receive a reset code."}
              {step === 2 && `We sent a 6-digit code to ${email}`}
              {step === 3 && "Create a new password for your account."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
            {step === 1 && (
              <form onSubmit={handleSendEmail} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={loading}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>
                
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-slate-900">
                    6-digit Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="123456"
                    disabled={loading}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm tracking-widest outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={() => handleSendEmail()}
                    className="text-sm font-medium text-slate-600 transition hover:text-slate-900 disabled:opacity-50"
                  >
                    {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-900">New Password</label>
                  <div className="relative mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-900"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900">Confirm Password</label>
                  <div className="relative mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Resetting..." : "Reset password"}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm font-semibold text-slate-950 hover:underline">
                Back to login
              </Link>
            </div>
          </div>
          
          <div className="mt-12 flex justify-center space-x-8 text-sm text-slate-500">
            <Link href="/terms" className="transition-colors hover:text-slate-900">Terms of Use</Link>
            <Link href="/privacy" className="transition-colors hover:text-slate-900">Privacy Policy</Link>
            <Link href="/cookies" className="transition-colors hover:text-slate-900">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

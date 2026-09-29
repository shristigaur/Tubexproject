"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailQuery = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState<"VERIFY_OTP" | "RESET_PASSWORD">("VERIFY_OTP");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!emailQuery) {
      router.push("/forgot-password");
    }
  }, [emailQuery, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  async function handleVerifyOTP(event: FormEvent) {
    event.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    try {
      setLoading(true);
      await api("/api/auth/verify-reset-otp", {
        method: "POST",
        body: JSON.stringify({ email: emailQuery, code }),
      });
      setStep("RESET_PASSWORD");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const code = otp.join("");
      const data = await api("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email: emailQuery, code, newPassword: password }),
      });

      setSuccess(data.message || "Password reset successful.");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  if (!emailQuery) return null;

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-slate-600">
        Resetting password for <span className="font-medium text-slate-900">{emailQuery}</span>
      </div>

      {step === "VERIFY_OTP" && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 text-center mb-4">
              Enter 6-digit code
            </label>
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  disabled={loading}
                  className="
                    w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold
                    rounded-xl border border-slate-200 bg-white
                    outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10
                    disabled:opacity-50 disabled:bg-slate-50
                  "
                />
              ))}
            </div>
          </div>

          {error && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="
              w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold
              text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={async () => {
                try {
                  setError("");
                  await api("/api/auth/forgot-password", {
                    method: "POST",
                    body: JSON.stringify({ email: emailQuery }),
                  });
                  setSuccess("Code resent successfully.");
                  setTimeout(() => setSuccess(""), 3000);
                } catch (err: any) {
                  setError(err.message || "Failed to resend code.");
                }
              }}
              disabled={loading}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline disabled:opacity-50"
            >
              Resend code
            </button>
          </div>
        </form>
      )}

      {step === "RESET_PASSWORD" && (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-900">New Password</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || !!success}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900">Confirm New Password</label>
            <div className="relative mt-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || !!success}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {success && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

          <button
            type="submit"
            disabled={loading || !!success || password.length < 8}
            className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}

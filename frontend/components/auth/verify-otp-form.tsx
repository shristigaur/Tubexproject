"use client";

import { FormEvent, useState, useEffect, useRef, KeyboardEvent, ChangeEvent, ClipboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

function maskEmail(email: string) {
  if (!email) return "";
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const [local, domain] = parts;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local.substring(0, 2)}***${local.substring(local.length - 1)}@${domain}`;
}

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const maskedEmail = maskEmail(email);

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (!email) {
      router.push("/signup");
    }
  }, [email, router]);

  useEffect(() => {
    // Auto-focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    
    // Support paste directly in one input if it's longer
    if (value.length > 1) {
       const pasted = value.slice(0, 6).split('');
       for(let i = 0; i < pasted.length; i++){
          if(index + i < 6) newOtp[index + i] = pasted[i];
       }
       setOtp(newOtp);
       const nextIndex = Math.min(index + pasted.length, 5);
       inputRefs.current[nextIndex]?.focus();
       return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // move forward
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;
    
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const isComplete = otp.every(val => val !== "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!isComplete) {
      setError("Please enter the 6-digit code.");
      return;
    }

    const otpString = otp.join("");

    try {
      setLoading(true);
      const data = await api("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp: otpString }),
      });

      setSuccess(data.message || "Verification successful!");
      setTimeout(() => {
        router.push(data.user?.role === "SELLER" ? "/seller-dashboard" : "/explore-channels");
      }, 700);
    } catch (err: any) {
      setError(err.message || "Failed to verify code.");
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      const data = await api("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSuccess(data.message || "Code resent successfully!");
      setCooldown(60);
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
      if (err.message?.includes("wait")) {
         setCooldown(60); // refresh cooldown if backend rate limited
      }
    } finally {
      setLoading(false);
    }
  }

  if (!email) return null;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-6 text-center">
        <p className="text-slate-600">
          We've sent a 6-digit verification code to:<br/>
          <strong className="text-slate-900 mt-1 inline-block">{maskedEmail}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              disabled={loading}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border border-slate-200 bg-white outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50 disabled:bg-slate-50"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        {success && (
          <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 text-center">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isComplete}
          className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center pt-2 flex flex-col space-y-4">
          <div>
            <p className="text-sm text-slate-500 mb-2">Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={loading || cooldown > 0}
              className={`text-sm font-medium ${cooldown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-slate-900 hover:underline'}`}
            >
              {cooldown > 0 ? `Resend available in ${cooldown}s` : "Send OTP"}
            </button>
          </div>
          
          <Link 
            href="/login" 
            className="text-sm text-slate-500 hover:text-slate-900 hover:underline transition-colors"
          >
            Change email / Back
          </Link>
        </div>
      </form>
    </div>
  );
}

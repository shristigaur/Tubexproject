"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { isSignInWithEmailLink, signInWithEmailLink, sendSignInLinkToEmail } from "firebase/auth";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const sentParam = searchParams.get("sent");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    async function verifyLink() {
      // If they just got redirected here after signup, wait for them to click the link in email
      if (sentParam === "true" && !isSignInWithEmailLink(auth, window.location.href)) {
        setLoading(false);
        setSuccess("Check your email! Your TubeX sign-in link has been sent. Open the email and click the secure link to continue.");
        return;
      }

      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");
        if (!email) {
          // If opened on a different device, we'd normally prompt for email.
          // For simplicity, we can use the email param if it was passed, or ask them.
          email = window.prompt("Please provide your email for confirmation");
        }
        
        if (!email) {
          setError("Email is required to complete sign-in.");
          setLoading(false);
          return;
        }

        try {
          // Authenticate with Firebase
          const result = await signInWithEmailLink(auth, email, window.location.href);
          
          window.localStorage.removeItem("emailForSignIn");
          
          // Get the ID token
          const idToken = await result.user.getIdToken();
          
          // Send to backend
          const data = await api("/api/auth/firebase-login", {
            method: "POST",
            body: JSON.stringify({ idToken }),
          });

          setSuccess("Email verified successfully! Redirecting...");

          setTimeout(() => {
            router.push(data.user?.role === "SELLER" ? "/seller-dashboard" : "/explore-channels");
          }, 700);
        } catch (err: any) {
          setError(err.message || "Your sign-in link is invalid or has expired. Please request a new link.");
        } finally {
          setLoading(false);
        }
      } else {
        // Not a sign in link and not sent param
        setLoading(false);
        if (emailParam) {
           setSuccess("Please click the link sent to your email to verify your account.");
        } else {
           setError("Invalid access. No email link detected.");
        }
      }
    }

    verifyLink();
  }, [router, sentParam, emailParam]);


  async function handleResend() {
    if (cooldown > 0) return;
    
    setError("");
    setSuccess("");

    const emailToUse = emailParam || window.localStorage.getItem("emailForSignIn");
    if (!emailToUse) {
      setError("Email is missing. Please try signing up again.");
      return;
    }

    try {
      setResendLoading(true);
      
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const actionCodeSettings = {
        url: `${appUrl}/verify-email`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, emailToUse, actionCodeSettings);

      setSuccess("A new secure link has been sent to your email.");
      setCooldown(60);
    } catch (err: any) {
      setError("Failed to resend secure link. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      
      {loading ? (
        <div className="text-center text-slate-500 py-4">Verifying your secure link...</div>
      ) : (
        <>
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

          <div className="text-center text-sm mt-6">
            <span className="text-slate-500">Didn't receive the link? </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resendLoading}
              className="font-semibold text-slate-950 hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {resendLoading ? "Sending..." : cooldown > 0 ? `Resend link in ${cooldown}s` : "Resend magic link"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

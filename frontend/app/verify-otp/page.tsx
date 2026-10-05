import { VerifyOtpForm } from "@/components/auth/verify-otp-form";
import Link from "next/link";
import { Suspense } from "react";

export default function VerifyOtpPage() {
  return (
    <main className="min-h-screen flex w-full">
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 bg-white">
        <div className="w-full max-w-[480px]">
          <div className="mb-8 text-center">
            <Link href="/" className="text-3xl font-bold text-slate-900 mb-8 block">
              TubeX
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Verify your email
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
              <VerifyOtpForm />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}

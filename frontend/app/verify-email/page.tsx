import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export default function VerifyEmailPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="text-3xl font-bold">
                        TubeX
                    </div>

                    <h1 className="mt-6 text-3xl font-bold tracking-tight">
                        Secure Sign In
                    </h1>

                    <p className="mt-2 text-slate-500">
                        We use secure passwordless email links for verification.
                    </p>
                </div>

                <div className="rounded-3xl border bg-white p-6 shadow-sm">
                    <Suspense fallback={<div className="text-center">Loading...</div>}>
                        <VerifyEmailForm />
                    </Suspense>
                </div>

            </div>
        </main>
    );
}

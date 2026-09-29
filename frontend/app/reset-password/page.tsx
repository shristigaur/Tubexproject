import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="text-3xl font-bold">
                        TubeX
                    </div>

                    <h1 className="mt-6 text-3xl font-bold tracking-tight">
                        Create new password
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Enter the code sent to your email and your new password.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <Suspense fallback={<div className="text-center py-4 text-sm text-slate-500">Loading...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>

            </div>
        </main>
    );
}

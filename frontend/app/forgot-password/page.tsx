import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="text-3xl font-bold">
                        TubeX
                    </div>

                    <h1 className="mt-6 text-3xl font-bold tracking-tight">
                        Reset your password
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Enter your email address and we'll send you a verification code.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <ForgotPasswordForm />
                </div>

            </div>
        </main>
    );
}

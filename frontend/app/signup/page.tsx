import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="text-3xl font-bold">
                        TubeX
                    </div>

                    <h1 className="mt-6 text-3xl font-bold tracking-tight">
                        Create your TubeX account
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Buy and sell YouTube channels securely.
                    </p>
                </div>

                <div className="rounded-3xl border bg-white p-6 shadow-sm">
                    <SignupForm />
                </div>

            </div>
        </main>
    );
}
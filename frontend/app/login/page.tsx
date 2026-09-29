import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">

            <div className="w-full max-w-md">

                <div className="text-center mb-8">

                    <div className="text-3xl font-bold">
                        TubeX
                    </div>

                    <h1 className="mt-6 text-3xl font-bold">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Sign in to continue to TubeX.
                    </p>

                </div>

                <div className="rounded-3xl border bg-white p-6 shadow-sm">
                    <LoginForm />
                </div>

            </div>

        </main>
    );
}
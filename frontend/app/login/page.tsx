import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex w-full">
            {/* Left Panel - Image */}
            <div className="hidden lg:flex lg:w-[54%] relative flex-col justify-end bg-slate-900">
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
                    <h2 className="text-4xl md:text-5xl font-semibold leading-tight max-w-xl font-serif">
                        "Built for creators ready to sell, and buyers ready to grow."
                    </h2>
                    <div className="mt-8 uppercase tracking-[0.2em] text-sm font-semibold text-white/90">
                        TUBEX
                    </div>
                    <p className="mt-2 text-lg text-white/70">
                        A global marketplace for buying and selling YouTube channels.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 bg-white">
                <div className="w-full max-w-[480px]">
                    <div className="mb-8">
                        <Link href="/" className="text-3xl font-bold text-slate-900 mb-8 block lg:hidden">
                            TubeX
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Sign in to continue to TubeX.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <LoginForm />
                    </div>

                    {/* Footer Links */}
                    <div className="mt-12 flex justify-center space-x-8 text-sm text-slate-500">
                        <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Use</Link>
                        <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
                        <Link href="/cookies" className="hover:text-slate-900 transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
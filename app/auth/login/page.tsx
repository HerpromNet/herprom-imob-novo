"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "@/lib/authService";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Building2, Mail, Lock, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResetSuccess, setShowResetSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("reset") === "true") {
            setShowResetSuccess(true);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setShowResetSuccess(false);

        const { user, error } = await signIn({ email, password });

        if (error) {
            setError(error.message || "E-mail ou senha incorretos.");
            setIsLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center mb-8">
                <div className="p-3 bg-primary/20 rounded-xl mb-4">
                    <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">CRM FOR BROKER</h1>
                <p className="text-gray-400 text-sm mt-1">Acesse sua central de inteligência.</p>
            </div>

            <AnimatePresence>
                {showResetSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-xs font-bold"
                    >
                        <CheckCircle2 size={16} />
                        E-mail de recuperação enviado com sucesso!
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 ml-1">E-mail</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-sm font-medium text-gray-300">Senha</label>
                        <Link 
                            href="/auth/forgot-password" 
                            className="text-[10px] font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-wider"
                        >
                            Esqueci minha senha
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        />
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-2 px-3 rounded-lg text-center font-medium"
                    >
                        {error}
                    </motion.div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            Entrar no CRM
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-white/5 space-y-4">
                <p className="text-sm text-gray-400">
                    Ainda não tem conta?{" "}
                    <Link href="/auth/signup" className="text-primary font-bold hover:underline">
                        Criar conta
                    </Link>
                </p>
                <p className="text-[10px] text-gray-500 max-w-xs mx-auto">
                    Ao continuar, você concorda com nossos{" "}
                    <Link href="/legal/terms" className="hover:text-white underline underline-offset-2 transition-colors">Termos de Uso</Link> 
                    {" "}e{" "}
                    <Link href="/legal/privacy" className="hover:text-white underline underline-offset-2 transition-colors">Política de Privacidade</Link>.
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-md px-4"
            >
                <Suspense fallback={
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                }>
                    <LoginForm />
                </Suspense>
            </motion.div>
        </div>
    );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { signUp } from "@/lib/authService";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Building2, Mail, Lock, User, BadgeCheck, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function SignupForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [creci, setCreci] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [referredBy, setReferredBy] = useState<string | null>(null);

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            setReferredBy(ref);
            console.log('🔗 [Signup] Código de indicação detectado:', ref);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { user, error } = await signUp({ 
            email, 
            password, 
            name, 
            creci, 
            referredBy: referredBy || undefined 
        });

        if (error) {
            setError(error.message || "Ocorreu um erro ao criar sua conta.");
            setIsLoading(false);
        } else if (user?.needsConfirmation) {
            setIsSuccess(true);
            setIsLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 w-full max-w-md px-4"
            >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {isSuccess ? (
                        <div className="flex flex-col items-center text-center py-4">
                            <div className="p-4 bg-green-500/20 rounded-full mb-6">
                                <Mail className="h-12 w-12 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">QUASE LÁ!</h1>
                            <p className="text-gray-400 text-sm mb-8">
                                Enviamos um link de confirmação para <span className="text-white font-medium">{email}</span>.
                                Por favor, verifique sua caixa de entrada para ativar sua conta.
                            </p>
                            <Link
                                href="/auth/login"
                                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary/25 text-center"
                            >
                                Ir para Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-center mb-6">
                                <div className="p-3 bg-primary/20 rounded-xl mb-4">
                                    <Building2 className="h-8 w-8 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">CRIAR CONTA</h1>
                                <p className="text-gray-400 text-sm mt-1 text-center">Junte-se à elite da corretagem imobiliária.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Nome Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Ex: Herprom"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                        />
                                    </div>
                                </div>

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

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">CRECI (Opcional)</label>
                                        <div className="relative">
                                            <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <input
                                                type="text"
                                                value={creci}
                                                onChange={(e) => setCreci(e.target.value)}
                                                placeholder="00.000-F"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Senha</label>
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
                                            Começar Jornada
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center pt-6 border-t border-white/5">
                                <p className="text-sm text-gray-400">
                                    Já tem uma conta?{" "}
                                    <Link href="/auth/login" className="text-primary font-bold hover:underline">
                                        Faça login
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <SignupForm />
        </Suspense>
    );
}

"use client";

import { useState } from "react";
import { resetPassword } from "@/lib/authService";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldQuestion } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error: resetError } = await resetPassword(email);

        if (resetError) {
            setError(resetError.message);
            setIsLoading(false);
        } else {
            setIsSuccess(true);
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
                            <ShieldQuestion className="text-primary h-8 w-8" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Recuperar Acesso</h1>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Insira seu e-mail abaixo. Se você tiver uma conta, enviaremos as instruções para redefinir sua senha.
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.form 
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit} 
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">E-mail Cadastrado</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                        <input 
                                            type="email" 
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="exemplo@herprom.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }} 
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            ENVIAR INSTRUÇÕES
                                            <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6 py-4"
                            >
                                <div className="flex justify-center">
                                    <div className="h-20 w-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                                        <CheckCircle2 className="text-emerald-500 h-10 w-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">E-mail Enviado!</h2>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        As instruções foram enviadas para <span className="text-white font-bold">{email}</span>. Verifique sua caixa de entrada e spam.
                                    </p>
                                </div>
                                <Link 
                                    href="/auth/login"
                                    className="block w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all border border-white/10"
                                >
                                    VOLTAR PARA O LOGIN
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isSuccess && (
                        <div className="mt-8 text-center">
                            <Link 
                                href="/auth/login" 
                                className="text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2 group"
                            >
                                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                                VOLTAR PARA O LOGIN
                            </Link>
                        </div>
                    )}
                </div>

                <p className="text-center mt-8 text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
                    Herprom Broker &copy; 2026 • CRM de Elite
                </p>
            </motion.div>
        </main>
    );
}

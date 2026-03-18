"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Bot, Target, Zap } from "lucide-react";
import Link from "next/link";

export default function WelcomeModal({ userName }: { userName: string }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Delay the check slightly for a better visual effect when the dashboard loads
        const timer = setTimeout(() => {
            const hasSeenWelcome = localStorage.getItem("has_seen_welcome_v1");
            if (!hasSeenWelcome) {
                setIsOpen(true);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("has_seen_welcome_v1", "true");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative pointer-events-auto"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

                            <div className="p-8 md:p-10 relative z-10">
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                                        <div className="h-20 w-20 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center relative shadow-lg shadow-primary/30 border border-white/20">
                                            <Bot className="text-white h-10 w-10" />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                                        Bem-vindo(a), {userName}! 👋
                                    </h2>
                                    <p className="text-gray-400 text-lg">
                                        Eu sou a Sofia AI, e estou aqui para ser sua Parceira de Negócios no CRM FOR BROKER.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-4">
                                        <div className="p-2 bg-blue-500/20 rounded-lg shrink-0">
                                            <Target className="text-blue-400 h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-sm mb-1">Qualifique Leads</h3>
                                            <p className="text-gray-400 text-xs">Vou te ajudar a criar respostas persuasivas.</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-4">
                                        <div className="p-2 bg-yellow-500/20 rounded-lg shrink-0">
                                            <Zap className="text-yellow-400 h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-sm mb-1">Crie Descrições</h3>
                                            <p className="text-gray-400 text-xs">Anúncios irresistíveis em segundos.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 items-center justify-center pt-4 border-t border-white/10">
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-white transition-colors text-sm font-semibold py-3 px-6"
                                    >
                                        Explorar Dashboard
                                    </button>
                                    <Link 
                                        href="/dashboard/ai"
                                        onClick={handleClose}
                                        className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center gap-2 group w-full md:w-auto justify-center"
                                    >
                                        <Sparkles size={18} />
                                        Falar com a Sofia agora
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

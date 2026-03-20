"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authService";
import { 
    Settings, 
    User, 
    Key, 
    Shield, 
    Bell, 
    Save, 
    Loader2,
    Eye,
    EyeOff,
    CheckCircle2,
    Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
    const { profile, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [geminiKey, setGeminiKey] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedKey = localStorage.getItem('herprom_gemini_key') || "";
            setGeminiKey(savedKey);
        }
    }, []);

    const handleSaveGeminiKey = () => {
        setIsLoading(true);
        localStorage.setItem('herprom_gemini_key', geminiKey);
        setSuccessMsg("Configurações salvas com sucesso!");
        setTimeout(() => {
            setSuccessMsg("");
            setIsLoading(false);
        }, 2000);
    };

    const clearGeminiKey = () => {
        setGeminiKey("");
        localStorage.removeItem('herprom_gemini_key');
    };

    return (
        <DashboardShell>
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <Settings className="text-primary" /> CONFIGURAÇÕES
                    </h1>
                    <p className="text-gray-400 mt-1">Personalize sua experiência e gerencie sua segurança.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <button className="w-full flex items-center gap-3 p-4 glass rounded-xl text-primary font-bold border-primary/20">
                            <User size={20} /> Perfil do Usuário
                        </button>
                        <button className="w-full flex items-center gap-3 p-4 glass glass-hover rounded-xl text-gray-400 font-medium border-transparent">
                            <Key size={20} /> Chaves de API
                        </button>
                        <button className="w-full flex items-center gap-3 p-4 glass glass-hover rounded-xl text-gray-400 font-medium border-transparent">
                            <Shield size={20} /> Segurança
                        </button>
                        <button className="w-full flex items-center gap-3 p-4 glass glass-hover rounded-xl text-gray-400 font-medium border-transparent">
                            <Bell size={20} /> Notificações
                        </button>
                    </div>

                    <div className="md:col-span-2 space-y-8">
                        <section className="glass p-8 rounded-2xl space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <User className="text-primary" size={20} /> INFORMAÇÕES PESSOAIS
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nome Completo</label>
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={profile?.name || ""} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 outline-none cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">E-mail de Acesso</label>
                                    <input 
                                        type="email" 
                                        readOnly 
                                        value={user?.email || ""} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 outline-none cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">CRECI</label>
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={profile?.creci || "Não informado"} 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 outline-none cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Plano Atual</label>
                                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-primary text-sm font-bold uppercase tracking-widest text-center">
                                        {profile?.plan || "Teste Gratuito"}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="glass p-8 rounded-2xl border-primary/20 bg-primary/5 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Key className="text-primary" size={20} /> MOTOR DE IA (GOOGLE GEMINI)
                                </h3>
                                <div className="p-1 px-3 bg-primary text-white text-[10px] font-bold rounded-full uppercase">VIP Pro</div>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Por padrão, o Herprom Broker usa uma chave global. Se você deseja usar sua própria chave do **Google AI Studio** para maior velocidade e limites, cole-a abaixo.
                            </p>
                            
                            <div className="space-y-4">
                                <div className="relative">
                                    <input 
                                        type={showApiKey ? "text" : "password"}
                                        placeholder="Cole sua API Key aqui (AIza...)"
                                        value={geminiKey}
                                        onChange={(e) => setGeminiKey(e.target.value)}
                                        className="w-full bg-[#020617] border border-white/10 rounded-xl py-4 pl-12 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                    />
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button 
                                            onClick={() => setShowApiKey(!showApiKey)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all"
                                        >
                                            {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                        <button 
                                            onClick={clearGeminiKey}
                                            className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <p className="text-[11px] text-gray-500 italic">
                                        A chave é armazenada apenas no seu navegador, com total segurança.
                                    </p>
                                    <button 
                                        onClick={handleSaveGeminiKey}
                                        disabled={isLoading}
                                        className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />}
                                        Salvar Ajustes
                                    </button>
                                </div>
                            </div>
                        </section>

                        <AnimatePresence>
                            {successMsg && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    className="bg-emerald-500/20 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3 text-emerald-400 font-bold justify-center"
                                >
                                    <CheckCircle2 size={24} />
                                    {successMsg}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

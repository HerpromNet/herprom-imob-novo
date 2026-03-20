"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/authService";
import { PlanType } from "@/lib/types";
import { 
    CreditCard, 
    CheckCircle2, 
    Sparkles, 
    ShieldCheck, 
    Infinity as InfinityIcon, 
    Target,
    Zap,
    Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function SubscriptionPage() {
    const { profile } = useAuth();
    
    // Check if user is already PRO or ADMIN
    const isPro = profile?.plan === PlanType.PRO || profile?.plan === PlanType.MASTER_ADMIN;
    const isTrial = profile?.plan === PlanType.TRIAL;
    
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        if (!profile?.id || !profile?.email) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('create-checkout', {
                body: {
                    user_id: profile.id,
                    email: profile.email,
                    title: 'Elite Broker PRO - Asisnatura',
                    price: 97.00
                }
            });

            if (error) throw error;
            if (data?.init_point) {
                // Redireciona para o checkout gerado pelo MP para esse lead!
                window.location.href = data.init_point;
            } else {
                throw new Error("Link não gerado pela API");
            }
        } catch (err: any) {
            console.error("Erro ao gerar checkout:", err);
            alert("Erro ao iniciar pagamento. Verifique se o backend está configurado.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardShell>
            <div className="max-w-5xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <CreditCard className="text-primary" /> MINHA ASSINATURA
                    </h1>
                    <p className="text-gray-400 mt-1">Gerencie seu plano e desbloqueie o poder total do CRM For Broker.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Current Status Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] -z-10 ${isPro ? 'bg-emerald-500/20' : 'bg-primary/20'}`} />
                            
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Status Atual</h2>
                            
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 rounded-xl ${isPro ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary/20 text-primary'}`}>
                                    {isPro ? <ShieldCheck size={28} /> : <Zap size={28} />}
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-white">
                                        {profile?.plan === PlanType.MASTER_ADMIN ? "Master Admin" : (isPro ? "Plano PRO" : "Plano Trial")}
                                    </p>
                                    <p className={`text-sm font-semibold ${isPro ? 'text-emerald-400' : 'text-primary'}`}>
                                        {isPro ? "Ativo e Desbloqueado" : "7 Dias de Teste"}
                                    </p>
                                </div>
                            </div>

                            {isTrial && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <p className="text-sm text-gray-300 mb-4">Sua avaliação gratuita é limitada. Faça o upgrade para não perder oportunidades.</p>
                                    <div className="w-full bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
                                        <div className="bg-primary h-2 rounded-full w-[40%]" />
                                    </div>
                                    <p className="text-xs text-gray-400 text-center font-medium">Restam cerca de 4 dias</p>
                                </div>
                            )}

                            {isPro && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <p className="text-sm text-emerald-400 font-medium flex items-center gap-2">
                                        <CheckCircle2 size={16} /> Faturamento em dia.
                                    </p>
                                </div>
                            )}
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass p-6 rounded-3xl border border-white/10 text-center"
                        >
                            <ShieldCheck className="mx-auto text-gray-500 mb-3 h-8 w-8" />
                            <h3 className="font-bold text-white mb-2">Pagamento Seguro</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Seus pagamentos são processados com segurança máxima pelo Mercado Pago. Não armazenamos os dados do seu cartão.
                            </p>
                        </motion.div>
                    </div>

                    {/* Pricing / Upgrade Card */}
                    <div className="lg:col-span-2">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-[#0f172a] to-[#1e1a3b] p-8 md:p-10 rounded-3xl border border-primary/30 shadow-2xl overflow-hidden relative"
                        >
                            {/* Decorative Background for PRO Card */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                            
                            <div className="flex flex-col md:flex-row gap-8 justify-between relative z-10">
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                                        <Sparkles size={14} /> Oferta Fundadores
                                    </div>
                                    
                                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                                        Elite Broker PRO
                                    </h2>
                                    
                                    <p className="text-gray-400 mb-8 max-w-sm">
                                        Tudo que você precisa para dominar seu mercado e multiplicar suas comissões.
                                    </p>

                                    <ul className="space-y-4 mb-8">
                                        {[
                                            "Leads e Imóveis Ilimitados",
                                            "Acesso total à Inteligência Artificial (Sofia AI)",
                                            "Sistema de Indicação e Afiliados (+ Ganhos)",
                                            "Suporte Prioritário VIP",
                                            "Sem taxas ou comissões sobre vendas"
                                        ].map((benefit, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle2 className="text-primary h-5 w-5 shrink-0 mt-0.5" />
                                                <span className="text-gray-300 font-medium">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="w-full md:w-72 glass !bg-black/40 p-6 rounded-2xl border border-white/10 flex flex-col justify-center text-center">
                                    {isPro ? (
                                        <div className="flex flex-col items-center justify-center space-y-4 py-8">
                                            <div className="h-16 w-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="text-emerald-400 h-8 w-8" />
                                            </div>
                                            <p className="text-lg font-bold text-white">Você já é PRO!</p>
                                            <p className="text-sm text-gray-400">Aproveite ao máximo todos os recursos.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-2">
                                                <span className="text-gray-400 line-through text-sm font-semibold">De R$ 147</span>
                                            </div>
                                            <div className="flex items-baseline justify-center gap-1 mb-6">
                                                <span className="text-2xl font-bold text-gray-300">R$</span>
                                                <span className="text-5xl font-black text-white">97</span>
                                                <span className="text-gray-400 font-medium">/mês</span>
                                            </div>
                                            
                                            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-6">
                                                Garantido por 12 meses
                                            </p>

                                            <button 
                                                onClick={handleCheckout}
                                                disabled={isLoading}
                                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/25 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-75 disabled:hover:scale-100"
                                            >
                                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Target size={18} />}
                                                {isLoading ? "Gerando Pagamento Seguro..." : "Fazer Upgrade Agora"}
                                            </button>
                                            <p className="text-[10px] text-gray-500 mt-4">
                                                Cancele quando quiser.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

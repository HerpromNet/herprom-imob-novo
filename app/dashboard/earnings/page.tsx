"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
    TrendingUp, 
    DollarSign, 
    Users, 
    ArrowUpRight, 
    ArrowDownRight, 
    Wallet,
    Loader2,
    Calendar,
    ExternalLink,
    Copy,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
    id: string;
    type: 'comissao' | 'saque';
    amount: number;
    status: string;
    created_at: string;
    description: string;
}

export default function EarningsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const initData = async () => {
            setIsLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUserId(user.id);
                    // Aqui buscaríamos as transações reais na tabela 'commissions' ou 'financial'
                    const { data, error } = await supabase
                        .from('commissions')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });

                    if (!error && data) setTransactions(data);
                }
            } catch (err) {
                console.error("Error fetching financial data:", err);
            } finally {
                // Fallback fictício Premium
                if (transactions.length === 0) {
                    setTransactions([
                        { id: '1', type: 'comissao', amount: 1500.00, status: 'Pago', created_at: new Date().toISOString(), description: 'Comissão Venda: Cobertura Itaim' },
                        { id: '2', type: 'comissao', amount: 450.00, status: 'Pendente', created_at: new Date().toISOString(), description: 'Indicação: Pedro Santos' },
                        { id: '3', type: 'saque', amount: -1000.00, status: 'Concluído', created_at: new Date().toISOString(), description: 'Resgate para conta principal' },
                    ]);
                }
                setIsLoading(false);
            }
        };

        initData();
    }, []);

    const copyRefLink = () => {
        const link = `https://herprom-imob-novo.vercel.app/auth/signup?ref=${userId}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <DashboardShell>
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                            <TrendingUp className="text-primary" /> CENTRAL DE GANHOS
                        </h1>
                        <p className="text-gray-400 mt-1">Acompanhe seu sucesso financeiro e gerencie suas comissões.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/10">
                        <Wallet size={20} /> Solicitar Saque
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full translate-x-8 -translate-y-8 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Saldo Disponível</h3>
                        <p className="text-3xl font-black text-white">R$ 1.950,00</p>
                        <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1 uppercase">
                            <ArrowUpRight size={12} /> +12% em relação ao mês anterior
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full translate-x-8 -translate-y-8 blur-2xl" />
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Comissões Pendentes</h3>
                        <p className="text-3xl font-black text-white">R$ 450,00</p>
                        <p className="text-[10px] text-gray-500 font-bold mt-2 uppercase">Aguardando confirmação de pagamento</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-2xl bg-primary/5 border-primary/20">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Total Lançado (2026)</h3>
                        <p className="text-3xl font-black text-white">R$ 12.800,00</p>
                        <div className="mt-3 flex gap-1">
                            <div className="h-1 flex-1 bg-primary rounded-full" />
                            <div className="h-1 flex-1 bg-primary/30 rounded-full" />
                            <div className="h-1 flex-1 bg-primary/30 rounded-full" />
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass rounded-2xl overflow-hidden border border-white/5">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <h3 className="font-bold text-lg">Histórico Financeiro</h3>
                                <button className="text-xs font-bold text-primary hover:underline">Ver tudo</button>
                            </div>
                            <div className="divide-y divide-white/5">
                                {isLoading ? (
                                    <div className="p-12 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                                        <p className="text-sm text-gray-500 uppercase tracking-widest">Carregando transações...</p>
                                    </div>
                                ) : (
                                    transactions.map((t, i) => (
                                        <div key={t.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center border border-white/10 ${t.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {t.amount > 0 ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-primary transition-colors">{t.description}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] text-gray-500 flex items-center gap-1 uppercase font-bold tracking-tighter">
                                                            <Calendar size={10} /> {new Date(t.created_at).toLocaleDateString()}
                                                        </span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${t.status === 'Pago' || t.status === 'Concluído' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                            {t.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className={`text-lg font-black ${t.amount > 0 ? 'text-white' : 'text-gray-400'}`}>
                                                {t.amount > 0 ? '+' : ''} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass p-8 rounded-2xl bg-gradient-to-br from-primary to-purple-800 border-none shadow-2xl shadow-primary/20 relative overflow-hidden group">
                           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                           <div className="relative z-10">
                                <Users className="text-white/40 mb-4" size={32} />
                                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Programa de Afiliados Elite</h3>
                                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                                    Convide outros corretores para o Herprom e ganhe **10% de comissão** em cada mensalidade paga por eles. Para sempre!
                                </p>
                                <div className="space-y-4">
                                    <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10">
                                        <p className="text-[10px] font-bold text-white/50 uppercase mb-2">Seu link de indicação</p>
                                        <div className="flex items-center justify-between gap-2 overflow-hidden">
                                            <p className="text-[11px] font-mono text-white truncate max-w-xs">
                                                herprom.com/signup?ref={userId?.substring(0, 8)}...
                                            </p>
                                            <button 
                                                onClick={copyRefLink}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-all text-white shrink-0"
                                                title="Copiar link"
                                            >
                                                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <button className="w-full bg-white text-primary font-black py-4 rounded-xl text-sm shadow-xl group-hover:scale-[1.02] transition-transform">
                                        VER MINHAS INDICAÇÕES
                                    </button>
                                </div>
                           </div>
                        </div>

                        <div className="glass p-6 rounded-2xl border-white/10 bg-white/5">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Meta de Vendas de Março</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span>R$ 15.000 / R$ 30.000</span>
                                    <span className="text-primary">50%</span>
                                </div>
                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: "50%" }} 
                                        className="h-full bg-gradient-to-r from-primary to-purple-500" 
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 font-medium italic text-center">
                                    Faltam R$ 15.000 para desbloquear o bônus Sofia Pro de 5%!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

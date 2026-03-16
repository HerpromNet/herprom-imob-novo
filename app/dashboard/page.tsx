"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import { useAuth } from "@/lib/authService";
import { 
    Users, 
    Home, 
    TrendingUp, 
    Sparkles, 
    ArrowUpRight,
    Plus,
    Calendar,
    MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
    { label: "Leads Ativos", value: "12", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Meus Imóveis", value: "08", icon: Home, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Saldo de Comissões", value: "R$ 0,00", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
];

export default function DashboardPage() {
    const { profile } = useAuth();

    return (
        <DashboardShell>
            <div className="space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            BOAS-VINDAS, <span className="text-primary uppercase">{profile?.name || "CORRETOR"}</span>
                        </h1>
                        <p className="text-gray-400 mt-1 flex items-center gap-2">
                           <Calendar size={14} /> Sua jornada rumo à elite imobiliária começa aqui.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3"
                    >
                        <button className="flex items-center gap-2 px-5 py-2.5 glass glass-hover rounded-xl text-sm font-semibold transition-all group">
                            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                            Novo Imóvel
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/25">
                            <Sparkles size={18} />
                            Falar com Sofia AI
                        </button>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass p-6 rounded-2xl group cursor-pointer relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} rounded-bl-full translate-x-8 -translate-y-8 blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                            <div className="flex items-start justify-between">
                                <div className={`p-3 rounded-xl ${item.bg}`}>
                                    <item.icon className={item.color} size={24} />
                                </div>
                                <ArrowUpRight className="text-gray-600 group-hover:text-primary transition-colors" size={20} />
                            </div>
                            <div className="mt-4">
                                <h2 className="text-3xl font-bold text-white mb-1">{item.value}</h2>
                                <p className="text-gray-400 text-sm font-medium">{item.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass p-8 rounded-2xl flex flex-col items-center text-center space-y-4"
                    >
                        <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                            <MessageSquare className="text-primary h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold">SOFIA AI: SUA ASSISTENTE 24/7</h3>
                        <p className="text-gray-400 text-sm max-w-sm">
                            Gere descrições irresistíveis, qualifique seus leads ou simplesmente tire dúvidas sobre o mercado imobiliário.
                        </p>
                        <button className="text-primary font-bold hover:underline underline-offset-4 flex items-center gap-2 mt-2">
                            Acessar Inteligência Artificial <ArrowUpRight size={16} />
                        </button>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass p-8 rounded-2xl overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent pointer-events-none" />
                        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
                           <TrendingUp size={18} className="text-purple-500" /> Atividade Recente
                        </h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 opacity-50 grayscale">
                                    <div className="h-2 w-2 bg-gray-600 rounded-full" />
                                    <div className="flex-1">
                                        <div className="h-2 w-24 bg-gray-700 rounded-full mb-2" />
                                        <div className="h-2 w-48 bg-gray-800 rounded-full" />
                                    </div>
                                </div>
                            ))}
                            <p className="text-center text-gray-500 text-sm py-4 italic">
                                Seus registros aparecerão aqui quando você começar.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardShell>
    );
}

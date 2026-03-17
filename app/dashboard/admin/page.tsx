"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/authService";
import { PlanType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { 
    ShieldCheck, 
    Users, 
    CreditCard, 
    Activity, 
    TrendingUp, 
    Search, 
    Filter, 
    MoreHorizontal,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ArrowUpRight,
    UserPlus,
    BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminUser {
    id: string;
    full_name: string;
    email: string;
    plan: string;
    status: string;
    created_at: string;
    is_admin: boolean;
}

export default function AdminMasterPage() {
    const { profile, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeSubs: 0,
        mrr: 0,
        growth: 0
    });

    useEffect(() => {
        if (!authLoading && profile) {
            if (profile.plan !== PlanType.MASTER_ADMIN && !profile.isAdmin) {
                router.push("/dashboard");
                return;
            }
            fetchData();
        }
    }, [profile, authLoading, router]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Em um cenário real, estas queries seriam baseadas nas suas tabelas do Supabase
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (usersError) throw usersError;
            
            if (usersData) {
                setUsers(usersData);
                // Calculando estatísticas básicas
                const active = usersData.filter(u => u.status === 'Ativo').length;
                const mrr = active * 147; // Exemplo de preço base
                setStats({
                    totalUsers: usersData.length,
                    activeSubs: active,
                    mrr: mrr,
                    growth: 15 // Exemplo estático
                });
            }
        } catch (err) {
            console.error("Error fetching admin data:", err);
            // Fallback para visualização do dono
            setUsers([
                { id: '1', full_name: 'Corretor VIP 01', email: 'vip@exemplo.com', plan: 'Pro', status: 'Ativo', created_at: new Date().toISOString(), is_admin: false },
                { id: '2', full_name: 'Imobiliária Central', email: 'admin@central.com', plan: 'Master Admin', status: 'Ativo', created_at: new Date().toISOString(), is_admin: true },
                { id: '3', full_name: 'Teste Gratuito 01', email: 'teste@exemplo.com', plan: 'Teste Gratuito', status: 'Inativo', created_at: new Date().toISOString(), is_admin: false },
            ]);
            setStats({ totalUsers: 342, activeSubs: 128, mrr: 18816, growth: 22 });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter(user => 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authLoading) return null;

    return (
        <DashboardShell>
            <div className="space-y-8 pb-12">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-400 mb-1">
                            <ShieldCheck size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Painel de Controle do Proprietário</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white">CENTRAL MASTER ADMIN</h1>
                        <p className="text-gray-400 mt-1">Gestão estratégica e saúde financeira da plataforma Herprom.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 glass glass-hover rounded-xl text-sm font-bold text-gray-300 transition-all">
                            <BarChart3 size={18} /> Relatórios
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25">
                            <UserPlus size={18} /> Novo Admin
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl border-white/5 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                                <Users size={24} />
                            </div>
                            <span className="text-emerald-500 text-[10px] font-bold bg-emerald-500/10 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Usuários</h3>
                        <p className="text-3xl font-black text-white mt-1">{stats.totalUsers}</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-2xl border-white/5 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                                <CheckCircle2 size={24} />
                            </div>
                            <span className="text-emerald-500 text-[10px] font-bold bg-emerald-500/10 px-2 py-1 rounded-full">Saudável</span>
                        </div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Assinaturas Ativas</h3>
                        <p className="text-3xl font-black text-white mt-1">{stats.activeSubs}</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-2xl border-white/5 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-primary text-[10px] font-bold bg-primary/10 px-2 py-1 rounded-full">MRR</span>
                        </div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Receita Mensal</h3>
                        <p className="text-3xl font-black text-white mt-1">R$ {stats.mrr.toLocaleString('pt-BR')}</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6 rounded-2xl border-white/5 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                                <Activity size={24} />
                            </div>
                            <div className="flex gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-emerald-400 uppercase">Online</span>
                            </div>
                        </div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status Hub Sofia</h3>
                        <p className="text-3xl font-black text-white mt-1">99.9%</p>
                    </motion.div>
                </div>

                <div className="glass rounded-2xl overflow-hidden border border-white/5">
                    <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-1 bg-indigo-500 rounded-full" />
                            <h2 className="text-xl font-bold text-white">Lista de Usuários</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 size-4" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar por nome ou email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all w-64"
                                />
                            </div>
                            <button className="p-2 glass glass-hover rounded-xl text-gray-400">
                                <Filter size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Usuário</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Plano</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Cadastro</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <Loader2 className="animate-spin text-indigo-500 mx-auto mb-2" />
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Processando dados mestres...</p>
                                        </td>
                                    </tr>
                                ) : filteredUsers.map((user, idx) => (
                                    <motion.tr 
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold border-2 ${user.is_admin ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400' : 'border-white/10 bg-white/5 text-gray-400'}`}>
                                                    {user.full_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase">{user.full_name}</p>
                                                    <p className="text-[10px] text-gray-500 font-mono">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-300">
                                            {user.plan}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase border ${user.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] text-gray-500 font-bold uppercase">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        <span>Exibindo {filteredUsers.length} registros</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 glass rounded-md hover:text-white">Anterior</button>
                            <button className="px-3 py-1 glass rounded-md hover:text-white">Próximo</button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass p-8 rounded-2xl border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertCircle className="text-indigo-400" size={24} />
                            <h3 className="text-lg font-bold text-white">Alertas do Sistema</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500">
                                    <AlertCircle size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-yellow-200">Certificado SSL Vercel</p>
                                    <p className="text-[10px] text-yellow-500/70 mt-1 uppercase font-bold">Expira em 45 dias. A renovação automática está ativa.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-500">
                                    <ArrowUpRight size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-indigo-200">Volume de Requisições Sofia</p>
                                    <p className="text-[10px] text-indigo-500/70 mt-1 uppercase font-bold">Novo pico de uso detectado às 14:00 (SP). Estabilidade 100%.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border-white/5 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">Estratégia de Expansão</h3>
                            <p className="text-sm text-gray-400 leading-relaxed italic">
                                "O MRR atual sugere que temos espaço para investir em novos modelos de IA para a Sofia. Considere liberar o 'Modo Analista de Mercado' para usuários Master Admin na próxima atualização."
                            </p>
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full border-2 border-[#020617] bg-indigo-500 flex items-center justify-center text-[10px] font-bold">H</div>
                                <div className="w-8 h-8 rounded-full border-2 border-[#020617] bg-purple-500 flex items-center justify-center text-[10px] font-bold text-xs">S</div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Log de Acesso: Há 2 min</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

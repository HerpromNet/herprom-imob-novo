"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
    Users, 
    Search, 
    Plus, 
    MoreHorizontal, 
    Mail, 
    Phone, 
    Tag, 
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Lead {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    status: string;
    created_at: string;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchLeads = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('leads')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) setLeads(data);
            } catch (err) {
                console.error("Error fetching leads:", err);
                // Fallback fictício para demonstração premium
                setLeads([
                    { id: '1', full_name: 'Ricardo Almeida', email: 'ricardo@exemplo.com', phone: '(11) 98888-7777', status: 'Novo', created_at: new Date().toISOString() },
                    { id: '2', full_name: 'Juliana Costa', email: 'juliana@exemplo.com', phone: '(21) 97777-6666', status: 'Em Contato', created_at: new Date().toISOString() },
                    { id: '3', full_name: 'Marcos Oliveira', email: 'marcos@exemplo.com', phone: '(31) 96666-5555', status: 'Qualificado', created_at: new Date().toISOString() },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeads();
    }, []);

    const filteredLeads = leads.filter(lead => 
        lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'novo': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
            case 'em contato': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
            case 'qualificado': return 'bg-green-500/20 text-green-400 border-green-500/20';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <DashboardShell>
            <div className="space-y-6">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                            <Users className="text-primary" /> GESTÃO DE LEADS
                        </h1>
                        <p className="text-gray-400 mt-1">Organize seus contatos e transforme interesse em venda.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl font-bold transition-all shadow-lg shadow-primary/25">
                        <Plus size={20} /> Adicionar Lead
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 space-y-4">
                        <div className="glass p-4 rounded-xl flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar por nome ou email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                            <button className="p-2.5 glass glass-hover rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Filter size={18} />
                            </button>
                        </div>

                        <div className="glass rounded-xl overflow-hidden border border-white/5">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/5">
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Nome</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">Contato</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest hidden lg:table-cell">Data</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center">
                                                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                                                    <span className="text-sm text-gray-500">Carregando seus leads...</span>
                                                </td>
                                            </tr>
                                        ) : filteredLeads.length > 0 ? (
                                            <AnimatePresence>
                                                {filteredLeads.map((lead, index) => (
                                                    <motion.tr 
                                                        key={lead.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center font-bold text-primary border border-white/10 group-hover:scale-110 transition-transform">
                                                                    {lead.full_name?.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-white uppercase group-hover:text-primary transition-colors">{lead.full_name}</p>
                                                                    <p className="text-xs text-gray-500 md:hidden">{lead.phone}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 hidden md:table-cell">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-2 text-xs text-gray-300">
                                                                    <Mail size={12} className="text-gray-500" /> {lead.email}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-gray-300">
                                                                    <Phone size={12} className="text-gray-500" /> {lead.phone}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(lead.status)}`}>
                                                                {lead.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 hidden lg:table-cell">
                                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                                <Calendar size={12} />
                                                                {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white">
                                                                <MoreHorizontal size={20} />
                                                            </button>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                    Nenhum lead encontrado com "{searchTerm}".
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 border-t border-white/5 flex items-center justify-between">
                                <p className="text-xs text-gray-500 font-medium">Mostrando {filteredLeads.length} de {leads.length} leads</p>
                                <div className="flex items-center gap-2">
                                    <button className="p-1.5 glass rounded-lg text-gray-500 hover:text-white disabled:opacity-30" disabled>
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button className="p-1.5 glass rounded-lg text-gray-500 hover:text-white disabled:opacity-30" disabled>
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass p-6 rounded-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Métricas Rápidas</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-xs text-gray-500">Taxa de Conversão</span>
                                    <span className="text-xl font-bold text-white">12%</span>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                    <span className="text-xs text-gray-500">Novos esta semana</span>
                                    <span className="text-xl font-bold text-primary">+05</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                            <div className="flex items-center gap-2 text-primary mb-2">
                                <Tag size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Dica da Sofia</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed italic">
                                "Leads que recebem contato nas primeiras 2 horas têm 7x mais chances de serem qualificados eficazmente. Tente entrar em contato com o Ricardo!"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

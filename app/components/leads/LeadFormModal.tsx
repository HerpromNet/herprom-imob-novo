"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/authService";
import { X, Loader2, UserPlus, Mail, Phone, Tag, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LeadFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function LeadFormModal({ isOpen, onClose, onSuccess }: LeadFormModalProps) {
    const { profile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState("Novo");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (!profile?.id) throw new Error("Usuário não autenticado");

            const newLead = {
                full_name: fullName,
                email,
                phone,
                status,
                user_id: profile.id
            };

            const { error: insertError } = await supabase
                .from('leads')
                .insert([newLead]);

            if (insertError) throw insertError;

            setFullName("");
            setEmail("");
            setPhone("");
            setStatus("Novo");
            
            onSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocorreu um erro ao cadastrar o lead.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none custom-scrollbar overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative pointer-events-auto my-auto"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <UserPlus className="text-primary" /> Cadastrar Novo Lead
                                </h2>
                                <button 
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 md:p-8">
                                {error && (
                                    <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-3 px-4 rounded-xl font-medium">
                                        {error}
                                    </div>
                                )}

                                <form id="lead-form" onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Nome Completo</label>
                                        <div className="relative">
                                            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Ex: João da Silva" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">E-mail</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Ex: joao@exemplo.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Telefone / WhatsApp</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ex: (11) 99999-9999" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Status do Lead</label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 transition-all text-sm appearance-none">
                                                <option value="Novo" className="bg-[#0f172a]">Novo</option>
                                                <option value="Em Contato" className="bg-[#0f172a]">Em Contato</option>
                                                <option value="Qualificado" className="bg-[#0f172a]">Qualificado</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            
                            <div className="p-6 border-t border-white/10 bg-white/5 flex gap-4 justify-end">
                                <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-semibold text-gray-400 hover:text-white transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" form="lead-form" disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 rounded-xl font-semibold text-white transition-all shadow-lg shadow-primary/25 disabled:opacity-70">
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save size={18} /> Salvar Lead</>}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

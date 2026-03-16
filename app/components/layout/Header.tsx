"use client";

import { Bell, Search, User, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/authService";

export default function Header() {
    const { profile } = useAuth();

    return (
        <header className="h-20 glass border-b border-white/10 flex items-center justify-between px-8 z-40">
            <div className="relative w-96 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input 
                    type="text" 
                    placeholder="Buscar leads ou imóveis..."
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors group">
                    <Bell size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full ring-2 ring-[#020617]" />
                </button>

                <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white uppercase tracking-wider">{profile?.name || "Usuário"}</p>
                        <div className="flex items-center gap-1 justify-end">
                            <Sparkles size={12} className="text-primary" />
                            <p className="text-[10px] text-primary font-bold uppercase">{profile?.plan || "Teste"}</p>
                        </div>
                    </div>
                    <div className="h-10 w-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                        <User size={20} className="text-white" />
                    </div>
                </div>
            </div>
        </header>
    );
}

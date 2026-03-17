"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Users, 
    Home, 
    BrainCircuit, 
    TrendingUp, 
    Settings,
    LogOut,
    Menu,
    X,
    ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, signOut } from "@/lib/authService";
import { PlanType } from "@/lib/types";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BrainCircuit, label: "Sofia AI", href: "/dashboard/ai" },
    { icon: Users, label: "Leads", href: "/dashboard/leads" },
    { icon: Home, label: "Imóveis", href: "/dashboard/properties" },
    { icon: TrendingUp, label: "Ganhos", href: "/dashboard/earnings" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);
    const { profile } = useAuth();

    const handleLogout = async () => {
        await signOut();
        window.location.reload();
    };

    const isAdmin = profile?.plan === PlanType.MASTER_ADMIN || profile?.isAdmin;

    return (
        <aside className={`relative h-screen transition-all duration-300 ${isOpen ? "w-64" : "w-20"} flex flex-col glass border-r border-white/10 z-50`}>
            <div className="p-6 flex items-center justify-between">
                <AnimatePresence mode="wait">
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-center gap-3"
                        >
                            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center font-bold">H</div>
                            <span className="font-bold tracking-tight text-xl">HERPROM</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group
                                ${isActive ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                        >
                            <item.icon size={22} className={`${isActive ? "text-white" : "group-hover:text-primary transition-colors"}`} />
                            {isOpen && <span className="font-medium">{item.label}</span>}
                        </Link>
                    );
                })}

                {isAdmin && (
                    <Link 
                        href="/dashboard/admin"
                        className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group
                            ${pathname === "/dashboard/admin" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25" : "text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"}`}
                    >
                        <ShieldCheck size={22} className={`${pathname === "/dashboard/admin" ? "text-white" : "group-hover:scale-110 transition-transform"}`} />
                        {isOpen && <span className="font-bold uppercase tracking-tight text-xs">Painel Master Admin</span>}
                    </Link>
                )}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-2">
                <Link 
                    href="/dashboard/settings"
                    className="flex items-center gap-4 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all group"
                >
                    <Settings size={22} className="group-hover:rotate-45 transition-transform duration-500" />
                    {isOpen && <span className="font-medium">Configurações</span>}
                </Link>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
                >
                    <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                    {isOpen && <span className="font-medium">Sair</span>}
                </button>
            </div>
        </aside>
    );
}

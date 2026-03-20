"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import PropertyFormModal from "@/components/properties/PropertyFormModal";
import { 
    Home, 
    Search, 
    Plus, 
    MapPin, 
    Bed, 
    Bath, 
    Square, 
    ChevronRight,
    Loader2,
    Filter,
    Camera,
    Trash2,
    Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Property {
    id: string;
    title: string;
    address: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    type: string;
    status: string;
    image_url?: string;
}

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAppModalOpen, setAppModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);

    const fetchProperties = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setProperties(data);
        } catch (err) {
            console.error("Error fetching properties:", err);
            setProperties([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleDeleteProperty = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Impede o clique no card de disparar outros eventos
        if (!confirm("Tem certeza que deseja apagar este imóvel permanentemente?")) return;
        
        setIsLoading(true);
        try {
            const { error } = await supabase.from('properties').delete().eq('id', id);
            if (error) throw error;
            fetchProperties();
        } catch (err: any) {
            console.error("Erro ao deletar imóvel:", err);
            alert("Erro ao excluir. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProperties = properties.filter(p => 
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardShell>
            <div className="space-y-6">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                            <Home className="text-primary" /> MEUS IMÓVEIS
                        </h1>
                        <p className="text-gray-400 mt-1">Gerencie seu portfólio de imóveis de luxo.</p>
                    </div>
                    <button 
                        onClick={() => setAppModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl font-bold transition-all shadow-lg shadow-primary/25"
                    >
                        <Plus size={20} /> Cadastrar Imóvel
                    </button>
                </header>
                <PropertyFormModal 
                    isOpen={isAppModalOpen} 
                    initialData={editingProperty}
                    onClose={() => {
                        setAppModalOpen(false);
                        setEditingProperty(null);
                    }} 
                    onSuccess={() => {
                        setAppModalOpen(false);
                        setEditingProperty(null);
                        fetchProperties();
                    }} 
                />

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input 
                            type="text" 
                            placeholder="Buscar por título ou localização..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 glass glass-hover rounded-xl text-sm font-semibold text-gray-300">
                        <Filter size={18} /> Filtrar
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-gray-500 font-medium">Carregando catálogo...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProperties.map((p, index) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-primary/30 transition-all duration-500"
                            >
                                <div className="h-56 bg-white/5 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent">
                                        <Camera className="text-gray-600 scale-150 opacity-30" />
                                    </div>
                                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                                        <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded-full shadow-lg">
                                            {p.status}
                                        </span>
                                        <span className="px-3 py-1 bg-[#020617]/80 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded-full border border-white/10">
                                            {p.type}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                                        <button 
                                            title="Editar Imóvel"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingProperty(p);
                                                setAppModalOpen(true);
                                            }}
                                            className="p-2 bg-indigo-500/80 hover:bg-indigo-500 backdrop-blur-md text-white rounded-full shadow-lg transition-transform hover:scale-110"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            title="Excluir Imóvel"
                                            onClick={(e) => handleDeleteProperty(p.id, e)}
                                            className="p-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-md text-white rounded-full shadow-lg transition-transform hover:scale-110"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-white text-[#020617] p-3 rounded-full font-bold shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-300">
                                            <ChevronRight size={24} />
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{p.title}</h3>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium italic">
                                            <MapPin size={12} /> {p.address}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between py-4 border-y border-white/5">
                                        <div className="flex flex-col items-center gap-1">
                                            <Bed size={16} className="text-gray-400" />
                                            <span className="text-xs font-bold text-white">{p.bedrooms} Qts</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Bath size={16} className="text-gray-400" />
                                            <span className="text-xs font-bold text-white">{p.bathrooms} Suítes</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Square size={16} className="text-gray-400" />
                                            <span className="text-xs font-bold text-white">{p.area}m²</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <p className="text-2xl font-black text-white">{p.price}</p>
                                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary transition-all duration-500">
                                            <Tag size={18} className="text-primary group-hover:text-white" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardShell>
    );
}

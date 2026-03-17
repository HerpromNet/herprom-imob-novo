"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
    Home, 
    Search, 
    Plus, 
    MapPin, 
    Bed, 
    Bath, 
    Square, 
    Tag, 
    ChevronRight,
    Loader2,
    Filter,
    Camera
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

    useEffect(() => {
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
                // Fallback fictício Premium
                setProperties([
                    { id: '1', title: 'Cobertura Duplex no Itaim', address: 'Rua Amauri, Itaim Bibi - SP', price: 'R$ 4.500.000', bedrooms: 4, bathrooms: 5, area: 320, type: 'Apartamento', status: 'Venda' },
                    { id: '2', title: 'Casa de Condomínio Alpha 1', address: 'Alphaville, Barueri - SP', price: 'R$ 7.200.000', bedrooms: 5, bathrooms: 7, area: 650, type: 'Casa', status: 'Venda' },
                    { id: '3', title: 'Flat Design Moema', address: 'Av. Lavandisca, Moema - SP', price: 'R$ 8.500 /mês', bedrooms: 1, bathrooms: 1, area: 45, type: 'Flat', status: 'Aluguel' },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperties();
    }, []);

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
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl font-bold transition-all shadow-lg shadow-primary/25">
                        <Plus size={20} /> Cadastrar Imóvel
                    </button>
                </header>

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
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase rounded-full shadow-lg">
                                            {p.status}
                                        </span>
                                        <span className="px-3 py-1 bg-[#020617]/80 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded-full border border-white/10">
                                            {p.type}
                                        </span>
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

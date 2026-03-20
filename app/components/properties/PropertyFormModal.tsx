"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/authService";
import { 
    X, 
    Upload, 
    Loader2, 
    Home, 
    MapPin, 
    DollarSign, 
    Bed, 
    Bath, 
    Square, 
    Tag,
    Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PropertyFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any | null;
}

export default function PropertyFormModal({ isOpen, onClose, onSuccess, initialData }: PropertyFormModalProps) {
    const { profile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form states
    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");
    const [price, setPrice] = useState("");
    const [bedrooms, setBedrooms] = useState("1");
    const [bathrooms, setBathrooms] = useState("1");
    const [area, setArea] = useState("50");
    const [type, setType] = useState("Apartamento");
    const [status, setStatus] = useState("Venda");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setTitle(initialData.title || "");
                setAddress(initialData.address || "");
                setPrice(initialData.price || "");
                setBedrooms(initialData.bedrooms?.toString() || "1");
                setBathrooms(initialData.bathrooms?.toString() || "1");
                setArea(initialData.area?.toString() || "50");
                setType(initialData.type || "Apartamento");
                setStatus(initialData.status || "Venda");
                setImagePreview(initialData.image_url || null);
            } else {
                setTitle("");
                setAddress("");
                setPrice("");
                setBedrooms("1");
                setBathrooms("1");
                setArea("50");
                setType("Apartamento");
                setStatus("Venda");
                setImagePreview(null);
            }
            setImageFile(null);
            setError(null);
        }
    }, [initialData, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${profile?.id || 'unknown'}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
            .from('properties')
            .upload(filePath, file);

        if (uploadError) {
            throw new Error(`Erro no upload da imagem: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
            .from('properties')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (!profile?.id) throw new Error("Usuário não autenticado");

            let imageUrl = initialData?.image_url || null;
            if (imageFile) {
                try {
                    imageUrl = await uploadImage(imageFile);
                } catch (imgError: any) {
                    console.error("Upload failed layout fallback will be used.", imgError);
                }
            }

            const propertyData = {
                title,
                address,
                price,
                bedrooms: parseInt(bedrooms),
                bathrooms: parseInt(bathrooms),
                area: parseInt(area),
                type,
                status,
                image_url: imageUrl,
                agent_id: profile.id
            };

            if (initialData?.id) {
                const { error: updateError } = await supabase
                    .from('properties')
                    .update(propertyData)
                    .eq('id', initialData.id);
                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('properties')
                    .insert([propertyData]);
                if (insertError) throw insertError;
            }

            // Reset form
            setTitle("");
            setAddress("");
            setPrice("");
            setImageFile(null);
            setImagePreview(null);
            
            onSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocorreu um erro ao cadastrar o imóvel.");
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
                            className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative pointer-events-auto my-auto"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Home className="text-primary" /> {initialData ? "Editar Imóvel" : "Cadastrar Novo Imóvel"}
                                </h2>
                                <button 
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                                {error && (
                                    <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-3 px-4 rounded-xl font-medium">
                                        {error}
                                    </div>
                                )}

                                <form id="property-form" onSubmit={handleSubmit} className="space-y-6">
                                    
                                    {/* Image Upload Area */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 ml-1">Foto Principal</label>
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${imagePreview ? 'border-primary/50' : 'border-white/10 hover:border-primary/50 bg-white/5'}`}
                                            style={{
                                                backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center'
                                            }}
                                        >
                                            {!imagePreview && (
                                                <>
                                                    <div className="p-4 bg-primary/20 rounded-full mb-3">
                                                        <ImageIcon className="text-primary h-8 w-8" />
                                                    </div>
                                                    <p className="text-sm text-gray-400 font-medium">Clique para fazer upload da foto</p>
                                                    <p className="text-xs text-gray-600 mt-1">Alta resolução recomendada</p>
                                                </>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300 ml-1">Título</label>
                                            <div className="relative">
                                                <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Apartamento de Luxo no Itaim" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300 ml-1">Localização</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                <input required type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Ex: Rua Amauri, Itaim Bibi" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300 ml-1">Preço</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                <input required type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="Ex: R$ 1.500.000" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300 ml-1">Tipo de Negócio</label>
                                            <div className="relative">
                                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 transition-all text-sm appearance-none">
                                                    <option value="Venda" className="bg-[#0f172a]">Venda</option>
                                                    <option value="Aluguel" className="bg-[#0f172a]">Aluguel</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 md:col-span-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 ml-1">Quartos</label>
                                                <div className="relative">
                                                    <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                    <input required type="number" min="0" value={bedrooms} onChange={e => setBedrooms(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-2 text-white focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 ml-1">Suítes</label>
                                                <div className="relative">
                                                    <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                    <input required type="number" min="0" value={bathrooms} onChange={e => setBathrooms(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-2 text-white focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300 ml-1">Área (m²)</label>
                                                <div className="relative">
                                                    <Square className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                    <input required type="number" min="1" value={area} onChange={e => setArea(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-2 text-white focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            
                            <div className="p-6 border-t border-white/10 bg-white/5 flex gap-4 justify-end">
                                <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-semibold text-gray-400 hover:text-white transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" form="property-form" disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 rounded-xl font-semibold text-white transition-all shadow-lg shadow-primary/25 disabled:opacity-70">
                                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Upload size={18} /> Salvar Imóvel</>}
                                </button>
                            </div>

                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

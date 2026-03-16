"use client";

import { useState, useRef, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { chatWithAI } from "@/lib/geminiService";
import { Send, Bot, User, Sparkles, Loader2, Eraser } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SofiaPage() {
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([
        { role: "assistant", content: "Olá! Eu sou a Sofia, sua assistente de elite. Como posso ajudar você a fechar mais negócios hoje? 🏡✨" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await chatWithAI(userMessage, messages.map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }]
            })));
            
            setMessages(prev => [...prev, { role: "assistant", content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "Desculpe, tive um problema técnico. Tente novamente em instantes." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardShell>
            <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Sparkles className="text-primary" /> SOFIA AI
                        </h1>
                        <p className="text-gray-400 text-sm">Sua inteligência imobiliária avançada.</p>
                    </div>
                    <button 
                        onClick={() => setMessages([messages[0]])}
                        className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                    >
                        <Eraser size={16} /> Limpar Conversa
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar pb-8">
                    <AnimatePresence initial={false}>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`flex gap-4 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 ${m.role === "user" ? "bg-primary" : "bg-white/5"}`}>
                                        {m.role === "user" ? <User size={20} /> : <Bot size={20} className="text-primary" />}
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-primary/20 border border-primary/20 text-white" : "glass text-gray-200"}`}>
                                        {m.content}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex gap-4 max-w-[80%]">
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                                    <Bot size={20} className="text-primary" />
                                </div>
                                <div className="p-4 rounded-2xl glass text-sm flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-primary" />
                                    Sofia está pensando...
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="mt-4 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pergunte qualquer coisa para a Sofia..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-2xl"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary hover:bg-primary/90 rounded-xl transition-all disabled:opacity-50 disabled:bg-gray-700"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </DashboardShell>
    );
}

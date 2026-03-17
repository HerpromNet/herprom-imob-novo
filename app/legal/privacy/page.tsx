"use client";

import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#020617] text-white py-12 px-4 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto relative z-10"
            >
                <Link href="/auth/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-wider group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Voltar
                </Link>

                <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-8">
                        <div className="h-16 w-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shrink-0">
                            <LockKeyhole className="text-purple-400 h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight">Política de Privacidade</h1>
                            <p className="text-gray-400 mt-1">Última atualização: Março de 2026</p>
                        </div>
                    </div>

                    <div className="space-y-8 text-gray-300 leading-relaxed text-sm">
                        <section>
                            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">1. Introdução</h2>
                            <p>
                                A Herprom Imob leva a sua privacidade e a privacidade dos seus clientes a sério. Esta Política de Privacidade descreve 
                                como coletamos, usamos, armazenamos e protegemos as suas informações pessoais e os dados dos seus leads 
                                no aplicativo CRM FOR BROKER, em conformidade com a LGPD (Lei Geral de Proteção de Dados - Brasil).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">2. Dados Coletados</h2>
                            <p className="mb-2">Coletamos os seguintes tipos de informações:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                <li><strong className="text-white">Dados da Conta:</strong> Nome, e-mail, senha (criptografada), CRECI (opcional).</li>
                                <li><strong className="text-white">Dados de Leads:</strong> Informações que você cadastra sobre seus clientes (nomes, e-mails, telefones, interesses imobiliários).</li>
                                <li><strong className="text-white">Dados de Imóveis:</strong> Informações sobre propriedades que você cadastra na plataforma.</li>
                                <li><strong className="text-white">Chaves de API:</strong> Sua chave da API do Google Gemini é armazenada exclusivamente de forma local (LocalStorage) no seu navegador, nunca sendo enviada para nossos servidores.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">3. Uso das Informações</h2>
                            <p>
                                Utilizamos as informações coletadas estritamente para fornecer, manter e melhorar nossos serviços, 
                                processar transações (como pagamentos de assinaturas), e comunicação técnica sobre a plataforma. 
                                Nós <strong>nunca vendemos, alugamos ou compartilhamos</strong> os dados dos seus leads com terceiros. Seus leads são exclusivamente seus.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">4. Armazenamento e Segurança</h2>
                            <p>
                                Seus dados são armazenados na infraestrutura do Supabase, que possui rigorosos controles de segurança, 
                                incluindo criptografia em trânsito e em repouso. Implementamos políticas de Role-Level Security (RLS) no banco de dados, 
                                garantindo que você tenha acesso apenas aos seus próprios dados e leads.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">5. Seus Direitos (LGPD)</h2>
                            <p>
                                Você tem o direito de solicitar acesso, correção, anonimização, bloqueio ou exclusão dos seus dados pessoais. 
                                A exclusão da sua conta resultará na deleção permanente de todos os leads, imóveis e dados associados 
                                após o tempo de retenção legal exigido.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">6. Cookies e Tecnologias Semelhantes</h2>
                            <p>
                                Utilizamos cookies apenas para manter sua sessão autenticada ativa e fornecer configurações de preferência (como a chave da IA local). 
                                Não utilizamos cookies de rastreamento publicitário de terceiros no dashboard.
                            </p>
                        </section>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

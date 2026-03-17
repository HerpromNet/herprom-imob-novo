"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#020617] text-white py-12 px-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            
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
                        <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shrink-0">
                            <ShieldCheck className="text-primary h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight">Termos de Uso</h1>
                            <p className="text-gray-400 mt-1">Última atualização: Março de 2026</p>
                        </div>
                    </div>

                    <div className="space-y-8 text-gray-300 leading-relaxed text-sm">
                        <section>
                            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">1. Aceitação dos Termos</h2>
                            <p>
                                Ao acessar e usar o aplicativo CRM FOR BROKER (Herprom Imob), você concorda em cumprir e ficar vinculado a estes Termos de Uso. 
                                Se você não concordar com qualquer parte destes termos, não deverá utilizar nossa plataforma.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">2. Descrição do Serviço</h2>
                            <p>
                                O CRM FOR BROKER é uma plataforma SaaS (Software as a Service) voltada para corretores de imóveis e imobiliárias, 
                                oferecendo ferramentas de gestão de leads, catálogo de imóveis, inteligência artificial integrada (Sofia AI) e controle financeiro.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">3. Contas de Usuário</h2>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400">
                                <li>Você é responsável por manter a confidencialidade de sua conta e senha.</li>
                                <li>Você concorda em fornecer informações verdadeiras, precisas e completas no momento do cadastro.</li>
                                <li>Notifique-nos imediatamente sobre qualquer uso não autorizado de sua conta.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">4. Uso de Inteligência Artificial</h2>
                            <p>
                                Nossa plataforma utiliza a API do Google Gemini (Sofia AI). Ao utilizar o serviço com sua própria chave de API (BYOK - Bring Your Own Key), 
                                você está sujeito aos Termos de Serviço do Google Cloud. A Herprom Imob não se responsabiliza por respostas geradas pela IA que possam ser imprecisas, 
                                cabendo ao usuário a conferência das informações antes de enviá-las a clientes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">5. Tratamento de Dados (Leads)</h2>
                            <p>
                                Como corretor, você é o o "Controlador" dos dados dos seus leads e clientes, conforme definição da LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018). 
                                O CRM FOR BROKER atua apenas como "Operador", armazenando essas informações em infraestrutura segura. Você garante que possui base legal (como consentimento) 
                                para inserir e processar os dados dos seus clientes na plataforma.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">6. Assinaturas e Pagamentos</h2>
                            <p>
                                Os pagamentos são processados via Mercado Pago. Em caso de cancelamento da assinatura, você terá acesso à plataforma 
                                até o final do ciclo de faturamento atual. Não realizamos reembolsos parciais por meses não utilizados.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-white mb-3 uppercase tracking-wider">7. Limitação de Responsabilidade</h2>
                            <p>
                                A Herprom Imob não será responsável por quaisquer danos indiretos, incidentais ou consequenciais decorrentes 
                                ou relacionados ao uso ou incapacidade de usar o serviço, incluindo falhas de conexão com integrações de terceiros.
                            </p>
                        </section>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

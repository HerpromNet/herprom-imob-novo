"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        // Redireciona para o login por padrão para garantir que o usuário entre no fluxo certo
        router.push("/auth/login");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-gray-400 animate-pulse font-medium uppercase tracking-widest text-xs">
                    Iniciando Central Herprom...
                </p>
            </div>
        </div>
    );
}

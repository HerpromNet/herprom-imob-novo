import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => {
    if (typeof window !== 'undefined') {
        const customKey = localStorage.getItem('herprom_gemini_key');
        if (customKey && customKey.trim().length < 20) {
            localStorage.removeItem('herprom_gemini_key');
            return (process.env.NEXT_PUBLIC_GEMINI_API_KEY || "").trim();
        }
        if (customKey && customKey.trim().length > 30) return customKey.trim();
    }
    return (process.env.NEXT_PUBLIC_GEMINI_API_KEY || "").trim();
};

const MODELS = [
    "gemini-1.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest"
];

const callGeminiAPI = async (prompt: string, systemInstruction: string = "", history: any[] = []) => {
    const key = getApiKey();
    if (!key) throw new Error("API Key ausente");

    let lastError = null;

    for (const modelName of MODELS) {
        try {
            const genAI = new GoogleGenerativeAI(key);
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: systemInstruction
            });

            let validHistory: { role: string, parts: { text: string }[] }[] = [];
            let expectedRole = 'user';

            history.forEach(h => {
                const textContent = h.parts?.[0]?.text || h.text || h.content || "";
                if (!textContent.trim()) return;

                const mappedRole = (h.role === 'assistant' || h.role === 'model') ? 'model' : 'user';

                if (mappedRole === expectedRole) {
                    validHistory.push({
                        role: mappedRole,
                        parts: [{ text: textContent }]
                    });
                    expectedRole = expectedRole === 'user' ? 'model' : 'user';
                }
            });

            if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
                validHistory.pop();
            }

            const chat = model.startChat({
                history: validHistory,
            });

            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            const text = response.text();

            if (text) return text;
        } catch (err: any) {
            console.warn(`[Sofia] Falha no modelo ${modelName} via SDK:`, err.message);
            lastError = err;
            if (err.message.includes("401") || err.message.includes("API key")) {
                throw new Error("CHAVE_INVALIDA: Verifique sua chave do Google AI.");
            }
            continue;
        }
    }

    try {
        console.log(`[Sofia] Tentativa final via Fetch v1beta...`);
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: prompt }] }]
                })
            }
        );
        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }
    } catch (e) {
        console.error("[Sofia] Fallback v1beta falhou também.");
    }

    throw lastError || new Error("Falha em todos os modelos e métodos.");
};

export const chatWithAI = async (message: string, history: any[]) => {
    const systemInstruction = `Você é a Sofia, assistente sênior do Herprom Broker. Use emojis 🏡✨. Seja direta e criativa.`;
    try {
        return await callGeminiAPI(message, systemInstruction, history);
    } catch (error: any) {
        console.error('Erro Sofia Final:', error);
        const msg = error.message || "";
        if (msg.includes("CHAVE_INVALIDA") || msg.includes("API key")) {
            return `🔑 **Sua chave de API parece não estar funcionando.**\n\nAcesse as configurações (ícone da engrenagem ⚙️), limpe a chave e cole uma nova chave válida do Google AI Studio.`;
        }
        return `🥺 **Sofia está com dificuldade técnica agora.**\n\n**O que aconteceu:** \`${msg.substring(0, 100)}\``;
    }
};

export const generateMarketingContent = async (type: string, params: any) => {
    const prompt = `Gere uma copy para ${params.propertyType} em ${params.location}. Destaques: ${params.highlights}`;
    try {
        return await callGeminiAPI(prompt, "Você é um mestre em copywriting imobiliário.");
    } catch (e: any) {
        return "Erro ao gerar marketing: " + e.message;
    }
};

export const qualifyLeadAI = async (conversation: string) => {
    return null;
};

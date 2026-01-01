
import { GoogleGenAI, Type } from "@google/genai";
import { CryptoCurrency, UpcomingCoin, NewsItem } from "../types";

// Função para obter a instância da IA de forma segura e única
const getAi = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key não encontrada no ambiente.");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper para limpar resposta JSON da IA
const cleanAiJson = (text: string) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const analyzeMarket = async (coin: CryptoCurrency): Promise<string> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Atue como um analista sênior de criptomoedas (Cryvex AI). 
        Analise os dados atuais de ${coin.name} (${coin.symbol}):
        - Preço: $${coin.price}
        - RSI: ${coin.rsi}
        - Tendência: ${coin.trend}
        - Variação 24h: ${coin.change24h}%
        
        Forneça uma análise estratégica curta (máximo 300 caracteres) em português.
      `,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || 'Análise indisponível no momento.';
  } catch (error) {
    console.error("Erro Gemini Analyze:", error);
    return 'O serviço de IA está temporariamente offline para manutenção. Tente novamente em 60 segundos.';
  }
};

export const fetchMarketNews = async (): Promise<NewsItem[]> => {
  try {
    const ai = getAi();
    const today = new Date().toISOString().split('T')[0];
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere 6 notícias urgentes e impactantes sobre o mercado cripto para ${today}. Retorne exclusivamente JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              source: { type: Type.STRING },
              timestamp: { type: Type.NUMBER },
              impact: { type: Type.STRING },
              coins: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "title", "summary", "source", "timestamp", "impact", "coins"]
          }
        }
      }
    });

    return JSON.parse(cleanAiJson(response.text));
  } catch (error) {
    console.warn("Gemini News Fetch Error, retrying or using fallback.");
    throw error;
  }
};

export const fetchUpcomingCoins = async (): Promise<UpcomingCoin[]> => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Liste 4 projetos cripto reais com lançamentos futuros previstos. Retorne JSON puro.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              symbol: { type: Type.STRING },
              launchDate: { type: Type.STRING },
              category: { type: Type.STRING },
              hypeScore: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              platform: { type: Type.STRING }
            },
            required: ["id", "name", "symbol", "launchDate", "category", "hypeScore", "summary", "platform"]
          }
        }
      }
    });
    return JSON.parse(cleanAiJson(response.text));
  } catch (error) {
    throw new Error("Falha ao sincronizar roadmaps com a rede neural.");
  }
};

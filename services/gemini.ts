
import { GoogleGenAI } from "@google/genai";
import { CryptoCurrency } from "../types";

// Função para obter a instância do AI com segurança
const getAiInstance = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const analyzeMarket = async (coin: CryptoCurrency): Promise<string> => {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Atue como um analista sênior de criptomoedas. 
        Analise brevemente os dados técnicos atuais de ${coin.name} (${coin.symbol}):
        - Preço: $${coin.price}
        - RSI: ${coin.rsi}
        - Variação 24h: ${coin.change24h}%
        - Tendência: ${coin.trend}
        - Força do Movimento: ${coin.strength}
        
        Dê uma conclusão rápida (máximo 3 sentenças) em português, focada em decisão rápida: "Comprar", "Vender" ou "Aguardar", explicando o porquê de forma simples para iniciantes.
      `,
    });

    return response.text || 'Não foi possível gerar a análise no momento.';
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Erro ao processar análise inteligente.';
  }
};

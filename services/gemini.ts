
import { GoogleGenAI } from "@google/genai";
import { SITE_CONFIG } from "../config/site-config";

export async function askAssistant(prompt: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SITE_CONFIG.assistant.instructions,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, tive um problema ao processar sua pergunta. Tente novamente em instantes ou use o link do WhatsApp abaixo.";
  }
}

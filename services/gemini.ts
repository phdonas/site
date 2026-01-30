
import { GoogleGenAI } from "@google/genai";

// askAssistant provides a high-level interface to query the Paulo Donassolo assistant.
export async function askAssistant(prompt: string) {
  try {
    // Always initialize with the exact environment variable as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Você é o assistente virtual do Paulo Donassolo. Seu objetivo é ajudar os visitantes a encontrar conteúdo sobre seus pilares: Professor Paulo, Consultoria Imobiliária, 4050oumais e Academia do Gás. Seja profissional, polido e use o estilo de comunicação da Apple: claro, conciso e elegante.",
      },
    });
    // Property access .text is the correct way to retrieve the content
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, tive um problema ao processar sua pergunta. Tente novamente em instantes.";
  }
}

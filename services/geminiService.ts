import { GoogleGenAI } from "@google/genai";
import { MOCK_COMPANY_DATA, MOCK_DOCUMENTS } from "../mockData";

// Guidelines: The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// Guidelines: Use this process.env.API_KEY string directly when initializing.

export const getGeminiResponse = async (userMessage: string, history: { role: 'user' | 'model', text: string }[]) => {
  // Always use a named parameter for initialization and rely exclusively on process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Jesteś inteligentnym asystentem AI dla polskiego mikroprzedsiębiorcy o nazwie FirmaAI.
    Kontekst firmy: ${JSON.stringify(MOCK_COMPANY_DATA)}.
    Ostatnie dokumenty: ${JSON.stringify(MOCK_DOCUMENTS)}.
    Twoje cechy: profesjonalny, przyjazny, konkretny, nieformalny ale rzeczowy.
    Znasz polskie przepisy podatkowe (ZUS, VAT, PIT, CIT, KSeF, e-Doręczenia).
    Pomagasz analizować finanse, ostrzegasz przed ryzykiem i generujesz dokumenty (umowy B2B, wezwania do zapłaty).
    Twoje odpowiedzi powinny być sformatowane w Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Directly access the text property as per GenerateContentResponse guidelines.
    return response.text || "Przepraszam, nie udało mi się wygenerować odpowiedzi.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Wystąpił błąd podczas komunikacji z asystentem AI.";
  }
};
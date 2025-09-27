import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function gemini_call() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: "Why is the sky blue?",
  });
  console.log(response.text);
}
"use server";

import { UserData } from "@/lib/types";
import { GoogleGenAI } from "@google/genai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

function parseGeminiResponse(responseText: string): UserData {
  try {
    // Remove markdown code blocks and any extra whitespace
    let cleanText = responseText.trim();

    // Remove ```json and ``` markers
    cleanText = cleanText.replace(/^```json\s*/i, "");
    cleanText = cleanText.replace(/^```\s*/i, "");
    cleanText = cleanText.replace(/\s*```$/i, "");

    // Remove any remaining backticks
    cleanText = cleanText.replace(/`/g, "");

    // Trim again after cleaning
    cleanText = cleanText.trim();

    // Parse the cleaned JSON
    return JSON.parse(cleanText) as UserData;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    console.error("Original text:", responseText);
    throw new Error(`JSON parsing failed: ${error}`);
  }
}

export async function gemini_call(pdf_text: string): Promise<UserData|undefined|null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `Extract the candidate’s name, email, and mobile number from the following text.
        Return the result strictly in the JSON format below. If a field is not found, leave it as an empty string.
        Do not add any extra text, comments, or greetings.

        Format:
        {
          "name": "",
          "email": "",
          "mobile": ""
        }

        Text:
        ${pdf_text}`,
    });
    console.log(response.text);
    if (response.text) {
      const userData = parseGeminiResponse(response.text);
      console.log("Extracted user data:", userData);
      return userData;
    }
  } catch (error) {
    console.error("Error extracting user data:", error);
    return null;
  }
}

export async function generateQuestions() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: "",
    });

    console.log(response);
  } catch (e) {
    console.log(e);
  }
}

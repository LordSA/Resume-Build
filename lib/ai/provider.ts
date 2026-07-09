// lib/ai/provider.ts
import { callGemini } from "./gemini";
import { callGroq } from "./groq";
import { callOpenRouter } from "./openrouter";

export async function callAI(prompt: string, isJson: boolean = false): Promise<string> {
  const errors: string[] = [];

  if (process.env.GEMINI_API_KEY) {
    try {
      const result = await callGemini(prompt, isJson);
      return result;
    } catch (e: any) {
      console.warn("Gemini call failed, trying Groq... Error:", e.message || e);
      errors.push(`Gemini: ${e.message || e}`);
    }
  } else {
    errors.push("Gemini: GEMINI_API_KEY is not defined");
  }

  if (process.env.GROQ_API_KEY) {
    try {
      const result = await callGroq(prompt, isJson);
      return result;
    } catch (e: any) {
      console.warn("Groq call failed, trying OpenRouter... Error:", e.message || e);
      errors.push(`Groq: ${e.message || e}`);
    }
  } else {
    errors.push("Groq: GROQ_API_KEY is not defined");
  }

  if (process.env.OPENROUTER_API_KEY) {
    try {
      const result = await callOpenRouter(prompt, isJson);
      return result;
    } catch (e: any) {
      console.error("OpenRouter call failed. Error:", e.message || e);
      errors.push(`OpenRouter: ${e.message || e}`);
    }
  } else {
    errors.push("OpenRouter: OPENROUTER_API_KEY is not defined");
  }

  throw new Error(`All AI Providers failed.\nDetails:\n${errors.join("\n")}`);
}

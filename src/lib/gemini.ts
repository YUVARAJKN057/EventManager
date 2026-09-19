import { GoogleGenAI } from "@google/genai";

export const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const MODELS = {
  FLASH: 'gemini-3-flash-preview',
  PRO: 'gemini-3.1-pro-preview',
};

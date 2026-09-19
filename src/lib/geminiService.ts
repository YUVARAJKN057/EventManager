import { gemini, MODELS } from './gemini';
import { Type } from '@google/genai';

export async function categorizeEvent(title: string, description: string) {
  try {
    const response = await gemini.models.generateContent({
      model: MODELS.FLASH,
      contents: `Categorize this campus event into 3 relevant tags: Title: ${title}, Description: ${description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categories: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            summary: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini categorization error:", error);
    return { categories: ['other'], summary: description.slice(0, 100) };
  }
}

export async function getRecommendations(userInterests: string[], recentEvents: any[]) {
  // Simulating logic
  return recentEvents.filter(e => 
    e.categories?.some((c: string) => userInterests.includes(c))
  );
}

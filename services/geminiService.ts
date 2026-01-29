import { GoogleGenAI, Type } from "@google/genai";
import { ImageGenerationConfig } from "../types";

// Helper to ensure we have a key for premium models
const ensureApiKey = async () => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }
};

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askFastQuestion = async (query: string): Promise<string> => {
  const ai = getAI();
  const model = 'gemini-2.5-flash-lite-latest'; // Fast
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        systemInstruction: "You are a helpful GitHub expert. Answer briefly and concisely about GitHub achievements.",
      }
    });
    return response.text || "No response generated.";
  } catch (e) {
    console.error(e);
    return "Error generating response.";
  }
};

export const searchForBadges = async (query: string) => {
  const ai = getAI();
  const model = 'gemini-2.5-flash-latest'; // Standard Flash for tools
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Search for the latest GitHub profile badges and achievements information: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "No info found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    // Extract sources
    const sources = chunks?.map((c: any) => ({
      uri: c.web?.uri,
      title: c.web?.title
    })).filter((s: any) => s.uri) || [];

    return { text, sources };
  } catch (e) {
    console.error(e);
    return { text: "Error searching for badges.", sources: [] };
  }
};

export const analyzeProfileBadges = async (username: string) => {
  const ai = getAI();
  const model = 'gemini-2.5-flash-latest';

  try {
    // We ask Gemini to specifically check the profile via Google Search
    const response = await ai.models.generateContent({
      model,
      contents: `Search for the GitHub profile of user '${username}' (github.com/${username}). 
      Specifically look for the 'Achievements' section on their profile page. 
      List the exact names of all the achievements/badges they have unlocked (e.g., Pull Shark, YOLO, Arctic Code Vault Contributor, Starstruck, Public Sponsor, Mars 2020 Helicopter Mission, Pair Extraordinaire, Galaxy Brain, Quickdraw). 
      Return the names in a comma-separated list. If you cannot find the profile or achievements, say "None".`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "";
    const lowerText = text.toLowerCase();
    
    // Naive mapping based on text presence
    const detectedBadges: string[] = [];
    
    // Map of keywords to Badge IDs (based on constants.ts)
    const mapping: Record<string, string> = {
      'mars': 'mars-2020',
      'helicopter': 'mars-2020',
      'arctic': 'arctic-code-vault',
      'vault': 'arctic-code-vault',
      'sponsor': 'public-sponsor',
      'starstruck': 'starstruck',
      'shark': 'shark',
      'yolo': 'yolo',
      'quickdraw': 'quickdraw',
      'pair': 'pair-extraordinaire',
      'galaxy': 'galaxy-brain',
      'brain': 'galaxy-brain'
    };

    Object.keys(mapping).forEach(keyword => {
      if (lowerText.includes(keyword)) {
        detectedBadges.push(mapping[keyword]);
      }
    });

    // Deduplicate
    return [...new Set(detectedBadges)];
  } catch (e) {
    console.error("Error analyzing profile badges:", e);
    return [];
  }
};

export const analyzeUnlockStrategy = async (badgeName: string) => {
  const ai = getAI();
  const model = 'gemini-3-pro-preview'; // Thinking model
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Explain in extreme detail exactly how to unlock the '${badgeName}' achievement on GitHub. Include edge cases, requirements, and historical context if applicable.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking
      }
    });
    return response.text || "Could not analyze strategy.";
  } catch (e) {
    console.error(e);
    return "Error during deep analysis.";
  }
};

export const generateBadgeConcept = async (config: ImageGenerationConfig) => {
  await ensureApiKey(); // Required for Pro Image
  const ai = getAI();
  const model = 'gemini-3-pro-image-preview'; // High quality image
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: `Design a high quality, 3D glossy style GitHub achievement badge for: ${config.prompt}. The style should match existing GitHub badges (hexagonal or circular, metallic or colorful).` }]
      },
      config: {
        imageConfig: {
          imageSize: config.size,
          aspectRatio: "1:1"
        }
      }
    });

    // Find image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

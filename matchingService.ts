/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { BusinessData, MatchingResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MATCH_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    federalPrograms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          organization: { type: Type.STRING },
          type: { type: Type.STRING },
          eligibilityReason: { type: Type.STRING },
          description: { type: Type.STRING },
          geographicScope: { type: Type.STRING },
          nextStep: { type: Type.STRING },
        },
        required: ["name", "organization", "type", "eligibilityReason", "description", "geographicScope", "nextStep"]
      }
    },
    provincialPrograms: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, organization: { type: Type.STRING }, type: { type: Type.STRING }, eligibilityReason: { type: Type.STRING }, description: { type: Type.STRING }, geographicScope: { type: Type.STRING }, nextStep: { type: Type.STRING } } } },
    industrySpecific: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, organization: { type: Type.STRING }, type: { type: Type.STRING }, eligibilityReason: { type: Type.STRING }, description: { type: Type.STRING }, geographicScope: { type: Type.STRING }, nextStep: { type: Type.STRING } } } },
    fundingFinancing: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, organization: { type: Type.STRING }, type: { type: Type.STRING }, eligibilityReason: { type: Type.STRING }, description: { type: Type.STRING }, geographicScope: { type: Type.STRING }, nextStep: { type: Type.STRING } } } },
    hiringTalent: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, organization: { type: Type.STRING }, type: { type: Type.STRING }, eligibilityReason: { type: Type.STRING }, description: { type: Type.STRING }, geographicScope: { type: Type.STRING }, nextStep: { type: Type.STRING } } } },
    exportExpansion: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, organization: { type: Type.STRING }, type: { type: Type.STRING }, eligibilityReason: { type: Type.STRING }, description: { type: Type.STRING }, geographicScope: { type: Type.STRING }, nextStep: { type: Type.STRING } } } },
    complianceAdvisory: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, organization: { type: Type.STRING }, type: { type: Type.STRING }, eligibilityReason: { type: Type.STRING }, description: { type: Type.STRING }, geographicScope: { type: Type.STRING }, nextStep: { type: Type.STRING } } } },
  },
  required: ["summary", "federalPrograms", "provincialPrograms", "industrySpecific", "fundingFinancing", "hiringTalent", "exportExpansion", "complianceAdvisory"]
};

export async function matchBusinessSupport(data: BusinessData): Promise<MatchingResponse> {
  const prompt = `
    You are an expert Canadian Business Support Matching Assistant.
    Analyze the following business profile and recommend relevant support programs across Canada.
    
    Business Profile:
    ${JSON.stringify(data, null, 2)}
    
    Guidelines:
    - Focus on real programs like ISED, BDC, EDC, SR&ED, IRAP, and regional development agencies (e.g., FedDev Ontario, PrairiesCan).
    - Prioritize based on province (${data.province.join(", ")}), industry (${data.industry.join(", ")}), and stage (${data.stage}).
    - If in Quebec, include resources from Investissement Québec.
    - If in R&D or innovation, prioritize SR&ED and IRAP.
    - If hiring, suggest wage subsidies like CSJ or Mitacs.
    - If seeking export, suggest EDC and Trade Commissioner Service.
    - For early stage, suggest regional business centers and incubators.
    
    Structure the response as requested in the JSON schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: MATCH_SCHEMA,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(response.text) as MatchingResponse;
  } catch (error) {
    console.error("AI Matching Error:", error);
    throw error;
  }
}

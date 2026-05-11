import { GoogleGenAI, Type } from "@google/genai";
import { LandAnalysis, FarmerInterviewData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Point {
  x: number;
  y: number;
}

export async function analyzeLand(
  imageBase64: string, 
  context: string, 
  polygon: Point[],
  interview?: FarmerInterviewData
): Promise<LandAnalysis> {
  // Convert 0-100 percentages to 0-1000 normalized coordinates for Gemini
  const normalizedPoints = polygon.map(p => ({
    x: Math.round(p.x * 10),
    y: Math.round(p.y * 10)
  }));

  const pointsString = normalizedPoints.map(p => `[${p.y}, ${p.x}]`).join(', ');

  const interviewContext = interview ? `
    USER INTERVIEW DATA:
    - Dimensions: ${interview.dimensions}
    - Vegetation: ${interview.vegetation}
    - History: ${interview.history}
    - Weather: ${interview.weather}
    - Water Source: ${interview.waterSource}
    - Additional Notes: ${interview.additionalNotes}
  ` : '';

  const prompt = `Analyze this land photo as a Senior Agrotechnology Engineer. 
  
  FOCUS AREA (POLYGON): Only analyze the area defined by the following closed polygon points [ymin, xmin]: [${pointsString}]. 
  The coordinates are in a 0-1000 normalized scale.

  ${interviewContext}
  
  CORE INSTRUCTION:
  1. If User Interview Data is provided and contains a value other than "-", PRIORITIZE it over visual estimations.
  2. If a specific field in User Interview Data is "-", IGNORE it entirely and use your Computer Vision capabilities to analyze the visual evidence in the photo for that specific variable.
  3. CORRELATION ANALYSIS: Analyze the relationship between user answers and visual evidence (e.g., if user reports "Frequent rain" and photo shows pooling water, provide a drainage warning).
  
  REQUIRED OUTPUTS (In Indonesian):
  1. BOTANICAL IDENTIFICATION: Identify dominant weeds WITHIN THE POLYGON AREA using scientific names.
  2. SPATIAL ANALYSIS: Estimate the area of the polygonal region in m². If the user provided dimensions, use them to ground your perspective calculation.
  3. TECHNICAL PROCESSING: Provide step-by-step instructions for the focused area.
  4. DIMENSIONS: Provide technical bed dimensions in cm (Height, Width, Spacing).
  5. CROP RECOMMENDATION: Suggest 3 specific crops for this sub-region.

  The output must be in Indonesian.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          spatialAnalysis: {
            type: Type.OBJECT,
            properties: {
              estimatedArea: { type: Type.STRING },
              landShape: { type: Type.STRING, enum: ["Persegi", "Trapesium", "Tidak Beraturan", "Lainnya"] },
              contourDescription: { type: Type.STRING },
              slopeLevel: { type: Type.STRING, enum: ["Datar", "Landai", "Curam"] }
            },
            required: ["estimatedArea", "landShape", "contourDescription", "slopeLevel"]
          },
          vegetationAnalysis: {
            type: Type.OBJECT,
            properties: {
              weeds: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    scientificName: { type: Type.STRING },
                    commonName: { type: Type.STRING },
                    implication: { type: Type.STRING }
                  },
                  required: ["scientificName", "commonName", "implication"]
                } 
              },
              soilEstimation: { type: Type.STRING },
              estimatedPh: { type: Type.STRING },
              fertilityLevel: { type: Type.STRING }
            },
            required: ["weeds", "soilEstimation", "estimatedPh", "fertilityLevel"]
          },
          processingRecommendation: {
            type: Type.OBJECT,
            properties: {
              method: { type: Type.STRING, enum: ["Manual", "Mekanis", "Kimiawi"] },
              instructions: { type: Type.STRING },
              toolsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
              safetyNotes: { type: Type.STRING }
            },
            required: ["method", "instructions", "toolsNeeded", "safetyNotes"]
          },
          cropRecommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["name", "reason"]
            }
          },
          plantingTechnique: {
            type: Type.OBJECT,
            properties: {
              methodName: { type: Type.STRING },
              description: { type: Type.STRING },
              dimensions: {
                type: Type.OBJECT,
                properties: {
                  bedHeight: { type: Type.STRING },
                  bedWidth: { type: Type.STRING },
                  spacing: { type: Type.STRING }
                },
                required: ["bedHeight", "bedWidth", "spacing"]
              },
              steps: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["methodName", "description", "dimensions", "steps"]
          }
        },
        required: ["spatialAnalysis", "vegetationAnalysis", "processingRecommendation", "cropRecommendations", "plantingTechnique"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Gagal mendapatkan respons dari AI.");
  }

  return JSON.parse(response.text) as LandAnalysis;
}

export async function askExpert(
  question: string,
  analysis: LandAnalysis,
  interview: FarmerInterviewData | undefined,
  history: { role: 'user' | 'assistant', content: string }[]
): Promise<string> {
  const context = `
    LAND ANALYSIS CONTEXT:
    - Area: ${analysis.spatialAnalysis.estimatedArea}
    - Weeds: ${analysis.vegetationAnalysis.weeds.map(w => w.commonName).join(', ')}
    - Soil: ${analysis.vegetationAnalysis.soilEstimation}
    - pH: ${analysis.vegetationAnalysis.estimatedPh}
    - Crop Recommendations: ${analysis.cropRecommendations.map(c => c.name).join(', ')}
    
    INTERVIEW DATA:
    - Dimensions: ${interview?.dimensions || 'N/A'}
    - History: ${interview?.history || 'N/A'}
    - Weather: ${interview?.weather || 'N/A'}
  `;

  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are an expert Agrotechnology Advisor. Answer user questions based on the provided Land Analysis and Interview Context. Keep your answers practical, encouraging, and tailored to a farmer. Use Indonesian. If you don't know something, suggest consulting a local agricultural extension office.`
    },
    history: [
      { role: 'user', parts: [{ text: `Here is the context for our conversation: ${context}` }] },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model' as any,
        parts: [{ text: msg.content }]
      }))
    ]
  });

  const response = await chat.sendMessage({ message: question });
  return response.text || "Maaf, saya tidak dapat menjawab pertanyaan tersebut saat ini.";
}

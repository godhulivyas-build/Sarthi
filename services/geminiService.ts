import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TransportOption } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTransportOptions = async (
  source: string,
  destination: string,
  crop: string,
  weight: string
): Promise<TransportOption[]> => {
  if (!apiKey) {
    // Fallback mock if no API key is present for demo purposes
    return [
      { id: '1', provider: 'Saarthi Express', vehicleType: 'Tata Ace (Chota Hathi)', price: 2500, eta: '4 Hours', rating: 4.5 },
      { id: '2', provider: 'Kisan Logistics', vehicleType: 'Pickup 8ft', price: 1800, eta: '6 Hours', rating: 4.2 },
      { id: '3', provider: 'Speedy Transport', vehicleType: 'Eicher 14ft', price: 4500, eta: '3 Hours', rating: 4.8 },
    ];
  }

  const model = "gemini-3-flash-preview";
  
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        provider: { type: Type.STRING },
        vehicleType: { type: Type.STRING },
        price: { type: Type.NUMBER },
        eta: { type: Type.STRING },
        rating: { type: Type.NUMBER },
      },
      required: ["id", "provider", "vehicleType", "price", "eta", "rating"]
    }
  };

  const prompt = `
    Generate 3 realistic transport logistics options for moving ${weight} of ${crop} from ${source} to ${destination} in India.
    Context:
    - Prices should be in Indian Rupees (INR) roughly accurate for the distance.
    - Vehicle types should be common in India (e.g., Tata Ace, Pickup, Eicher, Truck).
    - Ratings between 3.5 and 5.0.
    - ETA should be realistic.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as TransportOption[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};

export const getSupportAdvice = async (issue: string): Promise<string> => {
  if (!apiKey) return "Please check your internet connection or try again later.";

  const model = "gemini-3-flash-preview";
  const prompt = `
    You are Saarthi, a helpful agri-logistics support assistant for Indian farmers. 
    The user has reported this issue: "${issue}".
    Provide a concise, helpful response with 3 clear bullet points on what they should do.
    Use simple English mixed with common Indian terms (Hinglish style) if appropriate to make it friendly.
    Format as plain text or simple markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "Sorry, I couldn't generate advice at this moment.";
  } catch (error) {
    console.error("Support API Error:", error);
    return "We are facing technical difficulties. Please call our helpline.";
  }
};
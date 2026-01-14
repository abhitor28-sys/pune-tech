
import { GoogleGenAI } from "@google/genai";
import { PuneEvent, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchPuneUpdates = async (): Promise<{ events: PuneEvent[], sources: GroundingSource[] }> => {
  try {
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      timeZone: 'Asia/Kolkata' 
    });

    const prompt = `
      Current Date in Pune, India: ${todayStr}.
      
      CRITICAL INSTRUCTION: You are a real-time event tracker for Pune city. 
      Your task is to find EVERY possible upcoming technology, science, and innovation event in Pune.
      
      IMPORTANT: 
      1. Include events happening TODAY (${todayStr}) and any future dates.
      2. STRICTLY EXCLUDE events that have already ended or passed.
      3. Focus on: Tech Expos, Science Fests, Engineering Workshops, Coding Webinars, Innovation Summits, Startup Meetups, and Hackathons.
      
      CATEGORIZATION RULES: Every event MUST be assigned one of these EXACT types:
      - "Expo"
      - "Webinar"
      - "Fest"
      - "Workshop"
      - "Seminar"
      - "Innovation Show"
      
      For each event, find and provide:
      - name: Full specific name (No "Unknown" or generic names).
      - type: One of the strings above.
      - date: Full date (e.g., "February 24, 2024").
      - time: Start and end time.
      - venue: Specific venue name (e.g., "COEP Ground", "JW Marriott", "Online").
      - address: Full street address or "Virtual" for webinars.
      - description: Clear 3-sentence summary.
      - sourceUrl: Direct link to the official site, ticket portal (like BookMyShow or Insider), or news announcement.
      
      Aim for a comprehensive list (20+ events if they exist).
      Output ONLY as a valid JSON array of objects. No markdown formatting or extra text.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const groundingSources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || "Source",
        uri: chunk.web?.uri || "#"
      })) || [];

    let events: PuneEvent[] = [];
    try {
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        const jsonStr = text.substring(jsonStart, jsonEnd);
        const parsed = JSON.parse(jsonStr);
        
        events = parsed.map((item: any, index: number) => ({
          id: `event-${Date.now()}-${index}`,
          name: item.name && item.name !== "Unknown" ? item.name : "Innovation Event Pune",
          type: item.type || "Innovation Show",
          date: item.date || "Today onwards",
          time: item.time || "Check website",
          venue: item.venue || "Pune City Venue",
          address: item.address || "Pune, Maharashtra",
          description: item.description && item.description !== "No description available" 
            ? item.description 
            : "A high-impact event focused on the latest developments in Pune's technology and innovation sector.",
          sourceUrl: item.sourceUrl || (groundingSources[index % groundingSources.length]?.uri || groundingSources[0]?.uri || "")
        }));
      }
    } catch (e) {
      console.error("Failed to parse event JSON", e);
    }

    return { events, sources: groundingSources };
  } catch (error) {
    console.error("Error fetching Pune updates:", error);
    throw error;
  }
};

// utils/api.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CropRecommendationSchema } from "./zodSchema";

export async function generateCropRecommendations(
  genAI,
  environmentalData,
  cropType
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Enhanced prompt with more explicit JSON formatting instructions
    const prompt = `Given the environmental conditions below for growing ${cropType}, provide a detailed analysis in JSON format.

Environmental Data:
- Elevation: ${environmentalData.elevation}m
- Soil pH: ${environmentalData.soilQuality.ph}
- Organic Matter: ${environmentalData.soilQuality.organicMatter}
- Nutrients: N:${environmentalData.soilQuality.nitrogen}, P:${environmentalData.soilQuality.phosphorus}, K:${environmentalData.soilQuality.potassium}
- Annual Rainfall: ${environmentalData.climate.averageRainfall}mm
- Average Temperature: ${environmentalData.climate.averageTemperature}°C
- Growing Season: ${environmentalData.climate.growingSeasonLength} days
- Terrain: ${environmentalData.terrain.slope} slope, ${environmentalData.terrain.aspect}, ${environmentalData.terrain.drainageClass}

Format your response as a JSON object with these EXACT keys and value types:

{
  "suitabilityScore": <number between 1-10>,
  "recommendations": {
    "nutrientManagement": [<string>, ...],
    "waterManagement": [<string>, ...],
    "soilHealth": [<string>, ...],
    "pestControl": [<string>, ...]
  },
  "challenges": [
    {
      "challenge": <string>,
      "mitigationStrategy": <string>
    },
    ...
  ],
  "plantingWindows": [
    {
      "season": <string>,
      "startMonth": <string>,
      "endMonth": <string>,
      "notes": <string>
    },
    ...
  ],
  "yieldPotential": {
    "minYield": <number>,
    "maxYield": <number>,
    "unit": <string>,
    "notes": <string>
  }
}

Important: Return ONLY the JSON object, no other text. Ensure all arrays have at least one item.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // First, try to parse the JSON
    let parsedResponse;
    try {
      // Remove any potential markdown formatting or extra text
      const jsonStr = response.replace(/```json\n?|\n?```/g, "").trim();
      parsedResponse = JSON.parse(jsonStr);
    } catch (err) {
      console.error("Failed to parse the JSON response:", err);
      // Return default schema values instead of empty object
      return {
        analysis: CropRecommendationSchema.parse({}),
        timestamp: new Date().toISOString(),
      };
    }

    // Validate with Zod schema
    const validatedResponse =
      CropRecommendationSchema.safeParse(parsedResponse);

    if (validatedResponse.success) {
      return {
        analysis: validatedResponse.data,
        timestamp: new Date().toISOString(),
      };
    } else {
      console.error("Schema validation failed:", validatedResponse.error);

      // Return default schema values
      return {
        analysis: CropRecommendationSchema.parse({}),
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error("Error in generateCropRecommendations:", error);
    throw new Error(
      `Failed to generate crop recommendations: ${error.message}`
    );
  }
}

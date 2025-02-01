// pages/api/crop-location-planner.js
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    // Extract required parameters from request body
    const { lat, lng, radius, cropType } = req.body;

    // Validate required parameters
    if (!lat || !lng || !radius || !cropType) {
      return res.status(400).json({
        error:
          "Missing required parameters: lat, lng, radius, and cropType are required.",
      });
    }

    // Read credentials from the JSON file
    const credentialsPath = path.join(process.cwd(), "farmer-pal.json");
    const credentials = JSON.parse(readFileSync(credentialsPath, "utf8"));

    // Initialize Google API client with credentials
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 1. Fetch location data from Google Maps API
    const locationData = await fetchLocationData(lat, lng, googleApiKey);

    // 2. Get environmental data
    const environmentalData = await getEnvironmentalData(locationData);

    // 3. Generate crop recommendations using Gemini
    const cropRecommendations = await generateCropRecommendations(
      genAI,
      environmentalData,
      cropType
    );

    // 4. Return combined results
    res.status(200).json({
      success: true,
      location: {
        latitude: lat,
        longitude: lng,
        searchRadius: radius,
      },
      environmentalData,
      recommendations: cropRecommendations,
    });
  } catch (error) {
    console.error("Error in crop location planning:", error);
    res.status(500).json({
      error: "Failed to process crop location planning request",
      details: error.message,
    });
  }
}

async function fetchLocationData(lat, lng, apiKey) {
  const endpoints = {
    elevation: `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${apiKey}`,
    placesNearby: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1000&key=${apiKey}`,
  };

  const [elevationRes, placesRes] = await Promise.all([
    axios.get(endpoints.elevation),
    axios.get(endpoints.placesNearby),
  ]);

  return {
    elevation: elevationRes.data.results[0].elevation,
    nearbyPlaces: placesRes.data.results,
  };
}

async function getEnvironmentalData(locationData) {
  // In a production environment, you would want to:
  // 1. Integrate with real weather APIs
  // 2. Use soil testing data APIs if available
  // 3. Consider historical climate data
  return {
    elevation: locationData.elevation,
    soilQuality: {
      ph: 6.8,
      organicMatter: "4.2%",
      nitrogen: "High",
      phosphorus: "Medium",
      potassium: "High",
    },
    climate: {
      averageRainfall: 800, // mm per year
      averageTemperature: 22, // °C
      growingSeasonLength: 240, // days
    },
    terrain: {
      slope: "2%",
      aspect: "South-facing",
      drainageClass: "Well-drained",
    },
  };
}

async function generateCropRecommendations(genAI, environmentalData, cropType) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze the following environmental conditions for growing ${cropType}:
  
Environmental Data:
- Elevation: ${environmentalData.elevation}m
- Soil pH: ${environmentalData.soilQuality.ph}
- Organic Matter: ${environmentalData.soilQuality.organicMatter}
- Nutrients: N:${environmentalData.soilQuality.nitrogen}, P:${environmentalData.soilQuality.phosphorus}, K:${environmentalData.soilQuality.potassium}
- Annual Rainfall: ${environmentalData.climate.averageRainfall}mm
- Average Temperature: ${environmentalData.climate.averageTemperature}°C
- Growing Season: ${environmentalData.climate.growingSeasonLength} days
- Terrain: ${environmentalData.terrain.slope} slope, ${environmentalData.terrain.aspect}, ${environmentalData.terrain.drainageClass}

Please provide:
1. Suitability score (1-10)
2. Specific recommendations for optimal growth
3. Potential challenges and mitigation strategies
4. Best planting times
5. Expected yield potential`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return {
    rawAnalysis: response,
    timestamp: new Date().toISOString(),
  };
}

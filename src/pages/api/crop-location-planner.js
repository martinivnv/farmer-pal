// pages/api/crop-location-planner.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import path from "path";
import { generateCropRecommendations } from "@/utils/api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { lat, lng, radius, cropType } = req.body;

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

    // 3. Generate crop recommendations using imported function
    const cropRecommendations = await generateCropRecommendations(
      genAI,
      environmentalData,
      cropType
    );

    return res.status(200).json({
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
    return res.status(500).json({
      error: "Failed to process crop location planning request",
      details: error.message,
    });
  }
}

async function fetchLocationData(lat, lng, apiKey) {
  try {
    const [elevationRes, placesRes] = await Promise.all([
      fetch(
        `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${apiKey}`
      ),
      fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1000&key=${apiKey}`
      ),
    ]);

    if (!elevationRes.ok || !placesRes.ok) {
      throw new Error("Failed to fetch location data from Google APIs");
    }

    const [elevationData, placesData] = await Promise.all([
      elevationRes.json(),
      placesRes.json(),
    ]);

    if (elevationData.status !== "OK" || placesData.status !== "OK") {
      throw new Error("Invalid response from Google APIs");
    }

    return {
      elevation: elevationData.results[0].elevation,
      nearbyPlaces: placesData.results,
    };
  } catch (error) {
    throw new Error(`Error fetching location data: ${error.message}`);
  }
}

async function getEnvironmentalData(locationData) {
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
      averageRainfall: 800,
      averageTemperature: 22,
      growingSeasonLength: 240,
    },
    terrain: {
      slope: "2%",
      aspect: "South-facing",
      drainageClass: "Well-drained",
    },
  };
}

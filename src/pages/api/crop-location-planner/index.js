// pages/api/crop-location-planner.js
import { GoogleGenerativeAI } from "@google/generative-ai";

import { generateCropRecommendations } from "@/utils/api";
import { saveCropLocationPlan, sanitizeData } from "@/lib/firebase-helpers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { lat, lng, radius, cropType } = req.body;

    console.log("Received crop location planning request:", req.body);

    if (!lat || !lng || !radius || !cropType) {
      return res.status(400).json({
        error:
          "Missing required parameters: lat, lng, radius, and cropType are required.",
      });
    }

    // Initialize Google API client with credentials
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    if (!googleApiKey) {
      throw new Error("GOOGLE_MAPS_API_KEY is not configured");
    }

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

    // 4. Prepare data for saving
    const analysisData = {
      location: {
        latitude: lat,
        longitude: lng,
        searchRadius: radius,
      },
      cropType,
      environmentalData,
      recommendations: cropRecommendations,
      metadata: {
        locationDetails: {
          elevation: locationData.elevation,
          nearbyPlaces: locationData.nearbyPlaces.map((place) => ({
            name: place.name,
            type: place.types?.[0] || "unknown",
            distance: place.vicinity,
          })),
        },
      },
    };

    // 5. Save to Firebase
    const sanitizedData = sanitizeData(analysisData);
    const docId = await saveCropLocationPlan(sanitizedData);

    console.log("Saved to Firebase with document ID:", docId);

    return res.status(200).json({
      success: true,
      documentId: docId,
      ...analysisData,
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
    console.log("Fetching location data for:", { lat, lng });

    const [elevationRes, placesRes] = await Promise.all([
      fetch(
        `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${apiKey}`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Node.js",
          },
        }
      ),
      fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1000&key=${apiKey}`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Node.js",
          },
        }
      ),
    ]);

    const [elevationData, placesData] = await Promise.all([
      elevationRes.json(),
      placesRes.json(),
    ]);

    console.log("API Responses received:", {
      elevationStatus: elevationData.status,
      placesStatus: placesData.status,
    });

    // Handle potential API errors more gracefully
    if (elevationData.status !== "OK") {
      console.warn("Elevation API warning:", elevationData);
      return {
        elevation: 0,
        nearbyPlaces: [],
      };
    }

    return {
      elevation: elevationData.results[0]?.elevation || 0,
      nearbyPlaces: placesData.results || [],
    };
  } catch (error) {
    console.error("Location data fetch error:", error);
    // Return default data instead of throwing
    return {
      elevation: 0,
      nearbyPlaces: [],
    };
  }
}

async function getEnvironmentalData(locationData) {
  return {
    elevation: locationData.elevation,
    soilQuality: {
      ph: 6.5,
      organicMatter: "3.5%",
      nitrogen: "Moderate",
      phosphorus: "Low",
      potassium: "Medium",
    },
    climate: {
      averageRainfall: 900, // in millimeters
      averageTemperature: 24, // in °C
      growingSeasonLength: 180, // in days
    },
    terrain: {
      slope: "1%",
      aspect: "North-east", // approximate aspect
      drainageClass: "Well-drained",
    },
  };
}

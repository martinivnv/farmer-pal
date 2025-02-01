// pages/api/get-crop-data.js
import {
  getCropDiseaseAnalyses,
  getCropLocationPlans,
} from "@/lib/firebase-get-data";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Get query parameters
    const { limit = 100, mostRecent = true } = req.query;

    // Determine which data to fetch based on query
    let data;

    data = await getCropLocationPlans({
      limit: Number(limit),
      mostRecent: mostRecent === "true",
    });

    console.log("Crop data fetched:", data.length);

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching crop data:", error);
    return res.status(500).json({
      message: "Error fetching crop data",
      error: error.message,
    });
  }
}

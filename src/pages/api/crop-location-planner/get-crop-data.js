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
    const { type = "all", limit = 100, mostRecent = true } = req.query;

    // Determine which data to fetch based on query
    let data;
    if (type === "disease") {
      data = await getCropDiseaseAnalyses({
        limit: Number(limit),
        mostRecent: mostRecent === "true",
      });
    } else if (type === "location") {
      data = await getCropLocationPlans({
        limit: Number(limit),
        mostRecent: mostRecent === "true",
      });
    } else if (type === "all") {
      // Fetch both disease and location data
      const [diseaseData, locationData] = await Promise.all([
        getCropDiseaseAnalyses({
          limit: Number(limit) / 2,
          mostRecent: mostRecent === "true",
        }),
        getCropLocationPlans({
          limit: Number(limit) / 2,
          mostRecent: mostRecent === "true",
        }),
      ]);

      data = [...diseaseData, ...locationData];
    } else {
      return res.status(400).json({ message: "Invalid type parameter" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching crop data:", error);
    return res.status(500).json({
      message: "Error fetching crop data",
      error: error.message,
    });
  }
}

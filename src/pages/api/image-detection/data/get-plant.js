// pages/api/get-crop-data/data/get-plant.js
import { getCropDiseaseAnalyses } from "@/lib/firebase-get-data";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Get query parameters
    const {
      limit = 100,
      mostRecent = true,
      plantType, // Optional parameter to filter by specific plant type
    } = req.query;

    // Fetch crop disease analyses
    const allData = await getCropDiseaseAnalyses({
      limit: Number(limit),
      mostRecent: mostRecent === "true",
    });

    // Filter by plant type if specified
    const filteredData = plantType
      ? allData.filter(
          (item) =>
            item.plantType &&
            item.plantType.toLowerCase() === plantType.toLowerCase()
        )
      : allData;

    return res.status(200).json(filteredData);
  } catch (error) {
    console.error("Error fetching plant data:", error);
    return res.status(500).json({
      message: "Error fetching plant data",
      error: error.message,
    });
  }
}

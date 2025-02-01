// pages/api/image-detection/data/get-pest.js
import { getPestAnalyses } from "@/lib/firebase-get-data";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Get query parameters
    const { limit = 100, mostRecent = true } = req.query;

    // Fetch pest analyses
    const data = await getPestAnalyses({
      limit: Number(limit),
      mostRecent: mostRecent === "true",
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching pest data:", error);
    return res.status(500).json({
      message: "Error fetching pest data",
      error: error.message,
    });
  }
}

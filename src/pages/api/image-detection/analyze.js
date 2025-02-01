import { NextResponse } from "next/server";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ error: "Method not allowed. Use POST." });
	}

	try {
		const { imageUrl } = req.body;
		if (!imageUrl) {
			return res.status(400).json({ error: "Missing imageUrl" });
		}

		const visionAPIKey = process.env.GEMINI_API_KEY;
		const visionAPIUrl = `https://vision.googleapis.com/v1/images:annotate?key=${visionAPIKey}`;

		const requestBody = {
			requests: [
				{
					image: { source: { imageUri: imageUrl } },
					features: [
						{ type: "OBJECT_LOCALIZATION" },
						{ type: "LABEL_DETECTION", maxResults: 10 },
						{ type: "CROP_HINTS" },
					],
				},
			],
		};

		const response = await fetch(visionAPIUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestBody),
		});

		const data = await response.json();

		// Analyze the results for plant health
		const analysis = {
			isPlant: false,
			isHealthy: true,
			conditions: [],
			confidence: 0,
		};

		// Check if image contains plants
		const labels = data.responses[0]?.labelAnnotations || [];
		const objects = data.responses[0]?.localizedObjectAnnotations || [];

		// Combine detected objects and labels
		const allDetections = [...labels, ...objects];

		// Check if image contains plants
		const plantRelatedTerms = ["Plant", "Leaf", "Tree", "Flower", "Vegetation"];
		analysis.isPlant = allDetections.some((item) =>
			plantRelatedTerms.some((term) =>
				item.description?.toLowerCase().includes(term.toLowerCase())
			)
		);

		// Look for disease indicators
		const diseaseIndicators = [
			"Spots",
			"Wilting",
			"Yellowing",
			"Mold",
			"Rust",
			"Blight",
			"Rot",
			"Disease",
			"Infected",
			"Damage",
		];

		const foundIndicators = allDetections
			.filter((item) =>
				diseaseIndicators.some((indicator) =>
					item.description?.toLowerCase().includes(indicator.toLowerCase())
				)
			)
			.map((item) => ({
				condition: item.description,
				confidence: item.score || item.confidence,
			}));

		if (foundIndicators.length > 0) {
			analysis.isHealthy = false;
			analysis.conditions = foundIndicators;
			analysis.confidence = foundIndicators[0].confidence;
		}

		return res.status(200).json({
			rawAnalysis: data,
			plantHealth: analysis,
		});
	} catch (error) {
		console.error("Error analyzing image:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}

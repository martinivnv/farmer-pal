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

		const visionAPIKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
		const visionAPIUrl = `https://vision.googleapis.com/v1/images:annotate?key=${visionAPIKey}`;

		const requestBody = {
			requests: [
				{
					image: { source: { imageUri: imageUrl } },
					features: [{ type: "LABEL_DETECTION" }, { type: "IMAGE_PROPERTIES" }],
				},
			],
		};

		const response = await fetch(visionAPIUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestBody),
		});

		const data = await response.json();
		return res.status(200).json({ analysis: data });
	} catch (error) {
		console.error("Error analyzing image:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}

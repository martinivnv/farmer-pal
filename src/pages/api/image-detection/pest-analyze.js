// pages/api/image-detection/pest-analyze.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { formidable } from "formidable";
import fs from "fs";
import { z } from "zod";
import { savePestAnalysis, sanitizeData } from "@/lib/firebase-helpers";

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Schema for pest analysis validation
const AnalysisResponseSchema = z
  .object({
    pestInfo: z.object({
      name: z.string(),
      confidence: z.enum(["High", "Medium", "Low"]),
      description: z.string(),
      scientificName: z.string().optional(),
      category: z.string(),
    }),
    threatLevel: z.enum(["High", "Medium", "Low"]),
    threatDescription: z.string(),
    controlMeasures: z.array(
      z.object({
        type: z.string(),
        steps: z.array(z.string()),
      })
    ),
    preventionTips: z.array(z.string()),
    additionalResources: z.array(z.string()),
  })
  .strict();

// Helper function to parse form data
const parseForm = async (req) => {
  const options = {
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowEmptyFiles: false,
  };

  const form = formidable(options);

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Receiving upload request...");
    const { files } = await parseForm(req);
    console.log("Files received:", files);

    const imageFile = files.image?.[0];
    if (!imageFile) {
      return res.status(400).json({ error: "No image file provided" });
    }

    console.log("Processing image:", imageFile.originalFilename);

    // Read the image file
    const imageBuffer = fs.readFileSync(imageFile.filepath);
    const imageBase64 = imageBuffer.toString("base64");

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert agricultural entomologist and pest control specialist. Analyze this image and provide a detailed assessment of any pests or pest damage visible.

Focus on:
1. Accurate pest identification
2. Threat level assessment
3. Potential crop damage evaluation
4. Control methods and mitigation strategies
5. Prevention recommendations

Provide your analysis in the following JSON format:
{
  "pestInfo": {
    "name": "Common name of the pest",
    "confidence": "High|Medium|Low",
    "description": "Detailed description of the pest",
    "scientificName": "Scientific name if identifiable",
    "category": "Type of pest (e.g., insect, rodent, mite)"
  },
  "threatLevel": "High|Medium|Low",
  "threatDescription": "Explanation of the threat level and potential damage",
  "controlMeasures": [
    {
      "type": "Method name (e.g., Chemical, Biological, Cultural)",
      "steps": ["Detailed step 1", "Detailed step 2"]
    }
  ],
  "preventionTips": [
    "Prevention tip 1",
    "Prevention tip 2"
  ],
  "additionalResources": [
    "Relevant information or resource 1",
    "Relevant information or resource 2"
  ]
}

Ensure all arrays have at least one item and provide practical, actionable advice.`;

    console.log("Sending to Gemini API...");

    // Process image with Gemini
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageFile.mimetype,
          data: imageBase64,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    console.log("Received response from Gemini");

    // Parse and validate the response
    let analysisData;
    try {
      const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
      const parsedData = JSON.parse(cleanedText);
      analysisData = AnalysisResponseSchema.parse(parsedData);
    } catch (error) {
      console.error("Parsing error:", error);
      analysisData = {
        pestInfo: {
          name: "Unable to identify",
          confidence: "Low",
          description:
            "Could not determine pest from image. Please ensure image is clear and well-lit.",
          category: "Unknown",
        },
        threatLevel: "Medium",
        threatDescription:
          "Unable to assess threat level. Please consult with local agricultural extension service.",
        controlMeasures: [
          {
            type: "General Precautions",
            steps: [
              "Monitor crop regularly",
              "Consider consulting pest management professional",
            ],
          },
        ],
        preventionTips: [
          "Maintain regular crop monitoring",
          "Implement good sanitation practices",
          "Consider integrated pest management approaches",
        ],
        additionalResources: [
          "Contact your local agricultural extension office",
          "Consider professional pest identification services",
        ],
      };
    }

    const firestoreData = {
      ...analysisData,
      userId: 1, // From form fields
      location: "Brazil", // From form fields
      imageFileName: imageFile.originalFilename,
    };

    // Sanitize and save to Firestore
    const sanitizedData = sanitizeData(firestoreData);
    const docId = await savePestAnalysis(sanitizedData);
    console.log("Pest analysis saved with ID:", docId);

    // Clean up the temporary file
    fs.unlinkSync(imageFile.filepath);

    // Return the analysis results
    return res.status(200).json({
      success: true,
      analysis: analysisData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Pest analysis error:", error);
    return res.status(500).json({
      error: "Failed to analyze pest image",
      details: error.message,
    });
  }
}

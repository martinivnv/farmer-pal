// pages/api/image-detection/analyze.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { formidable } from "formidable";
import fs from "fs";
import { z } from "zod";
import { saveCropAnalysis, sanitizeData } from "@/lib/firebase-helpers";

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Schema for validation
const AnalysisResponseSchema = z
  .object({
    healthStatus: z.object({
      overall: z.enum(["Healthy", "Moderate", "Critical"]),
      score: z.number().min(1).max(10),
      description: z.string(),
    }),
    diseases: z.array(
      z.object({
        name: z.string(),
        confidence: z.enum(["High", "Medium", "Low"]),
        symptoms: z.array(z.string()),
        treatment: z.array(z.string()),
      })
    ),
    nutrientIssues: z.array(
      z.object({
        deficiency: z.string(),
        symptoms: z.array(z.string()),
        treatment: z.array(z.string()),
      })
    ),
    growthStage: z.object({
      stage: z.string(),
      characteristics: z.array(z.string()),
      recommendations: z.array(z.string()),
    }),
    careRecommendations: z.array(z.string()),
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

    const prompt = `You are a professional plant pathologist and agricultural expert. Analyze this plant image in detail and provide a comprehensive report.

Focus on:
1. Overall plant health assessment
2. Identification of any diseases, pests, or disorders
3. Growth stage evaluation
4. Nutrient deficiency indicators
5. Specific treatment recommendations

Provide the analysis in the following JSON format:
{
  "healthStatus": {
    "overall": "Healthy|Moderate|Critical",
    "score": <number 1-10>,
    "description": "<detailed health description>"
  },
  "diseases": [
    {
      "name": "<disease name>",
      "confidence": "High|Medium|Low",
      "symptoms": ["<symptom 1>", "<symptom 2>"],
      "treatment": ["<treatment step 1>", "<treatment step 2>"]
    }
  ],
  "nutrientIssues": [
    {
      "deficiency": "<nutrient name>",
      "symptoms": ["<symptom 1>", "<symptom 2>"],
      "treatment": ["<treatment step 1>", "<treatment step 2>"]
    }
  ],
  "growthStage": {
    "stage": "<current growth stage>",
    "characteristics": ["<characteristic 1>", "<characteristic 2>"],
    "recommendations": ["<recommendation 1>", "<recommendation 2>"]
  },
  "careRecommendations": ["<recommendation 1>", "<recommendation 2>"]
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
        healthStatus: {
          overall: "Moderate",
          score: 5,
          description:
            "Unable to perform detailed analysis. Please ensure image quality is good and try again.",
        },
        diseases: [
          {
            name: "Analysis Inconclusive",
            confidence: "Low",
            symptoms: ["Unable to determine symptoms"],
            treatment: ["Please consult a local agricultural expert"],
          },
        ],
        nutrientIssues: [
          {
            deficiency: "Analysis Inconclusive",
            symptoms: ["Unable to determine deficiencies"],
            treatment: ["Recommend soil testing"],
          },
        ],
        growthStage: {
          stage: "Unable to determine",
          characteristics: ["Image analysis incomplete"],
          recommendations: ["Consider submitting a clearer image"],
        },
        careRecommendations: [
          "Consult with local agricultural extension service",
        ],
      };
    }

    const firestoreData = {
      type: "plant-analysis",
      analysis: analysisData,
      timestamp: new Date().toISOString(),
    };

    // Save the analysis data to Firestore
    const sanitizedData = sanitizeData(firestoreData);
    const docId = await saveCropAnalysis(sanitizedData);
    console.log("Plant analysis saved with ID:", docId);

    // Clean up the temporary file
    fs.unlinkSync(imageFile.filepath);

    // Return the analysis results
    return res.status(200).json({
      success: true,
      analysis: analysisData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Plant analysis error:", error);
    return res.status(500).json({
      error: "Failed to analyze plant image",
      details: error.message,
    });
  }
}

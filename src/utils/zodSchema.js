// utils/zodSchema.js
import { z } from "zod";

// Define default values for each sub-schema
const defaultRecommendations = {
  nutrientManagement: [
    "Conduct regular soil testing to monitor nutrient levels",
  ],
  waterManagement: ["Monitor soil moisture regularly"],
  soilHealth: ["Maintain organic matter content"],
  pestControl: ["Implement integrated pest management"],
};

const defaultChallenge = {
  challenge: "Standard agricultural challenges",
  mitigationStrategy: "Follow best practices for your region",
};

const defaultPlantingWindow = {
  season: "Growing season",
  startMonth: "Spring",
  endMonth: "Fall",
  notes: "Adjust based on local climate conditions",
};

const defaultYieldPotential = {
  minYield: 0,
  maxYield: 0,
  unit: "tons/hectare",
  notes: "Yield varies based on management practices",
};

// Define the schema with defaults
export const CropRecommendationSchema = z.object({
  suitabilityScore: z.number().min(1).max(10).default(5),
  recommendations: z
    .object({
      nutrientManagement: z
        .array(z.string())
        .min(1)
        .default(defaultRecommendations.nutrientManagement),
      waterManagement: z
        .array(z.string())
        .min(1)
        .default(defaultRecommendations.waterManagement),
      soilHealth: z
        .array(z.string())
        .min(1)
        .default(defaultRecommendations.soilHealth),
      pestControl: z
        .array(z.string())
        .min(1)
        .default(defaultRecommendations.pestControl),
    })
    .default(defaultRecommendations),
  challenges: z
    .array(
      z.object({
        challenge: z.string(),
        mitigationStrategy: z.string(),
      })
    )
    .min(1)
    .default([defaultChallenge]),
  plantingWindows: z
    .array(
      z.object({
        season: z.string(),
        startMonth: z.string(),
        endMonth: z.string(),
        notes: z.string(),
      })
    )
    .min(1)
    .default([defaultPlantingWindow]),
  yieldPotential: z
    .object({
      minYield: z.number(),
      maxYield: z.number(),
      unit: z.string(),
      notes: z.string(),
    })
    .default(defaultYieldPotential),
});

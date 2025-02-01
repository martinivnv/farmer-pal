// components/crop/CropAnalysisResults.js
"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function CropAnalysisResults({ results, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) return null;

  const { environmentalData, recommendations } = results;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-semibold">Analysis Results</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Environmental Conditions</h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Elevation</dt>
              <dd>{environmentalData.elevation.toFixed(1)}m</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Soil pH</dt>
              <dd>{environmentalData.soilQuality.ph}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Average Rainfall
              </dt>
              <dd>{environmentalData.climate.averageRainfall}mm/year</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Growing Season
              </dt>
              <dd>{environmentalData.climate.growingSeasonLength} days</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">AI Recommendations</h3>
          <div className="prose prose-sm max-w-none">
            {recommendations.rawAnalysis.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

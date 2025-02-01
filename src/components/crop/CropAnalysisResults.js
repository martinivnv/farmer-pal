"use client";
// components/crop/CropAnalysisResults.js

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

  if (!results?.recommendations?.analysis) return null;

  const { analysis } = results.recommendations;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Suitability Score */}
          <div>
            <h3 className="text-lg font-medium mb-2">Suitability Score</h3>
            <div className="text-3xl font-bold text-blue-600">
              {analysis.suitabilityScore}/10
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-lg font-medium mb-2">Key Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(analysis.recommendations).map(([key, items]) => (
                <div key={key} className="space-y-2">
                  <h4 className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {items.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div>
            <h3 className="text-lg font-medium mb-2">Challenges & Solutions</h3>
            <div className="space-y-3">
              {analysis.challenges.map((item, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-red-600">{item.challenge}</p>
                  <p className="text-sm mt-1">{item.mitigationStrategy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Planting Windows */}
          <div>
            <h3 className="text-lg font-medium mb-2">Planting Windows</h3>
            <div className="space-y-2">
              {analysis.plantingWindows.map((window, index) => (
                <div key={index} className="bg-green-50 p-3 rounded-lg">
                  <p className="font-medium text-green-700">{window.season}</p>
                  <p className="text-sm">
                    {window.startMonth} - {window.endMonth}
                  </p>
                  {window.notes && (
                    <p className="text-sm mt-1 text-gray-600">{window.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Yield Potential */}
          <div>
            <h3 className="text-lg font-medium mb-2">Yield Potential</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xl font-bold text-blue-700">
                {analysis.yieldPotential.minYield} -{" "}
                {analysis.yieldPotential.maxYield}{" "}
                {analysis.yieldPotential.unit}
              </p>
              {analysis.yieldPotential.notes && (
                <p className="text-sm mt-2">{analysis.yieldPotential.notes}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

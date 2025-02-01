"use client";
// components/crop/CropDashboardClient.js
import { useState } from "react";
import CropLocationForm from "./CropLocationForm";
import CropAnalysisResults from "./CropAnalysisResults";
import CropLocationMap from "./CropLocationMap";

export default function CropDashboardClient() {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleAnalysisSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create the request payload
      const payload = {
        ...formData,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        radius: formData.radius || 1000, // default radius if not provided
        cropType: formData.cropType,
      };

      const response = await fetch("/api/crop-location-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze location");
      }

      setAnalysisResults(data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to process the request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <CropLocationForm
          onSubmit={handleAnalysisSubmit}
          selectedLocation={selectedLocation}
          isLoading={isLoading}
        />

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
        )}

        {analysisResults && (
          <CropAnalysisResults
            results={analysisResults}
            isLoading={isLoading}
          />
        )}
      </div>

      <div className="h-[calc(100vh-12rem)]">
        <CropLocationMap
          onLocationSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
        />
      </div>
    </div>
  );
}

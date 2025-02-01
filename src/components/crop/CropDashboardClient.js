"use client";
// components/crop/CropDashboardClient.js
import { useState } from "react";
import dynamic from "next/dynamic";
import CropLocationForm from "./CropLocationForm";
import CropAnalysisResults from "./CropAnalysisResults";

// Dynamically import the map component to avoid SSR issues
const CropLocationMap = dynamic(() => import("./CropLocationMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg" />
  ),
});

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
      const response = await fetch("/api/crop-location-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...selectedLocation,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze location");
      }

      const data = await response.json();
      setAnalysisResults(data);
    } catch (err) {
      setError(err.message);
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

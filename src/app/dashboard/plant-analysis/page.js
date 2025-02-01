"use client";

import { Upload } from "@/components/plant-detect/upload";
import HistoricPlants from "@/components/plant-detect/HistoricPlants";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 w-full">
      {/* Full-width header and upload area */}
      <div className="w-full px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Plant Disease Analysis</h2>
          <p className="text-lg">
            Upload an image of your crop for AI-powered disease detection and
            health analysis
          </p>
        </div>
        <div className="w-full">
          <Upload />
        </div>
      </div>

      {/* Full-width Historic Plants section */}
      <div className="w-full mt-10 px-4">
        <HistoricPlants />
      </div>
    </div>
  );
}

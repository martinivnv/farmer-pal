"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";

export function Upload() {
  const [analysis, setAnalysis] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setAnalysis(null);
      setError(null);
    }
  };

  // In your Upload component's handleUpload function
  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/image-detection/analyze", {
        // Make sure this matches your API endpoint path
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze image");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Plant Disease Analysis</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            {previewUrl ? (
              <div className="relative w-full h-64">
                <Image
                  src={previewUrl}
                  alt="Selected plant"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Click or drag to upload a plant image for analysis
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Plant"
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-4 mt-6">
            {/* Health Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold">Overall Health</h3>
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <span>Status: {analysis.healthStatus.overall}</span>
                  <span className="font-bold">
                    Score: {analysis.healthStatus.score}/10
                  </span>
                </div>
                <p className="mt-2 text-gray-600">
                  {analysis.healthStatus.description}
                </p>
              </div>
            </div>

            {/* Diseases */}
            {analysis.diseases.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold">Detected Issues</h3>
                <div className="space-y-3 mt-2">
                  {analysis.diseases.map((disease, index) => (
                    <div key={index} className="border-l-4 border-red-400 pl-3">
                      <p className="font-medium">{disease.name}</p>
                      <p className="text-sm text-gray-600">
                        Confidence: {disease.confidence}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Treatment:</p>
                        <ul className="list-disc list-inside text-sm">
                          {disease.treatment.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Growth Stage */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold">Growth Stage</h3>
              <p className="mt-1">{analysis.growthStage.stage}</p>
              <div className="mt-2">
                <p className="text-sm font-medium">Recommendations:</p>
                <ul className="list-disc list-inside text-sm">
                  {analysis.growthStage.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Care Recommendations */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold">Care Recommendations</h3>
              <ul className="list-disc list-inside mt-2 text-sm">
                {analysis.careRecommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

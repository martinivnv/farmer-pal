"use client";
// components/pest-detect/upload.js
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, AlertCircle, Loader2, Bug } from "lucide-react";
import Image from "next/image";

export function PestUpload() {
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

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/image-detection/pest-analyze", {
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="pest-image-upload"
            />
            <label
              htmlFor="pest-image-upload"
              className="flex flex-col items-center justify-center cursor-pointer h-64"
            >
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={previewUrl}
                    alt="Pest image"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <Bug className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Click or drag to upload an image of the pest or affected
                    area
                  </p>
                </div>
              )}
            </label>
          </div>

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
              "Identify Pest"
            )}
          </Button>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        <div className="space-y-4">
          {analysis ? (
            <>
              {/* Pest Identification */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold">Identified Pest</h3>
                <div className="mt-2">
                  <p className="font-medium">{analysis.pestInfo.name}</p>
                  <p className="text-sm text-gray-600">
                    Confidence: {analysis.pestInfo.confidence}
                  </p>
                  <p className="mt-2 text-gray-600">
                    {analysis.pestInfo.description}
                  </p>
                </div>
              </div>

              {/* Threat Level */}
              <div
                className={`p-4 rounded-lg ${
                  analysis.threatLevel === "High"
                    ? "bg-red-50"
                    : analysis.threatLevel === "Medium"
                    ? "bg-yellow-50"
                    : "bg-green-50"
                }`}
              >
                <h3 className="font-semibold">Threat Level</h3>
                <div className="mt-2">
                  <p className="font-medium">{analysis.threatLevel}</p>
                  <p className="text-sm mt-1">{analysis.threatDescription}</p>
                </div>
              </div>

              {/* Control Measures */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold">Control Measures</h3>
                <div className="space-y-3 mt-2">
                  {analysis.controlMeasures.map((measure, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-400 pl-3"
                    >
                      <p className="font-medium">{measure.type}</p>
                      <ul className="list-disc list-inside text-sm mt-1">
                        {measure.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prevention Tips */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold">Prevention Strategies</h3>
                <ul className="list-disc list-inside mt-2 text-sm">
                  {analysis.preventionTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Additional Resources */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold">Additional Information</h3>
                <ul className="list-disc list-inside mt-2 text-sm">
                  {analysis.additionalResources.map((resource, index) => (
                    <li key={index}>{resource}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Upload an image to identify and analyze pests
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "@/components/plant-detect/upload";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Plant Disease Analysis</CardTitle>
            <CardDescription className="text-lg">
              Upload an image of your crop for AI-powered disease detection and
              health analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-6">
              {/* Remove the Card wrapper from Upload component */}
              <Upload />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

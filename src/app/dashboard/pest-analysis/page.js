"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PestUpload } from "@/components/pest-detect/upload";

export default function PestAnalysisPage() {
  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Pest Detection & Analysis
        </h2>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardDescription className="text-lg">
            Upload an image to identify pests and get detailed mitigation
            strategies and control measures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PestUpload />
        </CardContent>
      </Card>
    </div>
  );
}

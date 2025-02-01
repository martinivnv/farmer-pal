"use client";

import { AlertCircle, Bug } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FarmMap() {
  // Mock data for farm plots and issues - adjusted coordinates for visibility
  const farmPlots = [
    {
      id: 1,
      path: "M200,200 L400,200 L400,400 L200,400 Z",
      name: "North Field",
      crop: "Corn",
    },
    {
      id: 2,
      path: "M450,250 L650,250 L650,450 L450,450 Z",
      name: "East Field",
      crop: "Soybeans",
    },
  ];

  const issues = [
    {
      id: 1,
      x: 300,
      y: 250,
      type: "disease",
      description: "Leaf Blight detected",
      severity: "high",
    },
    {
      id: 2,
      x: 550,
      y: 350,
      type: "pest",
      description: "Aphid infestation",
      severity: "medium",
    },
    {
      id: 3,
      x: 280,
      y: 380,
      type: "pest",
      description: "Corn rootworm activity",
      severity: "low",
    },
  ];

  return (
    <div className="relative h-full w-full bg-[#1a1a1a]">
      {/* Updated iframe for satellite view of a farm-sized area in Ghana */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3971.738!2d-1.713479!3d7.526123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sgh!4v1635787415478!5m2!1sen!2sgh&z=20&t=k&disableDefaultUI=true"
        className="h-full w-full border-0"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ pointerEvents: "none" }}
      />

      {/* SVG Overlay with improved visibility */}
      <div className="absolute inset-0 pointer-events-none">
        <TooltipProvider>
          <svg
            className="h-full w-full"
            viewBox="0 0 800 600"
            preserveAspectRatio="none"
          >
            {/* Farm plot boundaries */}
            {farmPlots.map((plot) => (
              <Tooltip key={plot.id}>
                <TooltipTrigger asChild>
                  <path
                    d={plot.path}
                    fill="rgba(0, 255, 0, 0.15)"
                    stroke="rgba(0, 255, 0, 0.6)"
                    strokeWidth="3"
                    className="pointer-events-auto cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{plot.name}</p>
                  <p className="text-sm">Crop: {plot.crop}</p>
                </TooltipContent>
              </Tooltip>
            ))}

            {/* Issue indicators */}
            {issues.map((issue) => (
              <Tooltip key={issue.id}>
                <TooltipTrigger asChild>
                  <g
                    transform={`translate(${issue.x}, ${issue.y})`}
                    className="pointer-events-auto cursor-pointer"
                  >
                    {issue.type === "disease" ? (
                      <circle
                        r="12"
                        fill="rgba(255, 0, 0, 0.3)"
                        stroke="rgba(255, 0, 0, 0.8)"
                        strokeWidth="3"
                      />
                    ) : (
                      <circle
                        r="12"
                        fill="rgba(255, 165, 0, 0.3)"
                        stroke="rgba(255, 165, 0, 0.8)"
                        strokeWidth="3"
                      />
                    )}
                    {issue.type === "disease" ? (
                      <AlertCircle className="h-6 w-6 text-red-500 -translate-x-3 -translate-y-3" />
                    ) : (
                      <Bug className="h-6 w-6 text-orange-500 -translate-x-3 -translate-y-3" />
                    )}
                  </g>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold capitalize">{issue.type} Alert</p>
                  <p className="text-sm">{issue.description}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    Severity: {issue.severity}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </svg>
        </TooltipProvider>
      </div>
    </div>
  );
}

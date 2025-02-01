"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function HistoricCropPlanningData() {
  const [cropPlans, setCropPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchCropPlans() {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/crop-location-planner/get-crop-data?limit=100`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch crop plans");
        }

        const data = await response.json();
        setCropPlans(data);
      } catch (err) {
        console.error("Error fetching crop plans:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCropPlans();
  }, []);

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPlans = cropPlans.slice(startIndex, endIndex);
  const totalPages = Math.ceil(cropPlans.length / itemsPerPage);

  const toggleRow = (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading crop planning data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Historic Crop Planning Data</h2>

      {cropPlans.length === 0 ? (
        <p className="text-gray-500">No crop plans found.</p>
      ) : (
        <>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Crop Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Suitability Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPlans.map((plan) => {
                  // Create a Date from the plan timestamp.
                  // The API returns an object with seconds and nanoseconds.
                  const planDate =
                    plan.timestamp && plan.timestamp.seconds
                      ? new Date(plan.timestamp.seconds * 1000)
                      : new Date(plan.timestamp);
                  return (
                    <React.Fragment key={plan.id}>
                      <TableRow>
                        <TableCell>{format(planDate, "PPP")}</TableCell>
                        <TableCell>{plan.cropType || "N/A"}</TableCell>
                        <TableCell>
                          {plan.location ? (
                            <>
                              Lat: {plan.location.latitude}, Long:{" "}
                              {plan.location.longitude}
                            </>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          {plan.recommendations &&
                          plan.recommendations.analysis &&
                          plan.recommendations.analysis.suitabilityScore !==
                            undefined
                            ? plan.recommendations.analysis.suitabilityScore
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleRow(plan.id)}
                          >
                            {expandedRows.includes(plan.id)
                              ? "Hide Details"
                              : "View Details"}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expanded row with detailed data */}
                      {expandedRows.includes(plan.id) && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <div className="p-4 bg-gray-50 rounded">
                              {/* Environmental Data */}
                              <div className="mb-2">
                                <h3 className="font-semibold">
                                  Environmental Data
                                </h3>
                                {plan.environmentalData ? (
                                  <div className="ml-4">
                                    <div>
                                      <strong>Soil Quality:</strong>{" "}
                                      {plan.environmentalData.soilQuality
                                        ? `Organic Matter: ${plan.environmentalData.soilQuality.organicMatter}, pH: ${plan.environmentalData.soilQuality.ph}, Nitrogen: ${plan.environmentalData.soilQuality.nitrogen}, Phosphorus: ${plan.environmentalData.soilQuality.phosphorus}, Potassium: ${plan.environmentalData.soilQuality.potassium}`
                                        : "N/A"}
                                    </div>
                                    <div>
                                      <strong>Terrain:</strong>{" "}
                                      {plan.environmentalData.terrain
                                        ? `Aspect: ${plan.environmentalData.terrain.aspect}, Slope: ${plan.environmentalData.terrain.slope}, Drainage: ${plan.environmentalData.terrain.drainageClass}`
                                        : "N/A"}
                                    </div>
                                    <div>
                                      <strong>Climate:</strong>{" "}
                                      {plan.environmentalData.climate
                                        ? `Average Rainfall: ${plan.environmentalData.climate.averageRainfall} mm, Average Temperature: ${plan.environmentalData.climate.averageTemperature}°C, Growing Season: ${plan.environmentalData.climate.growingSeasonLength} days`
                                        : "N/A"}
                                    </div>
                                    <div>
                                      <strong>Elevation:</strong>{" "}
                                      {plan.environmentalData.elevation ||
                                        "N/A"}
                                    </div>
                                  </div>
                                ) : (
                                  "N/A"
                                )}
                              </div>

                              {/* Location Details */}
                              <div className="mb-2">
                                <h3 className="font-semibold">
                                  Location Details
                                </h3>
                                {plan.location ? (
                                  <div className="ml-4">
                                    <div>
                                      <strong>Latitude:</strong>{" "}
                                      {plan.location.latitude}
                                    </div>
                                    <div>
                                      <strong>Longitude:</strong>{" "}
                                      {plan.location.longitude}
                                    </div>
                                    <div>
                                      <strong>Search Radius:</strong>{" "}
                                      {plan.location.searchRadius} m
                                    </div>
                                  </div>
                                ) : (
                                  "N/A"
                                )}
                              </div>

                              {/* Recommendations */}
                              <div className="mb-2">
                                <h3 className="font-semibold">
                                  Recommendations
                                </h3>
                                {plan.recommendations &&
                                plan.recommendations.analysis ? (
                                  <div className="ml-4">
                                    <div>
                                      <strong>Actions:</strong>
                                      {plan.recommendations.analysis
                                        .recommendations ? (
                                        <div className="ml-4">
                                          {Object.entries(
                                            plan.recommendations.analysis
                                              .recommendations
                                          ).map(([key, recs]) => (
                                            <div key={key}>
                                              <em>{key}:</em>{" "}
                                              {Array.isArray(recs)
                                                ? recs.join("; ")
                                                : Object.values(recs).join(
                                                    "; "
                                                  )}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        "N/A"
                                      )}
                                    </div>
                                    <div>
                                      <strong>Suitability Score:</strong>{" "}
                                      {
                                        plan.recommendations.analysis
                                          .suitabilityScore
                                      }
                                    </div>
                                    <div>
                                      <strong>Challenges:</strong>
                                      {plan.recommendations.analysis
                                        .challenges ? (
                                        <div className="ml-4">
                                          {Object.entries(
                                            plan.recommendations.analysis
                                              .challenges
                                          ).map(([key, challenge]) => (
                                            <div key={key}>
                                              {challenge.challenge} (Mitigation:{" "}
                                              {challenge.mitigationStrategy})
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        "N/A"
                                      )}
                                    </div>
                                    <div>
                                      <strong>Planting Windows:</strong>
                                      {plan.recommendations.analysis
                                        .plantingWindows ? (
                                        <div className="ml-4">
                                          {Object.entries(
                                            plan.recommendations.analysis
                                              .plantingWindows
                                          ).map(([key, window]) => (
                                            <div key={key}>
                                              {window.season}:{" "}
                                              {window.startMonth} -{" "}
                                              {window.endMonth} ({window.notes})
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        "N/A"
                                      )}
                                    </div>
                                    <div>
                                      <strong>Yield Potential:</strong>{" "}
                                      {plan.recommendations.analysis
                                        .yieldPotential
                                        ? `${plan.recommendations.analysis.yieldPotential.minYield} - ${plan.recommendations.analysis.yieldPotential.maxYield} ${plan.recommendations.analysis.yieldPotential.unit} (${plan.recommendations.analysis.yieldPotential.notes})`
                                        : "N/A"}
                                    </div>
                                  </div>
                                ) : (
                                  "N/A"
                                )}
                                <div>
                                  <strong>Recommendation Timestamp:</strong>{" "}
                                  {plan.recommendations &&
                                  plan.recommendations.timestamp
                                    ? format(
                                        new Date(
                                          plan.recommendations.timestamp
                                        ),
                                        "PPPpp"
                                      )
                                    : "N/A"}
                                </div>
                              </div>

                              {/* Other Metadata and Details */}
                              <div className="mb-2">
                                <h3 className="font-semibold">Other Details</h3>
                                <div className="ml-4">
                                  <div>
                                    <strong>Type:</strong> {plan.type || "N/A"}
                                  </div>
                                  {plan.metadata &&
                                    plan.metadata.locationDetails && (
                                      <div>
                                        <strong>Metadata - Elevation:</strong>{" "}
                                        {plan.metadata.locationDetails
                                          .elevation || "N/A"}
                                      </div>
                                    )}
                                  <div>
                                    <strong>ID:</strong> {plan.id}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

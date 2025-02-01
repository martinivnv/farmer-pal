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

export default function HistoricPlants() {
  const [plantData, setPlantData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchPlantData() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/image-detection/data/get-plant");
        if (!response.ok) {
          throw new Error("Failed to fetch plant data");
        }
        const data = await response.json();
        setPlantData(data);
      } catch (err) {
        console.error("Error fetching plant data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlantData();
  }, []);

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = plantData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(plantData.length / itemsPerPage);

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
        <p>Loading plant data...</p>
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
      <h2 className="text-2xl font-semibold">Historic Plant Disease Data</h2>
      {plantData.length === 0 ? (
        <p className="text-gray-500">No plant data found.</p>
      ) : (
        <>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Health Status</TableHead>
                  <TableHead>Disease</TableHead>
                  <TableHead>Growth Stage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((plant) => {
                  // Convert timestamp from seconds if available.
                  const plantDate =
                    plant.timestamp && plant.timestamp.seconds
                      ? new Date(plant.timestamp.seconds * 1000)
                      : new Date(plant.timestamp);
                  // Summary values: health status, first disease (if any), and growth stage.
                  const healthStatus =
                    plant.analysis?.healthStatus?.overall || "N/A";
                  const diseases = plant.analysis?.diseases
                    ? Object.values(plant.analysis.diseases)
                    : [];
                  const primaryDisease =
                    diseases.length > 0 ? diseases[0].name : "N/A";
                  const growthStage =
                    plant.analysis?.growthStage?.stage || "N/A";

                  return (
                    <React.Fragment key={plant.id}>
                      <TableRow>
                        <TableCell>{format(plantDate, "PPP")}</TableCell>
                        <TableCell>{healthStatus}</TableCell>
                        <TableCell>{primaryDisease}</TableCell>
                        <TableCell>{growthStage}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleRow(plant.id)}
                          >
                            {expandedRows.includes(plant.id)
                              ? "Hide Details"
                              : "View Details"}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedRows.includes(plant.id) && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <div className="p-4 bg-gray-50 rounded">
                              {/* Health Status Details */}
                              <div>
                                <strong>Health Status Details:</strong>
                                <p>
                                  <em>Overall:</em>{" "}
                                  {plant.analysis?.healthStatus?.overall ||
                                    "N/A"}
                                </p>
                                <p>
                                  <em>Score:</em>{" "}
                                  {plant.analysis?.healthStatus?.score || "N/A"}
                                </p>
                                <p>
                                  <em>Description:</em>{" "}
                                  {plant.analysis?.healthStatus?.description ||
                                    "N/A"}
                                </p>
                              </div>

                              {/* Diseases */}
                              {plant.analysis?.diseases && (
                                <div className="mt-2">
                                  <strong>Diseases Detected:</strong>
                                  {Object.entries(plant.analysis.diseases).map(
                                    ([key, disease]) => (
                                      <div key={key} className="ml-4 mt-1">
                                        <p>
                                          <em>Name:</em> {disease.name}
                                        </p>
                                        <p>
                                          <em>Confidence:</em>{" "}
                                          {disease.confidence}
                                        </p>
                                        <p>
                                          <em>Symptoms:</em>{" "}
                                          {disease.symptoms
                                            ? Object.values(
                                                disease.symptoms
                                              ).join("; ")
                                            : "N/A"}
                                        </p>
                                        <p>
                                          <em>Treatment:</em>{" "}
                                          {disease.treatment
                                            ? Object.values(
                                                disease.treatment
                                              ).join("; ")
                                            : "N/A"}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}

                              {/* Nutrient Issues */}
                              {plant.analysis?.nutrientIssues && (
                                <div className="mt-2">
                                  <strong>Nutrient Issues:</strong>
                                  {Object.entries(
                                    plant.analysis.nutrientIssues
                                  ).map(([key, issue]) => (
                                    <div key={key} className="ml-4 mt-1">
                                      <p>
                                        <em>Deficiency:</em> {issue.deficiency}
                                      </p>
                                      <p>
                                        <em>Symptoms:</em>{" "}
                                        {issue.symptoms
                                          ? Object.values(issue.symptoms).join(
                                              "; "
                                            )
                                          : "N/A"}
                                      </p>
                                      <p>
                                        <em>Treatment:</em>{" "}
                                        {issue.treatment
                                          ? Object.values(issue.treatment).join(
                                              "; "
                                            )
                                          : "N/A"}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Growth Stage */}
                              {plant.analysis?.growthStage && (
                                <div className="mt-2">
                                  <strong>Growth Stage:</strong>
                                  <p>
                                    <em>Stage:</em>{" "}
                                    {plant.analysis.growthStage.stage}
                                  </p>
                                  <p>
                                    <em>Characteristics:</em>{" "}
                                    {plant.analysis.growthStage.characteristics
                                      ? Object.values(
                                          plant.analysis.growthStage
                                            .characteristics
                                        ).join("; ")
                                      : "N/A"}
                                  </p>
                                  <p>
                                    <em>Recommendations:</em>{" "}
                                    {plant.analysis.growthStage.recommendations
                                      ? Object.values(
                                          plant.analysis.growthStage
                                            .recommendations
                                        ).join("; ")
                                      : "N/A"}
                                  </p>
                                </div>
                              )}

                              {/* Care Recommendations */}
                              {plant.analysis?.careRecommendations && (
                                <div className="mt-2">
                                  <strong>Care Recommendations:</strong>
                                  <ul className="list-disc list-inside">
                                    {Object.values(
                                      plant.analysis.careRecommendations
                                    ).map((rec, index) => (
                                      <li key={index}>{rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
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

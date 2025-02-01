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

export default function HistoricPests() {
  const [pestData, setPestData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchPestData() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/image-detection/data/get-pest");
        if (!response.ok) {
          throw new Error("Failed to fetch pest data");
        }
        const data = await response.json();
        setPestData(data);
      } catch (err) {
        console.error("Error fetching pest data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPestData();
  }, []);

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = pestData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(pestData.length / itemsPerPage);

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
        <p>Loading pest data...</p>
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
      <h2 className="text-2xl font-semibold">Historic Pest Data</h2>
      {pestData.length === 0 ? (
        <p className="text-gray-500">No pest data found.</p>
      ) : (
        <>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Pest Name</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Threat Level</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((pest) => {
                  // Convert the timestamp from seconds if available.
                  const pestDate =
                    pest.timestamp && pest.timestamp.seconds
                      ? new Date(pest.timestamp.seconds * 1000)
                      : new Date(pest.timestamp);
                  return (
                    <React.Fragment key={pest.id}>
                      <TableRow>
                        <TableCell>{format(pestDate, "PPP")}</TableCell>
                        <TableCell>{pest.pestInfo?.name || "N/A"}</TableCell>
                        <TableCell>
                          {pest.pestInfo?.confidence || "N/A"}
                        </TableCell>
                        <TableCell>{pest.threatLevel || "N/A"}</TableCell>
                        <TableCell>{pest.location || "N/A"}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleRow(pest.id)}
                          >
                            {expandedRows.includes(pest.id)
                              ? "Hide Details"
                              : "View Details"}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expanded row with additional details */}
                      {expandedRows.includes(pest.id) && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <div className="p-4 bg-gray-50 rounded">
                              <p>
                                <strong>Description:</strong>{" "}
                                {pest.pestInfo?.description || "N/A"}
                              </p>
                              <p>
                                <strong>Scientific Name:</strong>{" "}
                                {pest.pestInfo?.scientificName || "N/A"}
                              </p>
                              <div className="mt-2">
                                <strong>Control Measures:</strong>
                                {pest.controlMeasures ? (
                                  <ul className="list-disc list-inside">
                                    {Object.entries(pest.controlMeasures).map(
                                      ([key, measure]) => (
                                        <li key={key}>
                                          <strong>{measure.type}:</strong>{" "}
                                          {Object.values(measure.steps).join(
                                            "; "
                                          )}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  " N/A"
                                )}
                              </div>
                              <div className="mt-2">
                                <strong>Prevention Tips:</strong>
                                {pest.preventionTips ? (
                                  <ul className="list-disc list-inside">
                                    {Object.values(pest.preventionTips).map(
                                      (tip, index) => (
                                        <li key={index}>{tip}</li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  " N/A"
                                )}
                              </div>
                              <div className="mt-2">
                                <strong>Additional Resources:</strong>
                                {pest.additionalResources ? (
                                  <ul className="list-disc list-inside">
                                    {Object.values(
                                      pest.additionalResources
                                    ).map((resource, index) => (
                                      <li key={index}>{resource}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  " N/A"
                                )}
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

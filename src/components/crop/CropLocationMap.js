"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Card } from "@/components/ui/card";

export default function CropLocationMap({
  onLocationSelect,
  selectedLocation,
}) {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markerRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Get user's location or use a default location
  useEffect(() => {
    if (!isMapLoaded) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          initializeMap(userLocation);
        },
        () => {
          // Fallback to a default location if geolocation fails
          initializeMap({ lat: -13.977843, lng: 33.768872 }); // Default to Malawi -13.977843, 33.768872
        }
      );
    }
  }, [isMapLoaded]);

  const initializeMap = async (initialLocation) => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    try {
      const { Map } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement } = await loader.importLibrary("marker");

      const map = new Map(mapRef.current, {
        center: selectedLocation || initialLocation,
        zoom: 8,
        mapId: "YOUR_MAP_ID", // Optional: Add your map style ID
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: false,
      });
      googleMapRef.current = map;

      if (selectedLocation) {
        markerRef.current = new AdvancedMarkerElement({
          map,
          position: selectedLocation,
        });
      }

      map.addListener("click", (e) => {
        const location = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        onLocationSelect(location);

        if (markerRef.current) {
          markerRef.current.position = location;
        } else {
          markerRef.current = new AdvancedMarkerElement({
            map,
            position: location,
          });
        }
      });

      setIsMapLoaded(true);
    } catch (error) {
      console.error("Error loading Google Maps:", error);
    }
  };

  // Update marker position when selectedLocation changes
  useEffect(() => {
    if (googleMapRef.current && selectedLocation) {
      googleMapRef.current.setCenter(selectedLocation);

      if (markerRef.current) {
        markerRef.current.position = selectedLocation;
      }
    }
  }, [selectedLocation]);

  return (
    <Card className="h-full">
      <div
        ref={mapRef}
        className="w-full h-[calc(100vh-14rem)] rounded-lg"
        style={{
          minHeight: "600px",
        }}
      />
    </Card>
  );
}

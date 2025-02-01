// components/crop/CropLocationMap.js
"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Card } from "@/components/ui/card";

export default function CropLocationMap({
  onLocationSelect,
  selectedLocation,
}) {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    loader.load().then(() => {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.006 }, // Default to NYC
        zoom: 8,
      });
      googleMapRef.current = map;

      map.addListener("click", (e) => {
        const location = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        onLocationSelect(location);

        if (markerRef.current) {
          markerRef.current.setPosition(location);
        } else {
          markerRef.current = new google.maps.Marker({
            position: location,
            map: map,
          });
        }
      });
    });
  }, [onLocationSelect]);

  return (
    <Card className="h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </Card>
  );
}

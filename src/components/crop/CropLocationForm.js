// components/crop/CropLocationForm.js
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const CROP_TYPES = [
  'Corn',
  'Wheat',
  'Soybeans',
  'Rice',
  'Potatoes',
  'Tomatoes',
  'Cotton',
  'Other'
];

export default function CropLocationForm({ onSubmit, selectedLocation, isLoading }) {
  const [formData, setFormData] = useState({
    cropType: '',
    radius: 1000, // Default radius in meters
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLocation) {
      alert('Please select a location on the map');
      return;
    }
    onSubmit({ ...formData, ...selectedLocation });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-semibold">Analysis Parameters</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Crop Type</label>
            <Select
              value={formData.cropType}
              onValueChange={(value) => setFormData({ ...formData, cropType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                {CROP_TYPES.map((crop) => (
                  <SelectItem key={crop} value={crop.toLowerCase()}>
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Search Radius (meters)</label>
            <Input
              type="number"
              value={formData.radius}
              onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })}
              min="100"
              max="5000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Selected Location</label>
            {selectedLocation ? (
              <div className="text-sm">
                Lat: {selectedLocation.lat.toFixed(6)}, 
                Lng: {selectedLocation.lng.toFixed(6)}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Click on the map to select a location
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || !selectedLocation || !formData.cropType}
            className="w-full"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Location'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// components/crop/CropLocationMap.js
'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card } from '@/components/ui/card';

export default function CropLocationMap({ onLocationSelect, selectedLocation }) {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });

    loader.load().then(() => {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        zoom: 8,
      });
      googleMapRef.current = map;

      map.addListener('click', (e) => {
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


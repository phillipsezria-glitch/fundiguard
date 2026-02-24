'use client';

import { useState, useEffect, useRef } from 'react';
import { NAIROBI_LOCATIONS, getLocationSuggestions, geocodeAddress, reverseGeocodeCoordinates, type Location } from '../lib/maps';

interface LocationPickerProps {
  value: string;
  onChange: (location: string) => void;
  onCoordinatesChange?: (coords: { lat: number; lng: number } | null) => void;
}

export default function LocationPicker({
  value,
  onChange,
  onCoordinatesChange,
}: LocationPickerProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [geocodingSuggestions, setGeocodingSuggestions] = useState<Array<{
    name: string;
    lat: number;
    lng: number;
  }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Handle input change with geocoding
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (newValue.length > 1) {
      setLoading(true);

      // Get local suggestions first
      const localMatches = getLocationSuggestions(newValue);
      setSuggestions(localMatches);

      // Get geocoding results
      try {
        const results = await geocodeAddress(newValue);
        setGeocodingSuggestions(results.map(r => ({
          name: r.name,
          lat: r.lat,
          lng: r.lng,
        })));
      } catch (error) {
        console.error('Geocoding error:', error);
      }

      setShowSuggestions(true);
      setLoading(false);
    } else {
      setSuggestions([]);
      setGeocodingSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSelectSuggestion = (location: string, coords?: { lat: number; lng: number }) => {
    onChange(location);
    setSuggestions([]);
    setGeocodingSuggestions([]);
    setShowSuggestions(false);

    if (coords) {
      if (onCoordinatesChange) {
        onCoordinatesChange(coords);
      }
      // Update map marker if loaded
      if (mapRef.current && markerRef.current) {
        updateMapMarker(coords);
      }
    } else {
      const storedCoords = NAIROBI_LOCATIONS[location as keyof typeof NAIROBI_LOCATIONS];
      if (storedCoords && onCoordinatesChange) {
        onCoordinatesChange(storedCoords);
      }
      if (mapRef.current && markerRef.current && storedCoords) {
        updateMapMarker(storedCoords);
      }
    }
  };

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const L = await import('leaflet');
        
        // Default to Nairobi center
        const initialLocation = NAIROBI_LOCATIONS.Nairobi;

        if (!mapRef.current) {
          const map = L.map('locationPickerMap').setView(
            [initialLocation.lat, initialLocation.lng],
            12
          );

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(map);

          mapRef.current = map;

          // Handle map clicks to select location
          map.on('click', async (e: any) => {
            const { lat, lng } = e.latlng;
            updateMapMarker({ lat, lng });

            // Try to find nearest location
            let nearestLocation = 'Custom Location';
            let minDistance = Infinity;

            for (const [name, coords] of Object.entries(NAIROBI_LOCATIONS)) {
              const dist = Math.hypot(coords.lat - lat, coords.lng - lng);
              if (dist < minDistance && dist < 0.02) {
                minDistance = dist;
                nearestLocation = name;
              }
            }

            onChange(nearestLocation);
            if (onCoordinatesChange) {
              onCoordinatesChange({ lat, lng });
            }
          });
        }

        // Add initial marker if location provided
        if (value && NAIROBI_LOCATIONS[value as keyof typeof NAIROBI_LOCATIONS]) {
          const coords = NAIROBI_LOCATIONS[value as keyof typeof NAIROBI_LOCATIONS];
          updateMapMarker(coords);
        }

        setMapLoaded(true);
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    const timer = setTimeout(initializeMap, 100);
    return () => clearTimeout(timer);
  }, []);

  // Update marker on location change
  useEffect(() => {
    if (mapRef.current && value) {
      const coords = NAIROBI_LOCATIONS[value as keyof typeof NAIROBI_LOCATIONS];
      if (coords) {
        mapRef.current.setView([coords.lat, coords.lng], 14);
        updateMapMarker(coords);
      }
    }
  }, [value]);

  // Helper to update marker
  const updateMapMarker = async (coords: { lat: number; lng: number }) => {
    try {
      const L = await import('leaflet');

      if (markerRef.current) {
        markerRef.current.remove();
      }

      markerRef.current = L.marker([coords.lat, coords.lng], {
        icon: L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      }).addTo(mapRef.current);

      markerRef.current.bindPopup(`📍 ${value || 'Selected Location'}`).openPopup();
    } catch (error) {
      console.error('Failed to update marker:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input Field */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📍 Select Location
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => value && setSuggestions(getLocationSuggestions(value))}
            placeholder="Search or click map below..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0 || geocodingSuggestions.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
              {loading && suggestions.length === 0 && geocodingSuggestions.length === 0 && (
                <div className="px-4 py-2 text-gray-500 text-sm">Searching...</div>
              )}

              {/* Local suggestions */}
              {suggestions.map((location) => (
                <button
                  key={location}
                  onClick={() => handleSelectSuggestion(location)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition border-b border-gray-100 text-sm"
                >
                  📍 {location}
                </button>
              ))}

              {/* Geocoded suggestions */}
              {geocodingSuggestions.map((result, idx) => (
                <button
                  key={`geocoded-${idx}`}
                  onClick={() =>
                    handleSelectSuggestion(result.name, {
                      lat: result.lat,
                      lng: result.lng,
                    })
                  }
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 transition border-b border-gray-100 text-sm"
                >
                  🌍 {result.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          💡 Click on the map below or type a location name
        </p>
      </div>

      {/* Interactive Map */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div
          id="locationPickerMap"
          className="w-full"
          style={{ height: '300px', background: '#f0f0f0' }}
        />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
            Loading map...
          </div>
        )}
      </div>

      {/* Quick Selection Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.keys(NAIROBI_LOCATIONS).slice(0, 8).map((location) => (
          <button
            key={location}
            onClick={() => handleSelectSuggestion(location)}
            className={`px-3 py-2 rounded text-sm font-medium transition ${
              value === location
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {location}
          </button>
        ))}
      </div>
    </div>
  );
}

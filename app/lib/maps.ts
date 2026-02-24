/**
 * Maps helper for location picking & visualization
 * Supports both Leaflet + OpenStreetMap (free) and Mapbox GL (premium)
 * Optimized for Kenya/Nairobi low-bandwidth environments
 */

export interface Location {
  lat: number;
  lng: number;
  name?: string;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  lat?: number;
  lng?: number;
  budget: number;
  category: string;
  distance?: number; // calculated distance in km
}

export interface GeocodingResult {
  name: string;
  lat: number;
  lng: number;
  type: 'place' | 'address' | 'local';
}

/**
 * Common Nairobi locations (seed data with coordinates)
 */
export const NAIROBI_LOCATIONS = {
  "South C": { lat: -1.3158, lng: 36.7623 },
  Rongai: { lat: -1.4048, lng: 36.6946 },
  Kasarani: { lat: -1.2228, lng: 36.8333 },
  Westlands: { lat: -1.2762, lng: 36.8011 },
  "Karen/Langata": { lat: -1.3347, lng: 36.6722 },
  "Upper Hill": { lat: -1.3083, lng: 36.8058 },
  Kilimani: { lat: -1.3084, lng: 36.7746 },
  Nairobi: { lat: -1.2764, lng: 36.797 }, // City center
  Lavington: { lat: -1.2915, lng: 36.7738 },
  Hurlingham: { lat: -1.2989, lng: 36.7591 },
  "Garden Estate": { lat: -1.3253, lng: 36.7844 },
  Embakasi: { lat: -1.3146, lng: 36.9137 },
};

/**
 * Get coordinates from location name
 */
export function getLocationCoords(locationName: string): Location | null {
  const normalized = locationName.trim();
  for (const [name, coords] of Object.entries(NAIROBI_LOCATIONS)) {
    if (name.toLowerCase() === normalized.toLowerCase()) {
      return { ...coords, name };
    }
  }
  return null;
}

/**
 * Get location name suggestions by prefix
 */
export function getLocationSuggestions(prefix: string): string[] {
  const lower = prefix.toLowerCase();
  return Object.keys(NAIROBI_LOCATIONS)
    .filter(name => name.toLowerCase().startsWith(lower))
    .sort();
}

/**
 * Initialize Leaflet map (dynamic import for SSR safety)
 */
export async function initMap(containerId: string, initialLocation: Location) {
  try {
    const L = await import("leaflet");

    const map = L.map(containerId).setView([initialLocation.lat, initialLocation.lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    return map;
  } catch (error) {
    console.error("Failed to initialize map:", error);
    return null;
  }
}

/**
 * Add marker to map
 */
export async function addMarker(
  map: any,
  location: Location,
  title: string,
  options?: { color?: string; onClick?: () => void }
) {
  try {
    const L = await import("leaflet");

    const marker = L.marker([location.lat, location.lng], {
      title,
    }).addTo(map);

    marker.bindPopup(title);

    if (options?.onClick) {
      marker.on('click', options.onClick);
    }

    return marker;
  } catch (error) {
    console.error("Failed to add marker:", error);
  }
}

/**
 * Add circle overlay (radius indicator)
 */
export async function addRadiusCircle(
  map: any,
  location: Location,
  radiusKm: number,
  options?: { color?: string; opacity?: number }
) {
  try {
    const L = await import("leaflet");

    const circle = L.circle([location.lat, location.lng], {
      radius: radiusKm * 1000, // Convert km to meters
      color: options?.color || '#FF6D00',
      opacity: options?.opacity || 0.3,
      weight: 2,
      fillOpacity: 0.1,
    }).addTo(map);

    return circle;
  } catch (error) {
    console.error("Failed to add radius circle:", error);
  }
}

/**
 * Get user's current location (browser geolocation API)
 */
export async function getUserLocation(): Promise<Location | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        resolve(null);
      },
      { timeout: 5000, enableHighAccuracy: false } // Low power mode for low-bandwidth
    );
  });
}

/**
 * Calculate distance between two locations (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

/**
 * Filter jobs by distance from location
 */
export function filterJobsByDistance(
  jobs: Job[],
  centerLocation: Location,
  maxDistanceKm: number
): Job[] {
  return jobs
    .map(job => {
      if (!job.lat || !job.lng) {
        // Try to get coords from location name
        const coords = getLocationCoords(job.location);
        if (coords) {
          job.lat = coords.lat;
          job.lng = coords.lng;
        }
      }

      if (job.lat && job.lng) {
        const distance = calculateDistance(centerLocation, {
          lat: job.lat,
          lng: job.lng,
        });
        return { ...job, distance };
      }

      return job;
    })
    .filter(job => !job.distance || job.distance <= maxDistanceKm)
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

/**
 * Get map bounds for multiple locations
 */
export function getMapBounds(locations: Location[]) {
  if (!locations.length) return null;

  let minLat = locations[0].lat;
  let maxLat = locations[0].lat;
  let minLng = locations[0].lng;
  let maxLng = locations[0].lng;

  for (const loc of locations) {
    minLat = Math.min(minLat, loc.lat);
    maxLat = Math.max(maxLat, loc.lat);
    minLng = Math.min(minLng, loc.lng);
    maxLng = Math.max(maxLng, loc.lng);
  }

  return {
    southwest: { lat: minLat, lng: minLng },
    northeast: { lat: maxLat, lng: maxLng },
  };
}

/**
 * Geocode address to coordinates using Nominatim (free, no API key)
 * Falls back to local database if not found
 */
export async function geocodeAddress(query: string): Promise<GeocodingResult[]> {
  try {
    // Check local database first
    const localMatch = getLocationSuggestions(query);
    if (localMatch.length > 0) {
      const results: GeocodingResult[] = localMatch.map(name => {
        const coords = NAIROBI_LOCATIONS[name as keyof typeof NAIROBI_LOCATIONS];
        return {
          name,
          lat: coords.lat,
          lng: coords.lng,
          type: 'place',
        };
      });
      return results;
    }

    // Query Nominatim for broader results
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query + ', Nairobi, Kenya'
      )}&format=json&limit=5`
    );

    if (!response.ok) throw new Error('Nominatim request failed');

    const data = await response.json();
    return data.map((result: any) => ({
      name: result.display_name.split(',')[0],
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      type: result.type || 'address',
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

/**
 * Reverse geocode coordinates to address name
 * Uses Nominatim (free) with local database fallback
 */
export async function reverseGeocodeCoordinates(
  lat: number,
  lng: number
): Promise<string | null> {
  try {
    // Check local database first
    for (const [name, coords] of Object.entries(NAIROBI_LOCATIONS)) {
      const distance = calculateDistance({ lat, lng }, { lat: coords.lat, lng: coords.lng });
      if (distance < 1) {
        // Within 1km of a known location
        return name;
      }
    }

    // Query Nominatim for address
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );

    if (!response.ok) throw new Error('Nominatim reverse request failed');

    const data = await response.json();
    return data.address?.neighbourhood ||
      data.address?.suburb ||
      data.address?.city_district ||
      data.address?.town ||
      data.name ||
      null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Initialize Mapbox GL map (premium option)
 */
export async function initMapboxMap(
  containerId: string,
  initialLocation: Location
) {
  try {
    const mbgl = await import('mapbox-gl');
    const mapboxgl = mbgl.default || mbgl;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      console.warn('Mapbox token not configured, falling back to Leaflet');
      return null;
    }

    (mapboxgl as any).accessToken = token;

    const map = new (mapboxgl as any).Map({
      container: containerId,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [initialLocation.lng, initialLocation.lat],
      zoom: 13,
    });

    return map;
  } catch (error) {
    console.error('Failed to initialize Mapbox:', error);
    return null;
  }
}

/**
 * Add Mapbox geocoder to map
 */
export async function addMapboxGeocoder(map: any) {
  try {
    // @ts-ignore - Missing type definitions for mapbox-gl-geocoder
    const MapboxGeocoder = await import('@mapbox/mapbox-gl-geocoder');
    const GeocoderClass = MapboxGeocoder.default || MapboxGeocoder;
    
    const geocoder = new GeocoderClass({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      placeholder: 'Search for a location...',
      proximity: [36.8, -1.3], // Nairobi coordinates
    });

    map.addControl(geocoder);
    return geocoder;
  } catch (error) {
    console.error('Failed to add geocoder:', error);
    return null;
  }
}

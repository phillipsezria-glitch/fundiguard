/**
 * Maps helper for location picking & visualization
 * Uses Leaflet + OpenStreetMap (free, no API key needed)
 */

export interface Location {
  lat: number;
  lng: number;
  name?: string;
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
  }
}

/**
 * Get user's current location (browser geolocation API)
 */
export async function getUserLocation(): Promise<Location | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
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
      }
    );
  });
}

/**
 * Calculate distance between two locations (Haversine formula)
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

// Common Nairobi locations (seed data)
export const NAIROBI_LOCATIONS = {
  "South C": { lat: -1.3158, lng: 36.7623 },
  Rongai: { lat: -1.4048, lng: 36.6946 },
  Kasarani: { lat: -1.2228, lng: 36.8333 },
  Westlands: { lat: -1.2762, lng: 36.8011 },
  "Karen/Langata": { lat: -1.3347, lng: 36.6722 },
  "Upper Hill": { lat: -1.3083, lng: 36.8058 },
  Kilimani: { lat: -1.3084, lng: 36.7746 },
  Nairobi: { lat: -1.2764, lng: 36.797 }, // City center
};

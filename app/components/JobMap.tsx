'use client';

import { useEffect, useState, useRef } from 'react';
import { filterJobsByDistance, getMapBounds, type Job, type Location } from '../lib/maps';

interface JobMapProps {
  jobs: Job[];
  onJobSelect?: (jobId: string) => void;
  userLocation?: Location;
  maxDistance?: number; // in km
}

export default function JobMap({
  jobs,
  onJobSelect,
  userLocation,
  maxDistance = 15,
}: JobMapProps) {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const L = await import('leaflet');

        if (!mapInstanceRef.current && mapRef.current) {
          // Default to Nairobi center
          const map = L.map(mapRef.current).setView([-1.286389, 36.817223], 11);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(map);

          mapInstanceRef.current = map;
          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initializeMap();
  }, []);

  // Filter and display jobs
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    let jobsToDisplay = jobs;

    // Filter by distance if user location provided
    if (userLocation && maxDistance) {
      jobsToDisplay = filterJobsByDistance(jobs, userLocation, maxDistance);
    }

    setFilteredJobs(jobsToDisplay);

    // Add markers for each job
    jobsToDisplay.forEach((job) => {
      if (job.lat && job.lng) {
        addJobMarker(job);
      }
    });

    // Fit map bounds to show all markers
    if (jobsToDisplay.length > 0) {
      const locations = jobsToDisplay
        .filter(j => j.lat && j.lng)
        .map((j) => ({
          lat: j.lat!,
          lng: j.lng!,
        }));

      if (userLocation) {
        locations.push(userLocation);
      }

      if (locations.length > 0) {
        fitMapBounds(locations);
      }
    }
  }, [jobs, userLocation, maxDistance, mapLoaded]);

  // Add marker for a job
  const addJobMarker = async (job: Job) => {
    try {
      const L = await import('leaflet');

      if (!job.lat || !job.lng) return;

      const markerColor = getCategoryColor(job.category);
      const iconHtml = `
        <div style="
          background-color: ${markerColor};
          color: white;
          border: 2px solid white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        ">
          📍
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([job.lat, job.lng], {
        icon: customIcon,
        title: job.title,
      }).addTo(mapInstanceRef.current);

      // Create popup content
      const distance = job.distance
        ? ` <br/> <span class="text-sm text-gray-600">📏 ${job.distance.toFixed(1)} km away</span>`
        : '';

      const popup = `
        <div class="p-2 max-w-xs">
          <h3 class="font-bold text-sm">${job.title}</h3>
          <p class="text-xs text-gray-600">${job.category}</p>
          <p class="text-xs text-green-600 font-semibold">KES ${job.budget}</p>
          ${distance}
          <button 
            onclick="window.jobMapEvent && window.jobMapEvent('${job.id}')"
            class="mt-2 w-full bg-green-600 text-white text-xs py-1 rounded hover:bg-green-700"
          >
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popup);

      // Click handler
      marker.on('click', () => {
        setSelectedJob(job.id);
        if (onJobSelect) {
          onJobSelect(job.id);
        }
      });

      markersRef.current.push(marker);
    } catch (error) {
      console.error('Failed to add marker:', error);
    }
  };

  // Fit map bounds to locations
  const fitMapBounds = async (locations: Location[]) => {
    try {
      const L = await import('leaflet');

      if (locations.length === 0) return;

      const bounds = getMapBounds(locations);
      if (bounds && mapInstanceRef.current) {
        mapInstanceRef.current.fitBounds(
          [
            [bounds.southwest.lat, bounds.southwest.lng],
            [bounds.northeast.lat, bounds.northeast.lng],
          ],
          { padding: [50, 50] }
        );
      }
    } catch (error) {
      console.error('Failed to fit bounds:', error);
    }
  };

  // Get color for category
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      plumbing: '#FF6D00',
      electrical: '#FFC400',
      carpentry: '#8B4513',
      cleaning: '#4CAF50',
      painting: '#2196F3',
      landscaping: '#81C784',
      repair: '#FF5252',
      construction: '#5D4037',
      masonry: '#A1887F',
      welding: '#37474F',
      default: '#666666',
    };
    return colors[category.toLowerCase()] || colors.default;
  };

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div
          ref={mapRef}
          className="w-full"
          style={{ height: '400px', background: '#f0f0f0' }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Total Jobs</p>
          <p className="text-2xl font-bold text-blue-600">{jobs.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">
            {maxDistance ? `Within ${maxDistance}km` : 'Visible'}
          </p>
          <p className="text-2xl font-bold text-green-600">{filteredJobs.length}</p>
        </div>
        {userLocation && (
          <>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Your Location</p>
              <p className="text-sm font-semibold text-orange-600">
                📍 {(userLocation.lat.toFixed(4))}, {(userLocation.lng.toFixed(4))}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Distance Range</p>
              <p className="text-sm font-semibold text-purple-600">
                {filteredJobs.length > 0
                  ? `${Math.min(...filteredJobs.map((j) => j.distance || 0)).toFixed(1)} - ${Math.max(...filteredJobs.map((j) => j.distance || 0)).toFixed(1)} km`
                  : 'N/A'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Category Legend */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-sm mb-3">Category Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {[
            { cat: 'Plumbing', color: '#FF6D00' },
            { cat: 'Electrical', color: '#FFC400' },
            { cat: 'Carpentry', color: '#8B4513' },
            { cat: 'Cleaning', color: '#4CAF50' },
            { cat: 'Painting', color: '#2196F3' },
            { cat: 'Landscaping', color: '#81C784' },
            { cat: 'Repair', color: '#FF5252' },
            { cat: 'Construction', color: '#5D4037' },
          ].map(({ cat, color }) => (
            <div key={cat} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-2">
            📍 Jobs Near You ({filteredJobs.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => {
                  setSelectedJob(job.id);
                  if (onJobSelect) onJobSelect(job.id);
                }}
                className={`p-3 border rounded-lg cursor-pointer transition ${
                  selectedJob === job.id
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{job.title}</h4>
                    <p className="text-xs text-gray-600">{job.category}</p>
                  </div>
                  {job.distance && (
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                      {job.distance.toFixed(1)} km
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-green-600 mt-1">
                  KES {job.budget}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredJobs.length === 0 && (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600 text-sm">
            {jobs.length === 0
              ? '📍 No jobs available yet'
              : `📍 No jobs within ${maxDistance}km of your location`}
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BidForm from '../components/BidForm';
import JobMap from '../components/JobMap';
import { api } from '../lib/api';
import { getUserLocation, type Location } from '../lib/maps';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  status: string;
  created_at: string;
  lat?: number;
  lng?: number;
  distance?: number;
}

export default function BrowseJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapView, setMapView] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [filterDistance, setFilterDistance] = useState(15);

  const categories = [
    'All',
    'Plumbing & Water',
    'Electrical & Wiring',
    'Carpentry & Furniture',
    'Painting & Decor',
    'Cleaning & Mama Fua',
    'Appliance Repair',
    'Auto & Boda Mechanics',
    'Home Tutors',
    'Beauty & Salon',
    'Gardening & Pest Control',
    'Caregivers',
    'Events & Other',
  ];

  // Location mapping for displaying jobs on map
  const locationCoordinates: Record<string, { lat: number; lng: number }> = {
    'South C': { lat: -1.3158, lng: 36.7623 },
    'Westlands': { lat: -1.2708, lng: 36.8062 },
    'Kilimani': { lat: -1.2831, lng: 36.7758 },
    'Embakasi': { lat: -1.3667, lng: 36.8833 },
    'Karen': { lat: -1.3667, lng: 36.6732 },
    'Langata': { lat: -1.3719, lng: 36.6732 },
    'Lavington': { lat: -1.2565, lng: 36.7965 },
    'Kasarani': { lat: -1.2417, lng: 36.8217 },
    'Rongai': { lat: -1.3842, lng: 36.8000 },
    'Nairobi': { lat: -1.286389, lng: 36.817223 },
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        if (!token) {
          setError('Please login to view available jobs');
          setLoading(false);
          return;
        }

        const response = await api.jobs.list(token);
        // Filter for open/available jobs and add coordinates
        const availableJobs = response.jobs
          .filter((job: Job) => job.status === 'open' || job.status === 'active')
          .map((job: Job) => {
            const coords = locationCoordinates[job.location as keyof typeof locationCoordinates];
            return {
              ...job,
              lat: coords?.lat,
              lng: coords?.lng,
            };
          });
        setJobs(availableJobs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    // Get user's browser location
    const getLocation = async () => {
      const location = await getUserLocation();
      if (location) {
        setUserLocation(location);
      }
    };

    fetchJobs();
    getLocation();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = categoryFilter === 'All' || job.category === categoryFilter;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  if (!isLoggedIn && !loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Jobs</h1>
            <p className="text-gray-600 mb-6">
              Please log in as a professional to browse and submit bids on jobs.
            </p>
            <button
              onClick={() => router.push('/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
            >
              Go to Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">🗺️ Available Jobs</h1>
              <p className="text-gray-600">
                Browse and submit bids on jobs matching your skills.
                {userLocation && ` (${filterDistance}km from you)`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setMapView(false)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  !mapView
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                📋 List
              </button>
              <button
                onClick={() => setMapView(true)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  mapView
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                🗺️ Map
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {mapView ? (
            <div>
              {/* Distance Filter for Map */}
              {userLocation && (
                <div className="mb-6 bg-white rounded-lg shadow p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🎯 Show jobs within {filterDistance}km
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={filterDistance}
                    onChange={(e) => setFilterDistance(Math.max(1, parseInt(e.target.value)))}
                    className="w-full"
                    style={{ accentColor: '#00C853' }}
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>1km</span>
                    <span>50km</span>
                  </div>
                </div>
              )}

              {/* Map Component */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <JobMap
                  jobs={filteredJobs}
                  onJobSelect={(jobId) => setSelectedJobId(jobId)}
                  userLocation={userLocation || undefined}
                  maxDistance={filterDistance}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>

                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Jobs
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by title..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Category
                    </label>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {categories.map(cat => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value={cat}
                            checked={categoryFilter === cat}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-4 h-4 accent-blue-600"
                          />
                          <span className="text-sm text-gray-700">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {selectedJobId ? (
                  <div className="bg-white rounded-lg shadow p-6">
                    {selectedJob && (
                      <div>
                        <button
                          onClick={() => setSelectedJobId(null)}
                          className="text-blue-600 hover:underline text-sm font-semibold mb-4"
                        >
                          ← Back to Jobs
                        </button>

                        <div className="mb-6">
                          <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                          <div className="flex flex-wrap gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Category</p>
                              <p className="font-semibold text-gray-900">{selectedJob.category}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Budget</p>
                              <p className="font-semibold text-gray-900">
                                KES {selectedJob.budget.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Location</p>
                              <p className="font-semibold text-gray-900">{selectedJob.location}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Posted</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(selectedJob.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
                          </div>
                        </div>

                        <BidForm
                          jobId={selectedJob.id}
                          jobBudget={selectedJob.budget}
                          onSuccess={() => {
                            setSelectedJobId(null);
                            router.push('/my-bids');
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : loading ? (
                  <div className="text-center text-gray-500 py-8">Loading jobs...</div>
                ) : filteredJobs.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-600 mb-4">
                      {jobs.length === 0
                        ? 'No jobs available yet. Check back soon!'
                        : 'No jobs match your filters.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredJobs.map(job => (
                      <div
                        key={job.id}
                        className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer ${
                          selectedJobId === job.id ? 'border-2 border-blue-600' : ''
                        }`}
                        onClick={() => setSelectedJobId(job.id)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                            <p className="text-sm text-gray-600">{job.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              KES {job.budget.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">Budget</p>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>📍 {job.location}</span>
                            {job.distance && (
                              <>
                                <span>•</span>
                                <span className="text-green-600 font-semibold">
                                  {job.distance.toFixed(1)}km
                                </span>
                              </>
                            )}
                            <span>•</span>
                            <span>{new Date(job.created_at).toLocaleDateString()}</span>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold text-sm">
                            View & Bid
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

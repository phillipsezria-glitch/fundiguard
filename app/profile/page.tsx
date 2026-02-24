'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../lib/api';

interface UserProfile {
  id: string;
  phone_number: string;
  full_name: string;
  role: 'client' | 'pro';
  bio?: string;
  location?: string;
  avatar_url?: string;
  rating?: number;
  total_jobs?: number;
  created_at?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');

        if (!token) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);
        const response = await api.users.getProfile(token);
        setProfile(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (!isLoggedIn && !loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
            <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center text-gray-500">
          Loading profile...
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
            <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
            >
              Back Home
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
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white mb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 shadow-lg">
                  {profile.full_name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()}
                </div>

                {/* User Info */}
                <div>
                  <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
                  <p className="text-blue-100 mb-3">
                    {profile.role === 'pro' ? '👨‍🔧 Professional' : '👤 Client'}
                  </p>
                  <p className="text-blue-100 mb-1">
                    📱 {profile.phone_number}
                  </p>
                  {profile.location && (
                    <p className="text-blue-100">📍 {profile.location}</p>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => router.push('/profile/edit')}
                className="bg-white text-blue-600 font-bold py-2 px-6 rounded-md hover:bg-blue-50 transition"
              >
                ✏️ Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Stats */}
          {profile.role === 'pro' && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Rating</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {profile.rating ? `${profile.rating.toFixed(1)} ⭐` : 'N/A'}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Total Jobs</p>
                <p className="text-3xl font-bold text-green-600">{profile.total_jobs || 0}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Member Since</p>
                <p className="text-sm font-semibold text-gray-900">
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          )}

          {/* Bio Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {profile.role === 'pro' ? '👥 About' : '📋 Account Info'}
            </h2>
            {profile.bio ? (
              <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
            ) : (
              <p className="text-gray-500 italic">
                {profile.role === 'pro'
                  ? 'No bio added yet. Click Edit to add one!'
                  : 'No additional information'}
              </p>
            )}
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Type</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {profile.role === 'pro' ? 'Professional (Fundi)' : 'Client'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                <p className="font-semibold text-gray-900">{profile.phone_number}</p>
              </div>
              {profile.location && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">{profile.location}</p>
                </div>
              )}
              {profile.created_at && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push(profile.role === 'pro' ? '/my-bids' : '/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition"
            >
              {profile.role === 'pro' ? '📝 My Bids' : '📋 My Jobs'}
            </button>
            <button
              onClick={() => router.push('/profile/edit')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-md transition"
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

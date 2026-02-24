'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PhotoUploader from '../../components/PhotoUploader';
import { api, auth } from '../../lib/api';
import { useAuthProtected } from '../../lib/useAuthProtected';

interface EditProfileForm {
  full_name: string;
  location?: string;
  bio?: string;
  profile_photo_url?: string;
}

export default function EditProfilePage() {
  useAuthProtected(); // Protect this route
  
  const router = useRouter();
  const [formData, setFormData] = useState<EditProfileForm>({
    full_name: '',
    location: '',
    bio: '',
    profile_photo_url: '',
  });
  const [profilePhotos, setProfilePhotos] = useState<Array<{ url: string; path: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
        setFormData({
          full_name: response.full_name || '',
          location: response.location || '',
          bio: response.bio || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      const token = auth.getToken();
      if (!token) {
        throw new Error('Please login to update your profile');
      }

      // Prepare profile data
      const profileData: any = {
        full_name: formData.full_name,
        location: formData.location,
        bio: formData.bio,
      };

      // Add profile photo if one was uploaded
      if (profilePhotos.length > 0) {
        profileData.profile_photo_url = profilePhotos[0].url;
      }

      // Call profile update API endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/users/profile`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn && !loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Edit Profile</h1>
            <p className="text-gray-600 mb-6">Please log in to edit your profile.</p>
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
          Loading...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push('/profile')}
            className="text-blue-600 hover:underline text-sm font-semibold mb-6"
          >
            ← Back to Profile
          </button>

          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Your Profile</h1>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                ✅ Profile updated successfully! Redirecting...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📷 Profile Photo
                </label>
                {formData.profile_photo_url && (
                  <div style={{ marginBottom: 16 }}>
                    <img
                      src={formData.profile_photo_url}
                      alt="Current profile"
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 8,
                        objectFit: 'cover',
                        border: '2px solid var(--border)',
                      }}
                    />
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 8 }}>
                      Current profile photo
                    </p>
                  </div>
                )}
                <PhotoUploader
                  maxFiles={1}
                  maxFileSize={10 * 1024 * 1024}
                  onPhotosSelected={(photos) => {
                    setProfilePhotos(photos);
                    if (photos.length > 0) {
                      setFormData(prev => ({
                        ...prev,
                        profile_photo_url: photos[0].url,
                      }));
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG, or GIF. Max 10MB. Square images work best (1:1 aspect ratio).
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  placeholder="e.g., South C, Nairobi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bio/Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About You (Bio)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  placeholder="Tell us about yourself, your skills, experience, or what kind of work you're looking for..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Optional: Write a bio to help clients or professionals know more about you
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-md transition"
                >
                  {submitting ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded-md transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Profile Tips:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Keep your name professional and easy to remember</li>
              <li>✓ Add your location so clients can easily find you</li>
              <li>✓ Write a detailed bio to increase your chances of getting jobs</li>
              <li>✓ For professionals: mention your skills, years of experience, and specialties</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

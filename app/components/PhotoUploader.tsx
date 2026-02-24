'use client';

import { useState, useCallback, useRef } from 'react';
import { api, auth } from '@/app/lib/api';

interface UploadedPhoto {
  url: string;
  path: string;
  file?: File;
}

interface PhotoUploaderProps {
  onPhotosSelected?: (photos: UploadedPhoto[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
}

export default function PhotoUploader({
  onPhotosSelected,
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
}: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Only image files are allowed';
    }
    if (file.size > maxFileSize) {
      return `File size exceeds ${Math.round(maxFileSize / 1024 / 1024)}MB limit`;
    }
    return null;
  };

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const token = auth.getToken();
      if (!token) {
        setError('Please log in to upload photos');
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        // Validate all files first
        const validationErrors = files.map(validateFile).filter((e) => e !== null);
        if (validationErrors.length > 0) {
          setError(validationErrors[0]);
          setIsUploading(false);
          return;
        }

        // Check total count
        if (photos.length + files.length > maxFiles) {
          setError(`Maximum ${maxFiles} files allowed`);
          setIsUploading(false);
          return;
        }

        // Upload files
        const uploadedPhotos: UploadedPhoto[] = [];
        for (const file of files) {
          try {
            const result = await api.upload.single(token, file);
            uploadedPhotos.push({
              url: result.url,
              path: result.path,
              file,
            });
          } catch (uploadError: any) {
            setError(uploadError.message || 'Failed to upload file');
            setIsUploading(false);
            return;
          }
        }

        // Update photos state
        const newPhotos = [...photos, ...uploadedPhotos];
        setPhotos(newPhotos);

        // Notify parent component
        if (onPhotosSelected) {
          onPhotosSelected(newPhotos);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [photos, maxFiles, onPhotosSelected]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await uploadFiles(files);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async (index: number) => {
    const photo = photos[index];
    const token = auth.getToken();

    // Delete from server if we have a token
    if (token && photo.path) {
      try {
        await api.upload.delete(token, photo.path);
      } catch (error) {
        console.error('Failed to delete photo:', error);
      }
    }

    // Remove from local state
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);

    // Notify parent component
    if (onPhotosSelected) {
      onPhotosSelected(newPhotos);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-2">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12v12m6-6l-6 6-6-6"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm font-medium text-gray-800">
              Drag and drop your photos here
            </p>
            <p className="text-xs text-gray-600">
              or click to select files ({maxFiles - photos.length} remaining)
            </p>
            <p className="text-xs text-gray-500">
              Max {Math.round(maxFileSize / 1024 / 1024)}MB per file
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Uploaded Photos ({photos.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-40 object-cover"
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  disabled={isUploading}
                  className="
                    absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40
                    transition-all duration-200 flex items-center justify-center
                    opacity-0 group-hover:opacity-100
                  "
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

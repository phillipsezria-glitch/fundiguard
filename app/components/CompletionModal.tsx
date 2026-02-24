'use client';

import { useState } from 'react';
import PhotoUploader from './PhotoUploader';
import { api, auth } from '@/app/lib/api';

interface CompletionModalProps {
  isOpen: boolean;
  jobId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CompletionModal({
  isOpen,
  jobId,
  onClose,
  onSuccess,
}: CompletionModalProps) {
  const [completionPhotos, setCompletionPhotos] = useState<Array<{ url: string; path: string }>>([]);
  const [proNotes, setProNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (completionPhotos.length === 0) {
      setError('Please upload at least one completion photo');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = auth.getToken();
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const completionData = {
        completion_photos: completionPhotos.map(p => p.url),
        pro_notes: proNotes || undefined,
      };

      // Call backend completion endpoint
      await api.bookings.submitCompletion(token, jobId, completionData);

      setCompletionPhotos([]);
      setProNotes('');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit completion');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 32,
          maxWidth: 600,
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '1.5rem',
            marginBottom: 8,
          }}
        >
          ✅ Mark Job Complete
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          Upload photos of the completed work. The client will review and approve before releasing payment.
        </p>

        {error && (
          <div
            style={{
              backgroundColor: '#FFEBEE',
              border: '1px solid #EF5350',
              borderRadius: 8,
              padding: 12,
              marginBottom: 20,
              color: '#C62828',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Completion Photos */}
        <label
          style={{
            fontWeight: 600,
            fontSize: '0.88rem',
            display: 'block',
            marginBottom: 8,
          }}
        >
          📸 Completion Photos *
        </label>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginBottom: 12,
          }}
        >
          Upload at least 1 photo showing the completed work
        </p>
        <PhotoUploader
          maxFiles={5}
          maxFileSize={10 * 1024 * 1024}
          onPhotosSelected={setCompletionPhotos}
        />

        {/* Pro Notes */}
        <label
          style={{
            fontWeight: 600,
            fontSize: '0.88rem',
            display: 'block',
            marginBottom: 8,
            marginTop: 20,
          }}
        >
          📝 Notes to Client (optional)
        </label>
        <textarea
          value={proNotes}
          onChange={(e) => setProNotes(e.target.value)}
          placeholder="Add any notes about the job, materials used, or recommendations..."
          rows={3}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            fontSize: '0.95rem',
            outline: 'none',
            fontFamily: 'Inter',
            marginBottom: 24,
            resize: 'vertical',
          }}
        />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'white',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.5 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || completionPhotos.length === 0}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 8,
              background:
                isSubmitting || completionPhotos.length === 0
                  ? '#BDBDBD'
                  : 'var(--green)',
              color: 'white',
              fontWeight: 600,
              cursor:
                isSubmitting || completionPhotos.length === 0
                  ? 'not-allowed'
                  : 'pointer',
              border: 'none',
            }}
          >
            {isSubmitting ? 'Submitting...' : '✓ Mark Complete & Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

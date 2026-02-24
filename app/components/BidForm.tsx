'use client';

import { useState } from 'react';
import { api } from '../lib/api';

interface BidFormProps {
  jobId: string;
  jobBudget?: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function BidForm({ jobId, jobBudget, onSuccess, onError }: BidFormProps) {
  const [formData, setFormData] = useState({
    proposed_price: jobBudget || '',
    timeline: '',
    proposal: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Please login to submit a bid');
      }

      if (!formData.proposed_price || !formData.timeline || !formData.proposal) {
        throw new Error('Please fill in all fields');
      }

      const proposedPrice = parseFloat(formData.proposed_price as string);
      const timeline = parseInt(formData.timeline as string);

      if (proposedPrice <= 0) {
        throw new Error('Proposed price must be greater than 0');
      }

      if (timeline <= 0) {
        throw new Error('Timeline must be greater than 0 days');
      }

      if (formData.proposal.trim().length < 10) {
        throw new Error('Proposal must be at least 10 characters');
      }

      const response = await api.bids.create(token, {
        job_id: jobId,
        proposed_price: proposedPrice,
        timeline: timeline,
        proposal: formData.proposal,
      });

      setSuccess(true);
      setFormData({ proposed_price: jobBudget || '', timeline: '', proposal: '' });
      onSuccess?.();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit bid';
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Your Bid</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Bid submitted successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proposed Price (KES)
          </label>
          <input
            type="number"
            name="proposed_price"
            value={formData.proposed_price}
            onChange={handleChange}
            placeholder="Your price quote"
            step="0.01"
            min="0"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeline (Days)
          </label>
          <input
            type="number"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            placeholder="Number of days"
            min="1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Proposal
        </label>
        <textarea
          name="proposal"
          value={formData.proposal}
          onChange={handleChange}
          placeholder="Describe your approach, experience, and why you're the best fit for this job..."
          rows={5}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-md transition"
      >
        {loading ? 'Submitting...' : 'Submit Bid'}
      </button>
    </form>
  );
}

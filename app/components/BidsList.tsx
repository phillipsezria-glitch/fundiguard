'use client';

import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface Bid {
  id: string;
  job_id: string;
  professional_id: string;
  proposed_price: number;
  timeline: number;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
  professional?: {
    id: string;
    full_name: string;
    rating?: number;
  };
  created_at?: string;
}

interface BidsListProps {
  jobId: string;
  clientId?: string;
  onAcceptBid?: () => void;
  onRejectBid?: () => void;
}

export default function BidsList({ jobId, clientId, onAcceptBid, onRejectBid }: BidsListProps) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        const response = await api.bids.getForJob(jobId);
        // Response is either an array or an object with bids property
        const bidList = Array.isArray(response) ? response : (response as any)?.bids || [];
        setBids(bidList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bids');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchBids();
    }
  }, [jobId]);

  const handleAcceptBid = async (bidId: string) => {
    try {
        const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to manage bids');
        return;
      }

      setAccepting(bidId);
      await api.bids.accept(token, bidId);

      // Update local state
      setBids(prevBids =>
        prevBids.map(bid =>
          bid.id === bidId
            ? { ...bid, status: 'accepted' }
            : bid.status === 'pending'
            ? { ...bid, status: 'rejected' }
            : bid
        )
      );

      onAcceptBid?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept bid');
    } finally {
      setAccepting(null);
    }
  };

  const handleRejectBid = async (bidId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to manage bids');
        return;
      }

      setRejecting(bidId);
      await api.bids.reject(token, bidId);

      // Update local state
      setBids(prevBids =>
        prevBids.map(bid =>
          bid.id === bidId ? { ...bid, status: 'rejected' } : bid
        )
      );

      onRejectBid?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject bid');
    } finally {
      setRejecting(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500">Loading bids...</div>
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-center text-gray-500">No bids yet. Share this job to professionals!</p>
      </div>
    );
  }

  const pendingBids = bids.filter(bid => bid.status === 'pending');
  const acceptedBids = bids.filter(bid => bid.status === 'accepted');
  const rejectedBids = bids.filter(bid => bid.status === 'rejected');

  const renderBidCard = (bid: Bid, isOwner: boolean) => (
    <div key={bid.id} className="border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">
            {bid.professional?.full_name || 'Anonymous Professional'}
          </h4>
          {bid.professional?.rating && (
            <p className="text-sm text-yellow-600">Rating: {bid.professional.rating} ⭐</p>
          )}
        </div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            bid.status === 'accepted'
              ? 'bg-green-100 text-green-800'
              : bid.status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {bid.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-600">Proposed Price</p>
          <p className="font-bold text-lg text-gray-900">KES {bid.proposed_price.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Timeline</p>
          <p className="font-bold text-lg text-gray-900">{bid.timeline} days</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Proposal:</p>
        <p className="text-sm text-gray-700">{bid.proposal}</p>
      </div>

      {isOwner && bid.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => handleAcceptBid(bid.id)}
            disabled={accepting === bid.id}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition"
          >
            {accepting === bid.id ? 'Accepting...' : 'Accept Bid'}
          </button>
          <button
            onClick={() => handleRejectBid(bid.id)}
            disabled={rejecting === bid.id}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition"
          >
            {rejecting === bid.id ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {pendingBids.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Pending Bids ({pendingBids.length})
          </h3>
          {pendingBids.map(bid => renderBidCard(bid, !!clientId))}
        </div>
      )}

      {acceptedBids.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Accepted Bids ({acceptedBids.length})
          </h3>
          {acceptedBids.map(bid => renderBidCard(bid, false))}
        </div>
      )}

      {rejectedBids.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Rejected Bids ({rejectedBids.length})
          </h3>
          {rejectedBids.map(bid => renderBidCard(bid, false))}
        </div>
      )}
    </div>
  );
}

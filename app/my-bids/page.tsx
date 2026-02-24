'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CompletionModal from '../components/CompletionModal';
import { api } from '../lib/api';

interface Bid {
  id: string;
  job_id: string;
  professional_id: string;
  proposed_price: number;
  timeline: number;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
  job?: {
    id: string;
    title: string;
    description: string;
    budget: number;
  };
  created_at?: string;
}

export default function MyBidsPage() {
  const router = useRouter();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [completionModal, setCompletionModal] = useState<{ isOpen: boolean; jobId: string }>({
    isOpen: false,
    jobId: '',
  });

  useEffect(() => {
    const checkAuthAndFetchBids = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);
        const response = await api.bids.getMyBids(token);
        const bidList = Array.isArray(response) ? response : (response as any)?.bids || [];
        setBids(bidList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load your bids');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchBids();
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bids</h1>
            <p className="text-gray-600 mb-6">
              Please log in to view and manage your bids.
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

  const pendingBids = bids.filter(bid => bid.status === 'pending');
  const acceptedBids = bids.filter(bid => bid.status === 'accepted');
  const rejectedBids = bids.filter(bid => bid.status === 'rejected');

  const renderBidCard = (bid: Bid) => (
    <div key={bid.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {bid.job?.title || 'Untitled Job'}
          </h3>
          <p className="text-sm text-gray-600">Job ID: {bid.job_id}</p>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
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

      {bid.job?.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{bid.job.description}</p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-600">Job Budget</p>
          <p className="font-semibold text-gray-900">
            {bid.job?.budget ? `KES ${bid.job.budget.toLocaleString()}` : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Your Bid</p>
          <p className="font-semibold text-gray-900">KES {bid.proposed_price.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Timeline</p>
          <p className="font-semibold text-gray-900">{bid.timeline} days</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-600 mb-1">Your Proposal:</p>
        <p className="text-sm text-gray-700 line-clamp-3">{bid.proposal}</p>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          onClick={() => router.push(`/pro/${bid.job_id}`)}
          className="text-blue-600 hover:underline text-sm font-semibold"
        >
          View Job Details →
        </button>

        {bid.status === 'accepted' && (
          <button
            onClick={() =>
              setCompletionModal({ isOpen: true, jobId: bid.job_id })
            }
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              background: 'var(--green)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ✓ Mark Complete
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bids</h1>
          <p className="text-gray-600 mb-8">
            Track and manage all the bids you've submitted on jobs.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading your bids...</div>
          ) : bids.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">
                You haven't submitted any bids yet.
              </p>
              <button
                onClick={() => router.push('/browse')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingBids.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Pending ({pendingBids.length})
                  </h2>
                  <div className="space-y-3">
                    {pendingBids.map(bid => renderBidCard(bid))}
                  </div>
                </div>
              )}

              {acceptedBids.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Accepted ({acceptedBids.length})
                  </h2>
                  <div className="space-y-3">
                    {acceptedBids.map(bid => renderBidCard(bid))}
                  </div>
                </div>
              )}

              {rejectedBids.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Rejected ({rejectedBids.length})
                  </h2>
                  <div className="space-y-3">
                    {rejectedBids.map(bid => renderBidCard(bid))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <CompletionModal
        isOpen={completionModal.isOpen}
        jobId={completionModal.jobId}
        onClose={() => setCompletionModal({ isOpen: false, jobId: '' })}
        onSuccess={() => {
          // Refresh bids list
          window.location.reload();
        }}
      />
      <Footer />
    </div>
  );
}

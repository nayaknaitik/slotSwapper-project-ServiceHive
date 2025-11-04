'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Protected from '@/components/Protected';
import { useSwappableSlots, useMyEvents } from '@/hooks/useEvents';
import SlotCard from '@/components/SlotCard';
import api from '@/lib/api';

export default function Marketplace() {
  const { slots, fetchSlots } = useSwappableSlots();
  const { events, fetchEvents } = useMyEvents();
  const [selMySlot, setSelMySlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const mySwappables = events.filter((e) => e.status === 'SWAPPABLE');

  const requestSwap = async (theirSlotId: string) => {
    if (!selMySlot) return alert('Select one of your swappable slots first.');
    try {
      setLoading(true);
      await api.post('/swap-request', { mySlotId: selMySlot, theirSlotId });
      alert('Swap request sent!');
      fetchSlots();
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send swap request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected>
      <Layout>
        <div className="min-h-screen text-gray-100 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
              Marketplace
            </h1>

            {/* My swappable slots section */}
            <div className="mb-8 bg-[#1e293b]/90 border border-gray-700 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-blue-300 mb-3">
                Your swappable slots:
              </h2>

              <div className="flex flex-wrap gap-3">
                {mySwappables.length ? (
                  mySwappables.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelMySlot(s.id)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-200 font-medium ${
                        selMySlot === s.id
                          ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/30 shadow-md'
                          : 'bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-300'
                      }`}
                    >
                      {s.title}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No swappable slots yet. Mark your events as swappable from the{' '}
                    <span className="text-blue-400">My Events</span> page.
                  </p>
                )}
              </div>
            </div>

            {/* Swappable slots list */}
            <div className="grid gap-4">
              {slots.length ? (
                slots.map((s) => (
                  <div
                    key={s.id}
                    className="flex justify-between items-center bg-[#1e293b]/80 border border-gray-700 rounded-xl p-5 shadow-md hover:shadow-blue-900/30 transition-all duration-200"
                  >
                    {/* Slot info */}
                    <div>
                      <div className="font-semibold text-lg text-blue-300">
                        {s.title}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(s.startTime).toLocaleString()} –{' '}
                        {new Date(s.endTime).toLocaleString()}
                      </div>
                      <div
                        className={`text-xs mt-2 font-medium ${
                          s.status === 'SWAPPABLE'
                            ? 'text-green-400'
                            : s.status === 'SWAP_PENDING'
                            ? 'text-yellow-400'
                            : 'text-gray-400'
                        }`}
                      >
                        Status: {s.status}
                      </div>
                    </div>

                    {/* Request swap button */}
                    <button
                      onClick={() => requestSwap(s.id)}
                      disabled={loading}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        loading
                          ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {loading ? 'Sending...' : 'Request Swap'}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm mt-10">
                  No open swappable slots from other users yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </Protected>
  );
}

'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Protected from '@/components/Protected';
import { useMyEvents } from '@/hooks/useEvents';
import api from '@/lib/api';

export default function HomePage() {
  const { events, fetchEvents } = useMyEvents();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  // ✅ Create a new event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title || !startTime || !endTime) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      await api.post('/events', {
        title,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });
      setTitle('');
      setStartTime('');
      setEndTime('');
      await fetchEvents();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle swappable status
  const handleToggleSwappable = async (eventId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE';
    try {
      setUpdating(eventId);
      await api.patch(`/events/${eventId}`, { status: newStatus });
      await fetchEvents();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update event status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Protected>
      <Layout>
        <div className="min-h-screen  text-gray-100 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
              My Events
            </h1>

            {/* Create Event Form */}
            <form
              onSubmit={handleCreateEvent}
              className="mb-10 bg-[#1e293b]/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-700 shadow-xl max-w-2xl mx-auto"
            >
              <h2 className="text-lg font-semibold mb-3 text-blue-300">
                Create New Event
              </h2>
              {error && (
                <div className="text-red-400 mb-2 text-sm bg-red-900/30 p-2 rounded">
                  {error}
                </div>
              )}

              <input
                type="text"
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-3 p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="text-sm text-gray-400">Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full mb-3 p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="text-sm text-gray-400">End Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full mb-5 p-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg text-white font-semibold transition-all duration-200 ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </form>

            {/* My Events List */}
            <div className="grid gap-4">
              {events.length ? (
                events.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex justify-between items-center bg-[#1e293b]/90 border border-gray-700 rounded-xl p-5 shadow-md hover:shadow-blue-900/30 transition-shadow duration-200"
                  >
                    <div>
                      <div className="font-semibold text-lg text-blue-300">
                        {ev.title}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {new Date(ev.startTime).toLocaleString()} –{' '}
                        {new Date(ev.endTime).toLocaleString()}
                      </div>
                      <div
                        className={`text-xs mt-2 font-medium ${
                          ev.status === 'SWAPPABLE'
                            ? 'text-green-400'
                            : ev.status === 'SWAP_PENDING'
                            ? 'text-yellow-400'
                            : 'text-gray-400'
                        }`}
                      >
                        Status: {ev.status}
                      </div>
                    </div>

                    {/* Toggle Swappable Button */}
                    <button
                      onClick={() => handleToggleSwappable(ev.id, ev.status)}
                      disabled={updating === ev.id}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        updating === ev.id
                          ? 'bg-gray-600 text-gray-300'
                          : ev.status === 'SWAPPABLE'
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {updating === ev.id
                        ? 'Updating...'
                        : ev.status === 'SWAPPABLE'
                        ? 'Make Busy'
                        : 'Make Swappable'}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm mt-10">
                  No events yet. Create one to get started.
                </p>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </Protected>
  );
}

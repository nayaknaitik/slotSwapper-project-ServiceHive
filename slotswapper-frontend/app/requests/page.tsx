'use client';

import React from 'react';
import Layout from '@/components/Layout';
import Protected from '@/components/Protected';
import useSWR from 'swr';
import api from '@/lib/api';

export default function Requests() {
  const fetcher = (url: string) => api.get(url).then((r) => r.data);
  const { data: incoming } = useSWR('/swap-requests/incoming', fetcher);
  const { data: outgoing } = useSWR('/swap-requests/outgoing', fetcher);

  const respond = async (id: string, accept: boolean) => {
    await api.post(`/swap-response/${id}`, { accept });
    window.location.reload();
  };

  return (
    <Protected>
      <Layout>
        <div className="min-h-screen  text-gray-100 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center text-blue-400">
              Swap Requests
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Incoming Requests */}
              <div className="bg-[#1e293b]/90 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-blue-900/30 transition-all duration-200">
                <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-gray-700 pb-2">
                  Incoming Requests
                </h3>

                {incoming?.length ? (
                  incoming.map((r: any) => (
                    <div
                      key={r.id}
                      className="p-4 mb-4 rounded-xl bg-gray-800/70 border border-gray-700 hover:bg-gray-800/90 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-100">
                            From: <span className="text-blue-400">{r.fromUserName}</span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            Their slot:{' '}
                            <span className="text-gray-200">{r.theirSlot?.title}</span> <br />
                            Your slot:{' '}
                            <span className="text-gray-200">{r.mySlot?.title}</span>
                          </div>
                          <div
                            className={`text-xs font-semibold mt-2 ${
                              r.status === 'PENDING'
                                ? 'text-yellow-400'
                                : r.status === 'ACCEPTED'
                                ? 'text-green-400'
                                : 'text-red-400'
                            }`}
                          >
                            Status: {r.status}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {r.status === 'PENDING' && (
                          <div className="flex flex-col gap-2 ml-4">
                            <button
                              onClick={() => respond(r.id, true)}
                              className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => respond(r.id, false)}
                              className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-semibold transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400 mt-4 text-center">
                    No incoming requests
                  </div>
                )}
              </div>

              {/* Outgoing Requests */}
              <div className="bg-[#1e293b]/90 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-blue-900/30 transition-all duration-200">
                <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-gray-700 pb-2">
                  Outgoing Requests
                </h3>

                {outgoing?.length ? (
                  outgoing.map((r: any) => (
                    <div
                      key={r.id}
                      className="p-4 mb-4 rounded-xl bg-gray-800/70 border border-gray-700 hover:bg-gray-800/90 transition-all"
                    >
                      <div>
                        <div className="font-medium text-gray-100">
                          To: <span className="text-blue-400">{r.toUserName}</span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          Their slot:{' '}
                          <span className="text-gray-200">{r.theirSlot?.title}</span> <br />
                          Your slot:{' '}
                          <span className="text-gray-200">{r.mySlot?.title}</span>
                        </div>
                        <div
                          className={`text-xs font-semibold mt-2 ${
                            r.status === 'PENDING'
                              ? 'text-yellow-400'
                              : r.status === 'ACCEPTED'
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          Status: {r.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400 mt-4 text-center">
                    No outgoing requests
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </Protected>
  );
}

'use client';
import React from 'react';

interface SlotCardProps {
  slot: {
    title: string;
    startTime: string;
    endTime: string;
    status?: string;
  };
}

export default function SlotCard({ slot }: SlotCardProps) {
  return (
    <div className="flex flex-col">
      <span className="font-semibold">{slot.title}</span>
      <span className="text-sm text-gray-500">
        {new Date(slot.startTime).toLocaleString()} –{' '}
        {new Date(slot.endTime).toLocaleString()}
      </span>
      <span
        className={`text-xs font-medium mt-1 ${
          slot.status === 'SWAPPABLE'
            ? 'text-green-600'
            : slot.status === 'SWAP_PENDING'
            ? 'text-yellow-600'
            : 'text-gray-500'
        }`}
      >
        Status: {slot.status}
      </span>
    </div>
  );
}

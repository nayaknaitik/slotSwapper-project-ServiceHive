// /hooks/useEvents.ts
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export const useMyEvents = () => {
  const [events, setEvents] = useState<any[]>([]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/me');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, fetchEvents };
};

export const useSwappableSlots = () => {
  const [slots, setSlots] = useState<any[]>([]);

  const fetchSlots = async () => {
    try {
      const res = await api.get('/events/swappable');
      setSlots(res.data);
    } catch (err) {
      console.error('Failed to fetch swappable slots:', err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return { slots, fetchSlots };
};

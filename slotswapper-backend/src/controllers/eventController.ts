import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { createEvent, getMyEvents, getSwappableSlots, updateEventStatus } from '../services/eventService';

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const event = await createEvent(req.user!.id, req.body.title, req.body.startTime, req.body.endTime);
    res.status(201).json(event);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const myEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await getMyEvents(req.user!.id);
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const swappable = async (req: AuthRequest, res: Response) => {
  try {
    const slots = await getSwappableSlots(req.user!.id);
    res.json(slots);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    await updateEventStatus(req.user!.id, req.params.id, req.body.status);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

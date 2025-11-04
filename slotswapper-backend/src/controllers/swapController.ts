import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import {
  createSwapRequest,
  respondToSwap,
  getIncomingRequests,
  getOutgoingRequests,
} from '../services/swapService';

export const createSwap = async (req: AuthRequest, res: Response) => {
  try {
    const { mySlotId, theirSlotId } = req.body;
    const swap = await createSwapRequest(req.user!.id, mySlotId, theirSlotId);
    res.status(201).json(swap);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const respondSwap = async (req: AuthRequest, res: Response) => {
  try {
    const { accept } = req.body;
    await respondToSwap(req.user!.id, req.params.id, accept);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const incoming = async (req: AuthRequest, res: Response) => {
  const data = await getIncomingRequests(req.user!.id);
  res.json(data);
};

export const outgoing = async (req: AuthRequest, res: Response) => {
  const data = await getOutgoingRequests(req.user!.id);
  res.json(data);
};

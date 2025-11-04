import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
  create,
  myEvents,
  swappable,
  updateStatus,
} from '../controllers/eventController';

const router = express.Router();

// Create a new event
router.post('/', authenticate, create);

// Get current user's events
router.get('/me', authenticate, myEvents);

// Get swappable events from other users
router.get('/swappable', authenticate, swappable);

// Update event status
router.patch('/:id', authenticate, updateStatus);

export default router;

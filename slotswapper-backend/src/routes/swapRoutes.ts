import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createSwap, respondSwap, incoming, outgoing } from '../controllers/swapController';

const router = express.Router();
router.use(authenticate);

router.post('/swap-request', createSwap);
router.post('/swap-response/:id', respondSwap);
router.get('/swap-requests/incoming', incoming);
router.get('/swap-requests/outgoing', outgoing);

export default router;

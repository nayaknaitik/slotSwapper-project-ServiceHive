import express from 'express';
import { signup, login } from '../controllers/authController';
const router = express.Router();
import { authenticate, AuthRequest } from '../middleware/authMiddleware';
import { Response } from 'express';

router.post('/signup', signup);
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  res.json(req.user);
});
router.post('/login', login);

export default router;

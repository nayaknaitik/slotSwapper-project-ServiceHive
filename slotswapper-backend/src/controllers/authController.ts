import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const { token, user } = await registerUser(name, email, password);
    res.json({ token, user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);
    res.json({ token, user });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

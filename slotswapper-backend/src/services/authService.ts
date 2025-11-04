import { prisma } from '../config/db';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export const registerUser = async (name: string, email: string, password: string) => {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error('Email already registered');

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });

  const token = generateToken({ id: user.id, name: user.name, email: user.email });
  return { token, user };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');

  const token = generateToken({ id: user.id, name: user.name, email: user.email });
  return { token, user };
};

import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';

export interface JWTPayload {
  id: string;
  name: string;
  email: string;
}

// safely cast .env value (since it's always a string)
const options: SignOptions = {
  expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn']
};

// Generate a JWT token
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(
    { ...payload }, // ensure plain object
    config.jwtSecret,
    options
  );
};

// Verify JWT token
export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwtSecret) as JWTPayload;
};


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-fallback-secret-key'; // Fallback for safety, but .env is preferred
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: object, expiresIn: string | number = '1h'): string {
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET is not set. Using a default secret. THIS IS NOT SECURE FOR PRODUCTION.');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): any {
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET is not set. Using a default secret. THIS IS NOT SECURE FOR PRODUCTION.');
  }
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; // Or throw error if you want to handle it differently
  }
}

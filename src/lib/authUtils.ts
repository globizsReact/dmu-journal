
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-fallback-secret-key'; 
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: { userId: number; username: string; role: string | null }, expiresIn: string | number = '1h'): string {
  if (!JWT_SECRET) {
    console.warn('AuthUtils: JWT_SECRET is not set in .env for token generation. Using a default secret. THIS IS NOT SECURE FOR PRODUCTION.');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): { userId: number; username: string; role: string | null; [key: string]: any } | null {
  if (!JWT_SECRET) {
    console.warn('AuthUtils: JWT_SECRET is not set in .env for token verification. Using a default secret. THIS IS NOT SECURE FOR PRODUCTION.');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log('AuthUtils: Token verified successfully:', decoded);
    return decoded as { userId: number; username: string; role: string | null; [key: string]: any };
  } catch (error: any) {
    console.error('AuthUtils: Token verification failed. Error:', error.message);
    return null; 
  }
}

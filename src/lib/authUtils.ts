
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

export function generateToken(payload: object, expiresIn: string | number = '1h'): string {
  if (!process.env.JWT_SECRET) {
    console.warn('AuthUtils: JWT_SECRET is not set in .env for token generation. Using a default secret. THIS IS NOT SECURE FOR PRODUCTION.');
  }
  // console.log(`AuthUtils: Generating token with secret starting with: ${JWT_SECRET.substring(0, 5)}...`);
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): any {
  if (!process.env.JWT_SECRET) {
    console.warn('AuthUtils: JWT_SECRET is not set in .env for token verification. Using a default secret. THIS IS NOT SECURE FOR PRODUCTION.');
  }
  // console.log(`AuthUtils: Verifying token starting with: ${token.substring(0,15)}... using secret starting with: ${JWT_SECRET.substring(0, 5)}...`);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log('AuthUtils: Token verified successfully:', decoded);
    return decoded;
  } catch (error: any) {
    console.error('AuthUtils: Token verification failed. Error:', error.message); // Log the specific JWT error
    return null; 
  }
}


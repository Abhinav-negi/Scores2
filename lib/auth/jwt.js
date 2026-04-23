import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Signs a JWT token. Used in login/signup API routes (Node.js runtime).
 * @param {Object} payload 
 * @returns {string} token
 */
export function signToken(payload) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verifies a JWT token in Node.js runtime.
 * @param {string} token 
 * @returns {Object|null} payload or null if invalid
 */
export function verifyTokenNode(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Verifies a JWT token in Edge runtime (e.g. Next.js middleware).
 * @param {string} token 
 * @returns {Object|null} payload or null if invalid
 */
export async function verifyTokenEdge(token) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

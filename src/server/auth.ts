import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { dbQueries, hashPassword } from './db.js';
import type { AdminUser } from './types.js';

// In-memory active session tokens mapped to Admin User ID
const activeSessions = new Map<string, { adminId: string; email: string; name: string; expiresAt: number }>();

export function generateSessionToken(admin: AdminUser): string {
  const token = crypto.randomBytes(32).toString('hex');
  // 7 days expiration
  const expiresAt = Date.now() + 7 * 24 * 3600 * 1000;
  activeSessions.set(token, {
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    expiresAt
  });
  return token;
}

export function verifySessionToken(token: string): { adminId: string; email: string; name: string } | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  return session;
}

export function revokeSessionToken(token: string): void {
  activeSessions.delete(token);
}

export function authenticateAdmin(email: string, passwordPlain: string): { success: boolean; token?: string; user?: any; error?: string } {
  const admin = dbQueries.getAdminByEmail(email);
  if (!admin) {
    return { success: false, error: 'Invalid email or password' };
  }

  const computedHash = hashPassword(passwordPlain);
  if (computedHash !== admin.password_hash) {
    return { success: false, error: 'Invalid email or password' };
  }

  const token = generateSessionToken(admin);
  return {
    success: true,
    token,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  };
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }

  const session = verifySessionToken(token);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  (req as any).adminSession = session;
  next();
}

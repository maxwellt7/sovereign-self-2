import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import prisma from '../config/database.js';

export interface AuthRequest extends Request {
  auth?: {
    userId: string;
    clerkUserId: string;
    role: 'USER' | 'ADMIN';
  };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }

    const token = authHeader.substring(7);

    // Verify the token with Clerk
    const session = await clerkClient.sessions.verifySession(token, token);

    if (!session || !session.userId) {
      res.status(401).json({ success: false, error: { message: 'Invalid token' } });
      return;
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: session.userId },
      select: { id: true, clerkUserId: true, role: true },
    });

    if (!user) {
      res.status(404).json({ success: false, error: { message: 'User not found' } });
      return;
    }

    // Attach user info to request
    req.auth = {
      userId: user.id,
      clerkUserId: user.clerkUserId,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, error: { message: 'Authentication failed' } });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.auth) {
    res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    return;
  }

  if (req.auth.role !== 'ADMIN') {
    res.status(403).json({ success: false, error: { message: 'Forbidden: Admin access required' } });
    return;
  }

  next();
};


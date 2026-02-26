import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/express';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
      clerkToken?: string;
    }
  }
}

/**
 * Middleware to verify Clerk JWT tokens
 * Requires CLERK_SECRET_KEY environment variable
 */
export async function clerkAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    // Verify token with Clerk
    const decoded = await clerkClient.verifyToken(token);
    
    req.userId = decoded.sub;
    req.clerkToken = token;
    
    // Fetch full user data from Clerk
    const user = await clerkClient.users.getUser(decoded.sub);
    req.user = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.fullName,
      phone: user.phoneNumbers[0]?.phoneNumber,
      role: user.unsafeMetadata?.role || 'client',
    };

    next();
  } catch (error: any) {
    console.error('Clerk auth error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Optional middleware - doesn't fail if token is missing
 * Useful for public endpoints that can work with or without auth
 */
export async function clerkAuthOptional(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const decoded = await clerkClient.verifyToken(token);
      req.userId = decoded.sub;
      req.clerkToken = token;
      
      const user = await clerkClient.users.getUser(decoded.sub);
      req.user = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: user.fullName,
        phone: user.phoneNumbers[0]?.phoneNumber,
        role: user.unsafeMetadata?.role || 'client',
      };
    }
  } catch (error) {
    // Silently fail, user will just be undefined
    console.warn('Optional auth failed, continuing without auth');
  }

  next();
}

/**
 * Check if user has required role
 */
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `This action requires ${roles.join(' or ')} role` 
      });
    }
    next();
  };
}

import { Request, Response, NextFunction } from 'express';
import { clerkClient, verifyToken } from '@clerk/express';

/**
 * Middleware to verify Clerk JWT tokens
 * Requires CLERK_SECRET_KEY environment variable
 */
export async function clerkAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'No authorization token provided' });
      return;
    }

    // Verify token with Clerk using secretKey
    const decoded = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    
    if (!decoded || !decoded.sub) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    // Set userId on request for compatibility
    req.userId = decoded.sub;
    
    // Fetch full user data from Clerk
    const user = await clerkClient.users.getUser(decoded.sub);
    
    // Store in format compatible with existing auth middleware
    (req as any).user = {
      userId: user.id,
      email: user.emailAddresses?.[0]?.emailAddress,
      name: user.fullName,
      phone: user.phoneNumbers?.[0]?.phoneNumber,
      role: (user.unsafeMetadata?.role as string) || 'client',
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
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const decoded = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      
      if (decoded && decoded.sub) {
        req.userId = decoded.sub;
        
        const user = await clerkClient.users.getUser(decoded.sub);
        (req as any).user = {
          userId: user.id,
          email: user.emailAddresses?.[0]?.emailAddress,
          name: user.fullName,
          phone: user.phoneNumbers?.[0]?.phoneNumber,
          role: (user.unsafeMetadata?.role as string) || 'client',
        };
      }
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
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    if (!user || !user.role || !roles.includes(user.role)) {
      res.status(403).json({ 
        error: `This action requires ${roles.join(' or ')} role` 
      });
      return;
    }
    next();
  };
}

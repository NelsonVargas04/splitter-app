import { Request, Response, NextFunction } from 'express';
import { db } from './db';

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const tokenRecord = db.tokens.find(t => t.token === token);

  if (!tokenRecord) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const user = db.users.find(u => u.id === tokenRecord.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  (req as any).userId = user.id;
  (req as any).user = user;
  next();
}

export { authMiddleware };

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { env } from '../config/env';
import { sanitizeUser } from '../utils/format';

export interface AuthRequest extends Request {
  user?: ReturnType<typeof sanitizeUser>;
}

const getTokenFromHeader = (authorization?: string) => {
  if (!authorization) return null;
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
};

const getUserFromToken = async (token: string) => {
  const payload = jwt.verify(token, env.jwtSecret) as { userId: number };
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  return user ? sanitizeUser(user) : null;
};

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getTokenFromHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: '未授权' });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return res.status(401).json({ message: '无效 token 或会话已过期' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: '未授权' });
  }
};

export const getCurrentUser = (req: AuthRequest) => req.user || null;

export const getTokenOnly = (authorization?: string) => getTokenFromHeader(authorization);

export const attachUserIfPresent = async (req: AuthRequest) => {
  const token = getTokenFromHeader(req.headers.authorization);
  if (!token) return null;

  try {
    const user = await getUserFromToken(token);
    if (user) {
      req.user = user;
    }
    return user;
  } catch {
    return null;
  }
};

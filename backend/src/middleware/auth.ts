import { Request, Response, NextFunction } from "express";

import {
  verifyAccessToken,
} from "../lib/auth.js";

export interface AuthRequest
  extends Request {
  userId?: string;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token =
      req.cookies.access_token;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const payload =
      verifyAccessToken(token);

    req.userId = payload.sub;

    next();
  } catch {
    return res.status(401).json({
      message: "Session expired",
    });
  }
}
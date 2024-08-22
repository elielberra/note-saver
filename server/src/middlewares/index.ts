import { Request, Response, NextFunction } from "express";

export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
  console.log('Request Headers:', req.headers);
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ isAuthenticated: false, message: "Unauthorized" });
  }
}

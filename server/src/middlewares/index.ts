import { Request, Response, NextFunction } from "express";
import { AuthResponseBody } from "../types/types";

export function isAuthenticated(req: Request, res: Response<AuthResponseBody>, next: NextFunction): void {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ isAuthenticated: false, message: "Unauthorized" });
  }
}

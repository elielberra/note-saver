import { Request, Response, NextFunction } from "express";
import { AuthPostBody, AuthResponseBody } from "../types/types";

export function isAuthenticated(
  req: Request,
  res: Response<AuthResponseBody>,
  next: NextFunction
): void {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ isAuthenticated: false, message: "Unauthorized" });
  }
}

export function hasUsernameAndPassword(
  req: Request<Record<string, never>, Record<string, never>, AuthPostBody>,
  res: Response,
  next: NextFunction
): void {
  const { username, password } = req.body;
  console.debug("req.body", req.body);
  if (!username || !password) {
    res.status(400).json({
      message: `${username ? "" : "Enter a username. "}${password ? "" : "Enter a password"}`
    });
  }
  next();
}

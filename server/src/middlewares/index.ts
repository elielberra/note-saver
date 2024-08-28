import { Request, Response, NextFunction } from "express";
import { AuthPostBody, AuthResponseBody, IsAuthenticatedResponse } from "../types/types";
import { getUserIdFromTagId } from "../dao";

export function isAuthenticated(req: Request, res: Response<AuthResponseBody>, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ isAuthenticated: false } as IsAuthenticatedResponse);
  }
}

export function hasUsernameAndPassword(
  req: Request<Record<string, never>, Record<string, never>, AuthPostBody>,
  res: Response,
  next: NextFunction
) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      message: `${username ? "" : "Enter a username. "}${password ? "" : "Enter a password"}`
    });
  }
  next();
}

export async function tagIdCorrespondsToSessionUserId(req: Request, res: Response, next: NextFunction) {
  const userIdFromSession = req.user!.userId;
  const { id: tagId } = req.body;
  const result = await getUserIdFromTagId(tagId);
  if (!result) {
    res.status(404).send("Tag id not found");
    return;
  }
  const { verifiedUserIdFromTag } = result;
  if (verifiedUserIdFromTag !== userIdFromSession) {
    res
      .status(401)
      .send("The tag that is being modified does not belong the user of the current session");
  }
  next();
}

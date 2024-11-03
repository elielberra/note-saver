import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  AuthPostBody,
  AuthTokenPayload,
  IsAuthenticatedResponse,
  RequestBodyWithId,
  UpdateEntityBody
} from "../types/types";
import { getUserIdFromNoteId, getUserIdFromTagId } from "../dao";

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

export async function tagIdCorrespondsToSessionUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
      .status(403)
      .send("The tag that is being modified does not belong the user of the current session");
  }
  next();
}

export async function noteIdCorrespondsToSessionUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userIdFromSession = req.user!.userId;
  const { id: noteId } = req.body;
  const result = await getUserIdFromNoteId(noteId);
  if (!result) {
    res.status(404).send("Note id not found");
    return;
  }
  const { verifiedUserIdFromNote } = result;
  if (verifiedUserIdFromNote !== userIdFromSession) {
    res
      .status(403)
      .send("The note that is being modified does not belong the user of the current session");
  }
  next();
}

export function validateUpdateEntityRequestBody(
  req: Request<{}, {}, UpdateEntityBody>,
  res: Response,
  next: NextFunction
) {
  const { id, newContent } = req.body;
  if (!id) return res.status(400).send("Field id is missing in Request body");
  if (!newContent) return res.status(400).send("Field newContent is missing in Request body");
  if (Number.isNaN(id)) return res.status(400).send("Field id has to be a number");
  next();
}

export function validateIdInRequestBody(
  req: Request<{}, {}, RequestBodyWithId>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.body;
  if (!id) return res.status(400).send("Field id is missing in Request body");
  if (Number.isNaN(id)) return res.status(400).send("Field id has to be a number");
  next();
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization?.split(" ")[1];
  if (!authToken) {
    return res.status(401).json({ isAuthenticated: false } as IsAuthenticatedResponse);
    }
  jwt.verify(authToken, process.env.JWT_SECRET!, (error, decodedPayload) => {
    if (error) {
      return res.status(403).json({ isAuthenticated: false } as IsAuthenticatedResponse);
    }
    const {userId, username} = decodedPayload as AuthTokenPayload;
    req.user = {userId, username};
    next();
  });
}

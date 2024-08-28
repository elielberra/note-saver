import express, { NextFunction, Request, Response } from "express";
import {
  createNote,
  createTag,
  deleteNote,
  deleteTag,
  getNotes,
  updateNoteContent,
  updateNoteStatus,
  updateTagContent
} from "../dao";
import {
  ALREADY_REGISTERED_USER,
  AuthErrors,
  AuthPostBody,
  CreateTagBody,
  DelenteEntityBody,
  IsAuthenticatedResponse,
  PASSWORD_NOT_VALID,
  SetNoteStatusBody,
  SuccessfulAuthResponse,
  UnsuccessfulAuthResponse,
  UpdateTagBody,
  USER_NOT_FOUND,
  UserT
} from "../types/types";
import passport from "passport";
import {
  hasUsernameAndPassword,
  isAuthenticated,
  noteIdCorrespondsToSessionUserId,
  tagIdCorrespondsToSessionUserId
} from "../middlewares";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("NoteSaver server");
});

// TODO: Add query params types
router.get("/notes", isAuthenticated, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const areActive = req.query.areActive === "true";
  const filteringText = req.query.filteringText as string | undefined;
  const notes = await getNotes(userId, areActive, filteringText);
  res.status(200).send(notes);
});

router.post(
  "/update-tag-content",
  isAuthenticated,
  tagIdCorrespondsToSessionUserId,
  async (
    req: Request<Record<string, never>, Record<string, never>, UpdateTagBody>,
    res: Response
  ) => {
    const { id: tagId, newContent } = req.body;
    if (!tagId) return res.status(400).send("Query parameter tagId is missing in Request");
    if (newContent === null || newContent === undefined)
      return res.status(400).send("Query parameter newContent is missing in Request");
    if (Number.isNaN(tagId))
      return res.status(400).send("Query parameter noteId has to be a number");
    try {
      await updateTagContent(tagId, newContent);
      res.sendStatus(204);
    } catch (error) {
      // TODO: Create sendError message for DRY
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send(error);
      }
    }
  }
);

router.post(
  "/update-note-content",
  isAuthenticated,
  async (
    req: Request<Record<string, never>, Record<string, never>, UpdateTagBody>,
    res: Response
  ) => {
    const { id: noteId, newContent } = req.body;
    if (!noteId) return res.status(400).send("Query parameter noteId is missing in Request");
    if (!newContent)
      return res.status(400).send("Query parameter newContent is missing in Request");
    if (Number.isNaN(noteId))
      return res.status(400).send("Query parameter noteId has to be a number");
    const userId = req.user!.userId;
    try {
      await updateNoteContent(userId, noteId, newContent);
      res.sendStatus(204);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send(error);
      }
    }
  }
);

router.post("/create-note", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const newNoteId = await createNote(userId);
    res.status(201).json({ newNoteId });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send(error);
    }
  }
});

router.post(
  "/create-tag",
  isAuthenticated,
  noteIdCorrespondsToSessionUserId,
  async (
    req: Request<Record<string, never>, Record<string, never>, CreateTagBody>,
    res: Response
  ) => {
    const { id: noteId } = req.body;
    try {
      const newTagId = await createTag(noteId);
      res.status(201).json({ newTagId });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send(error);
      }
    }
  }
);

router.delete(
  "/delete-note",
  isAuthenticated,
  async (
    req: Request<Record<string, never>, Record<string, never>, DelenteEntityBody>,
    res: Response
  ) => {
    const { id: noteId } = req.body;
    const userId = req.user!.userId;
    try {
      await deleteNote(noteId, userId);
      res.sendStatus(204);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send(error);
      }
    }
  }
);

router.delete(
  "/delete-tag",
  isAuthenticated,
  tagIdCorrespondsToSessionUserId,
  async (
    req: Request<Record<string, never>, Record<string, never>, DelenteEntityBody>,
    res: Response
  ) => {
    const { id: tagId } = req.body;
    try {
      await deleteTag(tagId);
      res.sendStatus(204);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send(error);
      }
    }
  }
);

router.post(
  "/set-note-status",
  noteIdCorrespondsToSessionUserId,
  async (
    req: Request<Record<string, never>, Record<string, never>, SetNoteStatusBody>,
    res: Response
  ) => {
    const { id: noteId, isActive } = req.body;
    try {
      await updateNoteStatus(noteId, isActive);
      res.sendStatus(204);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send(error);
      }
    }
  }
);

// TODO: Use function for DRY
router.post(
  "/signup",
  hasUsernameAndPassword,
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local-signup", (error: AuthErrors, user: UserT | false) => {
      if (error === ALREADY_REGISTERED_USER) {
        return res
          .status(409)
          .json({ message: "User already registered" } as UnsuccessfulAuthResponse);
      } else if (error || !user) {
        return res.status(500).json({
          message: "Internal Server error while attempting to register a user"
        } as UnsuccessfulAuthResponse);
      }
      req.logIn(user, (loginErr: any) => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.status(200).json({ username: user.username } as SuccessfulAuthResponse);
      });
    })(req as Request, res as Response, next as NextFunction);
  }
);

router.post(
  "/signin",
  hasUsernameAndPassword,
  (
    req: Request<Record<string, never>, Record<string, never>, AuthPostBody>,
    res: Response,
    next: NextFunction
  ) => {
    passport.authenticate("local-signin", async (error: AuthErrors, user: UserT | false) => {
      if (error === USER_NOT_FOUND || error === PASSWORD_NOT_VALID) {
        return res.status(401).json({ message: "Wrong credentials" } as UnsuccessfulAuthResponse);
      } else if (error || !user) {
        return res.status(500).json({
          message: "Internal Server error while attempting to signin a user"
        } as UnsuccessfulAuthResponse);
      }
      req.logIn(user, (loginErr: any) => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.status(200).json({ username: user.username } as SuccessfulAuthResponse);
      });
    })(req as Request, res as Response, next as NextFunction);
  }
);

router.post("/signout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((error) => {
    if (error) return next(error);
    res.sendStatus(200);
  });
});

router.get("/isauthenticated", isAuthenticated, async (req: Request, res: Response) => {
  res
    .status(200)
    .json({ isAuthenticated: true, username: req.user!.username } as IsAuthenticatedResponse);
});

export default router;

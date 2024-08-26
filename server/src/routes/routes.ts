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
  PASSWORD_NOT_VALID,
  SetNoteStatusBody,
  UpdateTagBody,
  USER_NOT_FOUND,
  UserT
} from "../types/types";
import passport from "passport";
import { hasUsernameAndPassword, isAuthenticated } from "../middlewares";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("NoteSaver server");
});

// TODO: Add query params types
router.get("/notes", isAuthenticated, async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "Unauthorized: No user in session" });
  }
  const userId = req.user.userId;
  const areActive = req.query.areActive === "true";
  const filteringText = req.query.filteringText as string | undefined;
  const notes = await getNotes(userId, areActive, filteringText);
  res.status(200).send(notes);
});

router.post(
  "/update-tag-content",
  async (
    req: Request<Record<string, never>, Record<string, never>, UpdateTagBody>,
    res: Response
  ) => {
    const { id, newContent } = req.body;
    if (!id) return res.status(400).send("Query parameter tagId is missing in Request");
    if (newContent === null || newContent === undefined)
      return res.status(400).send("Query parameter newContent is missing in Request");
    if (Number.isNaN(id)) return res.status(400).send("Query parameter noteId has to be a number");
    try {
      await updateTagContent(id, newContent);
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
  "/update-note-content",
  async (
    req: Request<Record<string, never>, Record<string, never>, UpdateTagBody>,
    res: Response
  ) => {
    const { id, newContent } = req.body;
    if (!id) return res.status(400).send("Query parameter noteId is missing in Request");
    if (!newContent)
      return res.status(400).send("Query parameter newContent is missing in Request");
    if (Number.isNaN(id)) return res.status(400).send("Query parameter noteId has to be a number");
    try {
      await updateNoteContent(id, newContent);
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

router.post("/create-note", async (req: Request, res: Response) => {
  try {
    const newNoteId = await createNote();
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
  async (
    req: Request<Record<string, never>, Record<string, never>, CreateTagBody>,
    res: Response
  ) => {
    const { noteId } = req.body;
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
  async (
    req: Request<Record<string, never>, Record<string, never>, DelenteEntityBody>,
    res: Response
  ) => {
    const { id } = req.body;
    try {
      await deleteNote(id);
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
  async (
    req: Request<Record<string, never>, Record<string, never>, DelenteEntityBody>,
    res: Response
  ) => {
    const { id } = req.body;
    try {
      await deleteTag(id);
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
  async (
    req: Request<Record<string, never>, Record<string, never>, SetNoteStatusBody>,
    res: Response
  ) => {
    const { noteId, isActive } = req.body;
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

router.post(
  "/signup",
  hasUsernameAndPassword,
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local-signup", (error: AuthErrors, user: UserT | false) => {
      if (error === ALREADY_REGISTERED_USER) {
        return res.status(409).json({ message: "User already registered" });
      } else if (error || !user) {
        return res
          .status(500)
          .json({ message: "Internal Server error while attempting to register a user" });
      }
      req.logIn(user, (loginErr: any) => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.status(201).json({ userId: user.userId, username: user.username });
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
      console.debug("error", error);
      if (error === USER_NOT_FOUND || error === PASSWORD_NOT_VALID) {
        return res.status(401).json({ message: "Wrong credentials" });
      } else if (error || !user) {
        return res
          .status(500)
          .json({ message: "Internal Server error while attempting to register a user" });
      }
      console.debug("user", user);
      req.logIn(user, (loginErr: any) => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.status(200).json({ userId: user.userId, username: user.username });
      });
    })(req as Request, res as Response, next as NextFunction);
  }
);

router.get("/isauthenticated", isAuthenticated, async (_: Request, res: Response) => {
  res.status(200).json({ isAuthenticated: true });
});

export default router;

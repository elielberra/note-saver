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
  GetNotesQueryParams,
  IsAuthenticatedResponse,
  PASSWORD_NOT_VALID,
  RequestBodyWithId,
  SetNoteStatusBody,
  SuccessfulAuthResponse,
  UnsuccessfulAuthResponse,
  UpdateEntityBody,
  USER_NOT_FOUND,
  UserT
} from "../types/types";
import passport from "passport";
import {
  hasUsernameAndPassword,
  isAuthenticated,
  noteIdCorrespondsToSessionUserId,
  tagIdCorrespondsToSessionUserId,
  validateIdInRequestBody,
  validateUpdateEntityRequestBody
} from "../middlewares";
import { handleErrorResponse } from "./utils";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("NoteSaver server");
});

router.get(
  "/notes",
  isAuthenticated,
  async (req: Request<{}, {}, {}, GetNotesQueryParams>, res: Response) => {
    if (
      !req.query.areActive ||
      (req.query.areActive !== "true" && req.query.areActive !== "false")
    ) {
      res.status(400).send("Query param areActive must be included with the value true or false");
    }
    const userId = req.user!.userId;
    const areActive = req.query.areActive === "true";
    const filteringText = req.query.filteringText;
    try {
      const notes = await getNotes(userId, areActive, filteringText);
      res.status(200).json(notes);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  }
);

router.post(
  "/update-tag-content",
  isAuthenticated,
  validateUpdateEntityRequestBody,
  tagIdCorrespondsToSessionUserId,
  async (req: Request<{}, {}, UpdateEntityBody>, res: Response) => {
    const tagId = req.body.id as number;
    const newContent = req.body.newContent!;
    try {
      await updateTagContent(tagId, newContent);
      res.sendStatus(204);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  }
);

router.post(
  "/update-note-content",
  isAuthenticated,
  validateUpdateEntityRequestBody,
  async (req: Request<{}, {}, UpdateEntityBody>, res: Response) => {
    const userId = req.user!.userId;
    const noteId = req.body.id as number;
    const newContent = req.body.newContent!;
    try {
      await updateNoteContent(userId, noteId, newContent);
      res.sendStatus(204);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  }
);

router.post("/create-note", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const newNoteId = await createNote(userId);
    res.status(201).json({ newNoteId });
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.post(
  "/create-tag",
  isAuthenticated,
  noteIdCorrespondsToSessionUserId,
  validateIdInRequestBody,
  async (req: Request<{}, {}, RequestBodyWithId>, res: Response) => {
    const noteId = req.body.id as number;
    if (!noteId) return res.status(400).send("Field id is missing in Request body");
    try {
      const newTagId = await createTag(noteId);
      res.status(201).json({ newTagId });
    } catch (error) {
      handleErrorResponse(error, res);
    }
  }
);

router.delete(
  "/delete-note",
  isAuthenticated,
  validateIdInRequestBody,
  async (req: Request<{}, {}, RequestBodyWithId>, res: Response) => {
    const noteId = req.body.id as number;
    if (!noteId) return res.status(400).send("Field noteId is missing in Request body");
    const userId = req.user!.userId;
    try {
      await deleteNote(noteId, userId);
      res.sendStatus(204);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  }
);

router.delete(
  "/delete-tag",
  isAuthenticated,
  tagIdCorrespondsToSessionUserId,
  validateIdInRequestBody,
  async (req: Request<{}, {}, RequestBodyWithId>, res: Response) => {
    const tagId = req.body.id as number;
    try {
      await deleteTag(tagId);
      res.sendStatus(204);
    } catch (error) {
      handleErrorResponse(error, res);
    }
  }
);

router.post(
  "/set-note-status",
  noteIdCorrespondsToSessionUserId,
  validateIdInRequestBody,
  async (req: Request<{}, {}, SetNoteStatusBody>, res: Response) => {
    const isActive = req.body.isActive;
    if (!isActive) return res.status(400).send("Field isActive has to be included in the body");
    if (typeof isActive !== "boolean")
      return res.status(400).send("Field isActive has to be a boolean");

    const noteId = req.body.id as number;
    try {
      await updateNoteStatus(noteId, isActive);
      res.sendStatus(204);
    } catch (error) {
      handleErrorResponse(error, res);
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
  (req: Request<{}, {}, AuthPostBody>, res: Response, next: NextFunction) => {
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

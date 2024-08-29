import express, { Request, Response } from "express";
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
  AuthErrors,
  AuthPostBody,
  GetNotesQueryParams,
  IsAuthenticatedResponse,
  RequestBodyWithId,
  SetNoteStatusBody,
  UpdateEntityBody,
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
import { authenticationCallback } from "../passport/passportConfig";

const router = express.Router();

router.get("/", (_: Request, res: Response) => {
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

router.post("/signup", hasUsernameAndPassword, (req: Request, res: Response) => {
  passport.authenticate("local-signup", (error: AuthErrors, user: UserT | false) =>
    authenticationCallback(error, user, req, res, "signup")
  )(req as Request, res as Response);
});

router.post(
  "/signin",
  hasUsernameAndPassword,
  (req: Request<{}, {}, AuthPostBody>, res: Response) => {
    passport.authenticate("local-signin", (error: AuthErrors, user: UserT | false) =>
      authenticationCallback(error, user, req, res, "signin")
    )(req as Request, res as Response);
  }
);

router.post("/signout", (req: Request, res: Response) => {
  req.logout((error) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Internal server error while attempting to login a user" });
    }
    res.sendStatus(200);
  });
});

router.get("/isauthenticated", isAuthenticated, async (req: Request, res: Response) => {
  res
    .status(200)
    .json({ isAuthenticated: true, username: req.user!.username } as IsAuthenticatedResponse);
});

export default router;

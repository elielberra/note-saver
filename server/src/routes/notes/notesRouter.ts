import express, { Request, Response } from "express";
import { createNote, deleteNote, getNotes, updateNoteContent, updateNoteStatus } from "../../dao";
import {
  GetNotesQueryParams,
  RequestBodyWithId,
  SetNoteStatusBody,
  UpdateEntityBody
} from "../../types/types";
import {
  verifyJWT,
  noteIdCorrespondsToSessionUserId,
  validateIdInRequestBody,
  validateUpdateEntityRequestBody
} from "../../middlewares";
import { handleErrorResponse } from "../utils";

const notesRouter = express.Router();

notesRouter.get(
  "/notes",
  verifyJWT,
  async (req: Request<object, object, object, GetNotesQueryParams>, res: Response) => {
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

notesRouter.post("/create-note", verifyJWT, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const newNoteId = await createNote(userId);
    res.status(201).json({ newNoteId });
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

notesRouter.post(
  "/update-note-content",
  verifyJWT,
  validateUpdateEntityRequestBody,
  async (req: Request<object, object, UpdateEntityBody>, res: Response) => {
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

notesRouter.delete(
  "/delete-note",
  verifyJWT,
  validateIdInRequestBody,
  async (req: Request<object, object, RequestBodyWithId>, res: Response) => {
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

notesRouter.post(
  "/set-note-status",
  verifyJWT,
  noteIdCorrespondsToSessionUserId,
  validateIdInRequestBody,
  async (req: Request<object, object, SetNoteStatusBody>, res: Response) => {
    const isActive = req.body.isActive;
    if (!isActive && isActive !== false)
      return res.status(400).send("Field isActive has to be included in the body");
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

export default notesRouter;

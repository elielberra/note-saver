import express, { Request, Response } from "express";
import { createTag, deleteTag, updateTagContent } from "../../dao";
import { RequestBodyWithId, UpdateEntityBody } from "../../types/types";
import {
  isAuthenticated,
  noteIdCorrespondsToSessionUserId,
  tagIdCorrespondsToSessionUserId,
  validateIdInRequestBody,
  validateUpdateEntityRequestBody
} from "../../middlewares";
import { handleErrorResponse } from "../utils";

const tagsRouter = express.Router();

tagsRouter.post(
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

tagsRouter.post(
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

tagsRouter.delete(
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

export default tagsRouter;

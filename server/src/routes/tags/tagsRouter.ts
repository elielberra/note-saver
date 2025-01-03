import express, { Request, Response } from "express";
import { createTag, deleteTag, updateTagContent } from "../../dao";
import { RequestBodyWithId, UpdateEntityBody } from "../../types/types";
import {
  verifyJWT,
  noteIdCorrespondsToSessionUserId,
  tagIdCorrespondsToSessionUserId,
  validateIdInRequestBody,
  validateUpdateEntityRequestBody
} from "../../middlewares";
import { handleErrorResponse } from "../utils";

const tagsRouter = express.Router();

tagsRouter.post(
  "/update-tag-content",
  verifyJWT,
  validateUpdateEntityRequestBody,
  tagIdCorrespondsToSessionUserId,
  async (req: Request<object, object, UpdateEntityBody>, res: Response) => {
    const tagId = req.body.id as number;
    const newContent = req.body.newContent!;
    try {
      await updateTagContent(tagId, newContent);
      res.sendStatus(204);
    } catch (error) {
      handleErrorResponse(res, "Error while updating a tag", error);
    }
  }
);

tagsRouter.post(
  "/create-tag",
  verifyJWT,
  noteIdCorrespondsToSessionUserId,
  validateIdInRequestBody,
  async (req: Request<object, object, RequestBodyWithId>, res: Response) => {
    const noteId = req.body.id as number;
    if (!noteId) return res.status(400).send("Field id is missing in Request body");
    try {
      const newTagId = await createTag(noteId);
      res.status(201).json({ newTagId });
    } catch (error) {
      handleErrorResponse(res, "Error while creating a tag", error);
    }
  }
);

tagsRouter.delete(
  "/delete-tag",
  verifyJWT,
  tagIdCorrespondsToSessionUserId,
  validateIdInRequestBody,
  async (req: Request<object, object, RequestBodyWithId>, res: Response) => {
    const tagId = req.body.id as number;
    try {
      await deleteTag(tagId);
      res.sendStatus(204);
    } catch (error) {
      handleErrorResponse(res, "Error while deleting a tag", error);
    }
  }
);

export default tagsRouter;

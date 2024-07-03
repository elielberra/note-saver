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
import { CreateTagBody, DelenteEntityBody, SetNoteStatusBody, UpdateTagBody } from "../types/types";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Express + Typescript server");
});

router.get("/test", async (req: Request, res: Response) => {
  res.status(200).send({ message: "Testing content" });
});

router.get("/notes", async (req: Request, res: Response) => {
  const areActive = req.query.areActive === "true";
  const filteringText = req.query.filteringText as string | undefined;
  const notes = await getNotes(areActive, filteringText);
  res.status(200).send(notes);
});

router.post("/update-tag-content", async (req: Request<Record<string, never>, Record<string, never>, UpdateTagBody>, res: Response) => {
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
});

router.post("/update-note-content", async (req: Request<Record<string, never>, Record<string, never>, UpdateTagBody>, res: Response) => {
  const { id, newContent } = req.body;
  if (!id) return res.status(400).send("Query parameter noteId is missing in Request");
  if (!newContent) return res.status(400).send("Query parameter newContent is missing in Request");
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
});

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

router.post("/create-tag", async (req: Request<Record<string, never>, Record<string, never>, CreateTagBody>, res: Response) => {
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
});

router.delete("/delete-note", async (req: Request<Record<string, never>, Record<string, never>, DelenteEntityBody>, res: Response) => {
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
});

router.delete("/delete-tag", async (req: Request<Record<string, never>, Record<string, never>, DelenteEntityBody>, res: Response) => {
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
});

router.post("/set-note-status", async (req: Request<Record<string, never>, Record<string, never>, SetNoteStatusBody>, res: Response) => {
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
});

export default router;

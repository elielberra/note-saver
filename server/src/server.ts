import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { getNotes, updateNoteContent } from "./dao";

dotenv.config();
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Express + Typescript server");
});

app.get("/test", async (req: Request, res: Response) => {
  res.status(200).send({ message: "Testing content" });
});

app.get("/notes", async (req: Request, res: Response) => {
  const notes = await getNotes();
  res.status(200).send(notes.rows);
});

app.post("/update-note-content", async (req: Request, res: Response) => {
  const noteIdStr = req.query.noteId as string;
  if (!noteIdStr) return res.status(400).send("Query parameter noteId is missing in Request");
  const noteId = parseInt(noteIdStr);
  if (Number.isNaN(noteId))
    return res.status(400).send("Query parameter noteId has to be a number");
  try {
    await updateNoteContent(noteId);
    res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      res.send(500).send(error.message);
    } else {
      res.sendStatus(500).send(error);
    }
  }
});

const port = process.env.BACKEND_PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

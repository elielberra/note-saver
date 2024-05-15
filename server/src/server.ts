import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { getNotes, updateNoteContent } from "./dao";
import { NoteT, UpdateNoteRequestBody } from "./types/types";

dotenv.config();
const app = express();
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Express + Typescript server");
});

app.get("/test", async (req: Request, res: Response) => {
  res.status(200).send({ message: "Testing content" });
});

app.get("/notes", async (req: Request, res: Response) => {
  const notes = await getNotes();
  console.debug("notes", notes)
  const notesCamelKeys: NoteT[] = notes.rows.map(note => {
    const { is_active, ...rest } = note;
    return { ...rest, isActive: is_active };
  });
  res.status(200).send(notesCamelKeys);
});

app.post("/update-note-content", async (req: Request<{}, {}, UpdateNoteRequestBody>, res: Response) => {
  const { id, newContent } = req.body;
  if (!id) return res.status(400).send("Query parameter noteId is missing in Request");
  if (Number.isNaN(id))
    return res.status(400).send("Query parameter noteId has to be a number");
  try {
    await updateNoteContent(id, newContent);
    res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      res.send(500).send(error.message);
    } else {
      res.sendStatus(500).send(error);
    }
  }
});

const port = process.env.BACKEND_PORT || 3333;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

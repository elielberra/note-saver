import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { getNotes, updateNoteContent } from "./dao";
import { UpdateRequestBody } from "./types/types";

dotenv.config();
const app = express();
app.use(express.json())

// TODO?: Separate into routes folder

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Express + Typescript server");
});

app.get("/test", async (req: Request, res: Response) => {
  res.status(200).send({ message: "Testing content" });
});

app.get("/notes", async (req: Request, res: Response) => {
  const notes = await getNotes();
  res.status(200).send(notes);
});

app.post("/update-tag-content", async (req: Request<{}, {}, UpdateRequestBody>, res: Response) => {
  const { id, newContent } = req.body;
  if (!id) return res.status(400).send("Query parameter tagId is missing in Request");
  if (!newContent) return res.status(400).send("Query parameter newContent is missing in Request");
  if (Number.isNaN(id))
    return res.status(400).send("Query parameter noteId has to be a number");
  try {
    // await updateTagContent(id, newContent);
    res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      res.send(500).send(error.message);
    } else {
      res.sendStatus(500).send(error);
    }
  }
});

app.post("/update-note-content", async (req: Request<{}, {}, UpdateRequestBody>, res: Response) => {
  const { id, newContent } = req.body;
  if (!id) return res.status(400).send("Query parameter noteId is missing in Request");
  if (!newContent) return res.status(400).send("Query parameter newContent is missing in Request");
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

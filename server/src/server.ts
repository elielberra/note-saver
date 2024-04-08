import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { getNotes } from "./dao";

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

app.post("update-note-content", async (req: Request, res: Response) => {
  // add logic
});

const port = process.env.BACKEND_PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

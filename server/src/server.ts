import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { getNotes } from "./dao";

dotenv.config();

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Express + Typescript server");
});

app.get("/test", async (req: Request, res: Response) => {
  res.send({ message: "Testing content" });
});

app.get("/notes", async (req: Request, res: Response) => {
  const notes = await getNotes();
  console.log(notes.rows)
});

const port = process.env.BACKEND_PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

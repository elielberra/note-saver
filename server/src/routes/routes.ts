import express, { Request, Response } from "express";
import authenticationRouter from "./authentication/authenticationRouter";
import notesRouter from "./notes/notes.Router";
import tagsRouter from "./tags/tagsRouter";

const router = express.Router();

router.get("/isalive", (_: Request, res: Response) => {
  res.status(200).send("NoteSaver server is alive");
});

router.use(notesRouter);

router.use(tagsRouter);

router.use(authenticationRouter);

export default router;

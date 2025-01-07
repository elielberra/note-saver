import express, { Request, Response } from "express";
import authenticationRouter from "./authentication/authenticationRouter";
import notesRouter from "./notes/notesRouter";
import tagsRouter from "./tags/tagsRouter";
import logsRouter from "./logs/logsRouter";

const router = express.Router();

router.get("/isalive", (_: Request, res: Response) => {
  res.status(200).send("NoteSaver server is alive");
});

router.use(notesRouter);

router.use(tagsRouter);

router.use(authenticationRouter);

router.use(logsRouter);

export default router;

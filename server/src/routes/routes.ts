import express, { Request, Response } from "express";
import authenticationRouter from "./authentication/authenticationRouter";
import notesRouter from "./notes/notesRouter";
import tagsRouter from "./tags/tagsRouter";
import logsRouter from "./logs/logsRouter";
import healthRouter from "./health/healthRouter";

const router = express.Router();

router.use(notesRouter);

router.use(tagsRouter);

router.use(authenticationRouter);

router.use(logsRouter);

router.use(healthRouter);

export default router;

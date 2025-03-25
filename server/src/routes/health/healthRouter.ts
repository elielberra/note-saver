import express, { Request, Response } from "express";

const healthRouter = express.Router();

healthRouter.get(
  "/health",
  async (_: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export default healthRouter;

import express, { Request, Response } from "express";
import { LogData } from "../../types/types";
import { isValidLogData } from "../utils";
import { generateLog } from "../../logging";

const logsRouter = express.Router();

logsRouter.post("/logs", async (req: Request<object, object, LogData>, res: Response) => {
  const logData = req.body;
  if (!isValidLogData(logData))
    res.status(400).send({
      message:
        "Invalid log data. Required fields: logLevel, logMessage, service. Optional: errorName, errorMessage, errorStack"
    });
  res.sendStatus(200);
  generateLog(logData);
});

export default logsRouter;

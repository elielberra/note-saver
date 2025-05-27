import bcrypt from "bcrypt";
import { Response } from "express";
import { generateLog, getLogErrorData } from "../logging";
import { LogData, UNSPECIFIED_ERROR } from "../types/types";
import { isTestingEnv } from "../lib/utils";

export async function checkIfPasswordIsValid(enteredPassword: string, userPassword: string) {
  return await bcrypt.compare(enteredPassword, userPassword);
}

export function handleErrorResponse(res: Response, message: string, error: unknown) {
  res.status(500).send("Internal server error");
  !isTestingEnv() &&
    generateLog({
      logLevel: "error",
      logMessage: message,
      service: "server",
      ...getLogErrorData(error)
    });
}

export function isValidLogData(logData: LogData): boolean {
  if (typeof logData !== "object") {
    return false;
  }
  return (
    (typeof logData.logLevel === "string" && logData.logLevel === "info") ||
    logData.logLevel === "warn" ||
    (logData.logLevel === "error" &&
      typeof logData.logMessage === "string" &&
      (logData.service === "client" || logData.service === "server") &&
      (logData.errorName === undefined ||
        typeof logData.errorName === "string" ||
        logData.errorName === UNSPECIFIED_ERROR) &&
      (logData.errorMessage === undefined || typeof logData.errorMessage === "string") &&
      (logData.errorStack === undefined || typeof logData.errorStack === "string"))
  );
}

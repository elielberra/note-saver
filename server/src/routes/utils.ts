import bcrypt from "bcrypt";
import { Response } from "express";
import { generateLog } from "../logging";

export async function checkIfPasswordIsValid(enteredPassword: string, userPassword: string) {
  return await bcrypt.compare(enteredPassword, userPassword);
}

export function handleErrorResponse(res: Response, message: string, error: unknown) {
  res.status(500).send("Internal server error");
  process.env.NODE_ENV !== "test" &&
    generateLog({
      logLevel: "error",
      logMessage: message,
      service: "server",
      error: error
    });
}

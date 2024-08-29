import bcrypt from "bcrypt";
import express, { Response } from "express";

export async function checkIfPasswordIsValid(enteredPassword: string, userPassword: string) {
  return await bcrypt.compare(enteredPassword, userPassword);
}

export function handleErrorResponse(error: unknown, res: Response) {
  res.status(500).send("Internal server error");
  console.log(error);
}

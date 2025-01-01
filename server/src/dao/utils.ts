import { genSalt, hash } from "bcrypt";
import { getDBClient } from "../db/utils";
import { QueryConfig } from "pg";
import { UserT } from "../types/types";
import { generateLog } from "../logging/utils";

export async function runQuery(query: QueryConfig, isUsingDatabase: boolean = true) {
  const dbClient = getDBClient(isUsingDatabase);
  try {
    await dbClient.connect();
    const result = await dbClient.query(query);
    return result;
  } catch (error) {
    generateLog({
      logLevel: "error",
      logMessage: `Error executing query:\n${JSON.stringify(query, null, 2)}`,
      service: "server"
    });
    throw error;
  } finally {
    await dbClient.end();
  }
}

export async function hashPassword(password: UserT["password"]) {
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}

import dotenv from "dotenv";
import { Client } from "pg";
import { ClientObject } from "../types/types";

dotenv.config();

function getDBObjectInfo(isUsingDatabase: boolean = true): ClientObject {
  return {
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    database: isUsingDatabase ? process.env.DB_NAME! : undefined
  };
}

export function getDBClient(isUsingDatabase: boolean = true): Client {
  return new Client(getDBObjectInfo(isUsingDatabase));
}

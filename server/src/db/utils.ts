import dotenv from "dotenv";
import { Client, Pool } from "pg";
import { ClientObject } from "../types/types";

dotenv.config();

function getDBObjectInfo(): ClientObject {
  return {
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    database: process.env.DB_NAME!
  };
}

// TODO: database will be seeded from init.sql file, delete isUsingDatabase param
export function getDBClient(): Client {
  return new Client(getDBObjectInfo());
}

export function getDBPool() {
  return new Pool(getDBObjectInfo());
}

export async function connectToDB(client: Client) {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL Database");
  } catch (error) {
    console.error("Error while connecting to DB", error);
  }
}

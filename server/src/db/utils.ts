import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

export function getDBClient(isUsingDatabase: boolean = true): Client {
  return new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || ""),
    database: isUsingDatabase ? process.env.DB_NAME : undefined
  });
}

export async function connectToDB(client: Client) {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL Database");
  } catch (error) {
    console.error("Error while connecting to DB", error);
  }
}

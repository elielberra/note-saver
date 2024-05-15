import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

export function getDBClient(isUsingDatabase: boolean = true): Client {
  console.log(process.env.DB_NAME)
  return new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || ""),
    database: isUsingDatabase ? process.env.DB_DATABASE : undefined
  });
}

export async function connectToDB(client: Client) {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL Database");
  } catch (error) {
    console.log("Error while connecting to DB", error);
  }
}

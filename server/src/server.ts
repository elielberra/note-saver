import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Client } from "pg";
import {createTable} from "./db/utils"

dotenv.config();

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Express + Typescript server");
});

app.get("/test", (req: Request, res: Response) => {
  res.send({ message: "Testing content" });
});

const dbClient = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || ''),
  database: process.env.DB_DATABASE
});

async function connectToDB(client: Client) {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL Database");
  } catch (error) {
    console.log("Error while connecting to DB", error);
  }
}

connectToDB(dbClient);
createTable(dbClient);

const port = process.env.BACKEND_PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

import { QueryConfig, QueryResult } from "pg";
import { getDBClient } from "../db/utils";
import { NoteT } from "../types/types";
import dotenv from "dotenv";

dotenv.config();

export async function getNotes() {
  const dbClient = getDBClient();
  const query = `SELECT * FROM ${process.env.DB_TABLE}`;
  try {
    dbClient.connect();
    const notes: QueryResult<NoteT> = await dbClient.query(query);
    return notes;
  } catch (error) {
    console.log(`Error executing query: ${query}`);
    throw error;
  } finally {
    dbClient.end();
  }
}

export async function updateNoteContent(noteId: number) {
  const dbClient = getDBClient();
  const query: QueryConfig = {
    text: `UPDATE ${process.env.DB_TABLE} SET content=$1 WHERE id=$2`,
    values: ["NEW CONTENT", noteId]
  };
  try {
    dbClient.connect();
    await dbClient.query(query);
  } catch (error) {
    console.log(`Error executing query: ${query}`);
    throw error;
  } finally {
    dbClient.end();
  }
}

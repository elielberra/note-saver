import { QueryResult } from "pg";
import { getDBClient } from "../db/utils";
import { NoteT } from "../types/types";

export async function getNotes() {
  const dbClient = getDBClient();
  try {
    dbClient.connect();
    const notes: QueryResult<NoteT> = await dbClient.query("SELECT * FROM notes");
    console.log(notes);
    return notes;
  } catch (error) {
    console.log("Error executing query");
    throw error;
  } finally {
    dbClient.end();
  }
}

import { QueryConfig, QueryResult } from "pg";
import { getDBClient } from "../db/utils";
// import { NotePSQL } from "../types/types";
import { NoteT } from "../types/types";
import dotenv from "dotenv";

dotenv.config();

export async function getNotes() {
  const dbClient = getDBClient();
  const query = `SELECT
                  n.id AS "noteId",
                  n.content AS "noteContent",
                  n.is_active as "isActive",
                  jsonb_agg(jsonb_build_object('tagId', t.id, 'tagContent', t.tag)) AS tags
                FROM
                  ${process.env.DB_NOTES_TABLE} n
                LEFT JOIN
                  tags t ON n.id = t.note_id
                GROUP BY
                  n.id, n.content, n.is_active;`;
  try {
    dbClient.connect();
    const notes: QueryResult<NoteT> = await dbClient.query(query);
    return notes.rows;
  } catch (error) {
    console.error(`Error executing query: ${query}`);
    throw error;
  } finally {
    dbClient.end();
  }
}

export async function updateNoteContent(noteId: number, newContent: string) {
  const dbClient = getDBClient();
  const query: QueryConfig = {
    text: `UPDATE ${process.env.DB_NOTES_TABLE} SET content=$1 WHERE id=$2`,
    values: [newContent, noteId]
  };
  try {
    dbClient.connect();
    await dbClient.query(query);
  } catch (error) {
    console.error(`Error executing query: ${query}`);
    throw error;
  } finally {
    dbClient.end();
  }
}

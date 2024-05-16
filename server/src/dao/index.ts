import { QueryConfig, QueryResult } from "pg";
import { getDBClient } from "../db/utils";
import { NoteT } from "../types/types";
import dotenv from "dotenv";

dotenv.config();

export async function getNotes() {
  const dbClient = getDBClient();
  const query = `SELECT
                  n.id AS "noteId",
                  n.content AS "noteContent",
                  n.is_active as "isActive",
                  jsonb_agg(jsonb_build_object('tagId', t.id, 'tagContent', t.tag) ORDER BY t.id) AS tags
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
    text: `UPDATE ${process.env.DB_NOTES_TABLE} SET content = $1 WHERE id = $2`,
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

// TODO: Use a more efficient design to avoid code duplication
// Pearhaps send the query as dependency injection
// Set param type from the types of the entities
export async function updateTagContent(tagId: number, newContent: string) {
  const dbClient = getDBClient();
  const query: QueryConfig = {
    text: `UPDATE ${process.env.DB_TAGS_TABLE} SET tag = $1 WHERE id = $2`,
    values: [newContent, tagId]
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

export async function createNote() {
  const dbClient = getDBClient();
  const query = `INSERT INTO ${process.env.DB_NOTES_TABLE} (content, is_active) VALUES('', true) RETURNING id`;
  try {
    dbClient.connect();
    const res: QueryResult<{id: number}> = await dbClient.query(query);
    const insertedId = res.rows[0].id;
    return insertedId;
  } catch (error) {
    console.error(`Error executing query: ${query}`);
    throw error;
  } finally {
    dbClient.end();
  }
}

export async function createTag(noteId: number) {
  const dbClient = getDBClient();
  const query: QueryConfig = {
    text: `INSERT INTO ${process.env.DB_TAGS_TABLE} (tag, note_id) VALUES('', $1) RETURNING id`,
    values: [noteId]
  };
  try {
    dbClient.connect();
    const res: QueryResult<{id: number}> = await dbClient.query(query);
    const insertedId = res.rows[0].id;
    return insertedId;
  } catch (error) {
    console.error(`Error executing query: ${query}`);
    throw error;
  } finally {
    dbClient.end();
  }
}

export async function deleteNote(id: number) {
  const dbClient = getDBClient();
  const query: QueryConfig = {
    text: `DELETE FROM ${process.env.DB_NOTES_TABLE} WHERE id = $1`,
    values: [id]
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

export async function deleteTag(id: number) {
  const dbClient = getDBClient();
  const query: QueryConfig = {
    text: `DELETE FROM ${process.env.DB_TAGS_TABLE} WHERE id = $1`,
    values: [id]
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

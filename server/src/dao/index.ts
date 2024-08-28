import { QueryConfig, QueryResult } from "pg";
import { NoteT, TagT, UserT } from "../types/types";
import dotenv from "dotenv";
import { runQuery } from "./utils";

dotenv.config();

export async function getNotes(
  userId: UserT["userId"],
  areActive: NoteT["isActive"],
  filteringText: string | undefined
) {
  const query: QueryConfig = {
    text: `SELECT
            n.id AS "noteId",
            n.content AS "noteContent",
            n.is_active as "isActive",
            CASE
              WHEN COUNT(t.id) > 0 THEN jsonb_agg(jsonb_build_object('tagId', t.id, 'tagContent', t.tag) ORDER BY t.id)
              ELSE '[]'::jsonb
            END AS tags
          FROM
            ${process.env.DB_NOTES_TABLE} n
          LEFT JOIN
            tags t ON n.id = t.note_id
          WHERE
            n.user_id = ${userId}
            AND n.is_active = ${areActive}
            ${filteringText ? `AND t.tag LIKE '%${filteringText}%'` : ""}
          GROUP BY
            n.id, n.content, n.is_active;`
  };
  const result: QueryResult<NoteT> = await runQuery(query);
  return result.rows;
}

export async function updateNoteContent(userId: UserT["userId"], noteId: NoteT["noteId"], newContent: NoteT["noteContent"]) {
  const query: QueryConfig = {
    text: `UPDATE ${process.env.DB_NOTES_TABLE} SET content = $1 WHERE id = $2 and user_id = $3`,
    values: [newContent, noteId, userId]
  };
  await runQuery(query);
}

export async function updateTagContent(tagId: TagT["tagId"], newContent: TagT["tagContent"]) {
  const query: QueryConfig = {
    text: `UPDATE ${process.env.DB_TAGS_TABLE} SET tag = $1 WHERE id = $2`,
    values: [newContent, tagId]
  };
  await runQuery(query);
}

export async function createNote(userId: UserT["userId"]) {
  const query: QueryConfig = {
    text: `INSERT INTO ${process.env.DB_NOTES_TABLE} (content, is_active, user_id) VALUES('', true, $1) RETURNING id`,
    values: [userId]
  };
  const result: QueryResult<{ id: number }> = await runQuery(query);
  const insertedId = result.rows[0].id;
  return insertedId;
}

export async function createTag(tagId: TagT["tagId"]) {
  const query: QueryConfig = {
    text: `INSERT INTO ${process.env.DB_TAGS_TABLE} (tag, note_id) VALUES('', $1) RETURNING id`,
    values: [tagId]
  };
  const result: QueryResult<{ id: number }> = await runQuery(query);
  const insertedId = result.rows[0].id;
  return insertedId;
}

export async function deleteNote(noteId: NoteT["noteId"], userId: UserT["userId"]) {
  const query: QueryConfig = {
    text: `DELETE FROM ${process.env.DB_NOTES_TABLE} WHERE id = $1 and user_id = $2`,
    values: [noteId, userId]
  };
  await runQuery(query);
}

export async function deleteTag(id: TagT["tagId"]) {
  const query: QueryConfig = {
    text: `DELETE FROM ${process.env.DB_TAGS_TABLE} WHERE id = $1`,
    values: [id]
  };
  await runQuery(query);
}

export async function updateNoteStatus(noteId: NoteT["noteId"], isActive: NoteT["isActive"]) {
  const query: QueryConfig = {
    text: `UPDATE ${process.env.DB_NOTES_TABLE} SET is_active = $1 WHERE id = $2`,
    values: [isActive, noteId]
  };
  await runQuery(query);
}

// Unify into getUserByField
export async function getUserById(id: UserT["userId"]) {
  const query: QueryConfig = {
    text: `SELECT id AS "userId", username, password FROM ${process.env.DB_USERS_TABLE} WHERE id = $1`,
    values: [id]
  };
  const result: QueryResult<UserT> = await runQuery(query);
  if (result.rows) return result.rows[0];
  return null;
}

export async function getUserByUsermame(username: UserT["username"]) {
  const query: QueryConfig = {
    text: `SELECT id AS "userId", username, password FROM ${process.env.DB_USERS_TABLE} WHERE username = $1`,
    values: [username]
  };
  const result: QueryResult<UserT> = await runQuery(query);
  if (result.rows) return result.rows[0];
  return null;
}

export async function getUserIdFromTagId(tagId: TagT["tagId"]) {
  const query: QueryConfig = {
    text: `SELECT 
            ${process.env.DB_NOTES_TABLE}.user_id AS "verifiedUserIdFromTag"
          FROM                                 
            ${process.env.DB_TAGS_TABLE}
          JOIN 
            ${process.env.DB_NOTES_TABLE} ON tags.note_id = ${process.env.DB_NOTES_TABLE}.id
          WHERE
            ${process.env.DB_TAGS_TABLE}.id = $1;`,
    values: [tagId]
  };
  const result: QueryResult<{verifiedUserIdFromTag: number}> = await runQuery(query);
  if (result.rows) return result.rows[0];
  return null;
}

export async function getUserIdFromNoteId(noteId: NoteT["noteId"]) {
  const query: QueryConfig = {
    text: `SELECT user_id AS "verifiedUserIdFromNote" FROM ${process.env.DB_NOTES_TABLE} WHERE id = $1`,
    values: [noteId]
  };
  const result: QueryResult<{verifiedUserIdFromNote: number}> = await runQuery(query);
  if (result.rows) return result.rows[0];
  return null;
}



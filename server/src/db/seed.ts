import { QueryConfig } from "pg";
import dotenv from "dotenv";
import { hashPassword, runQuery } from "../dao/utils";

dotenv.config();

async function deleteAndCreateDatabase() {
  const terminateActiveConnections: QueryConfig = {
    text: `DO $$
          BEGIN
            IF EXISTS (
              SELECT FROM pg_database WHERE datname = '${process.env.DB_NAME}'
            ) THEN
              PERFORM pg_terminate_backend(pid)
              FROM pg_stat_activity
              WHERE datname = '${process.env.DB_NAME}';
            END IF;
          END $$;`
  };
  await runQuery(terminateActiveConnections, false);
  const dropBDIfExists: QueryConfig = {
    text: `DROP DATABASE IF EXISTS ${process.env.DB_NAME};`
  };
  await runQuery(dropBDIfExists, false);
  const createDBQuery: QueryConfig = {
    text: `CREATE DATABASE ${process.env.DB_NAME};`
  };
  await runQuery(createDBQuery, false);
}

async function runSeedingQueries() {
  // username and password character numbers must match maxLength on textarea of AuthForm.tsx
  const createUsersTableQuery: QueryConfig = {
    text: `CREATE TABLE ${process.env.DB_USERS_TABLE}(
          id SERIAL PRIMARY KEY,
          username VARCHAR(30) NOT NULL UNIQUE,
          password VARCHAR(60) NOT NULL
          )`
  };
  await runQuery(createUsersTableQuery);
  const adminHashedPassword = await hashPassword(process.env.ADMIN_PASSWORD || "admin");
  const insertAdminUserQuery: QueryConfig = {
    text: `INSERT INTO ${process.env.DB_USERS_TABLE} (username, password) VALUES ($1, $2)`,
    values: ["admin", adminHashedPassword]
  };
  await runQuery(insertAdminUserQuery);
  // content character numbers must match maxLength on textarea of Note.tsx
  const createNotesTableQuery: QueryConfig = {
    text: `CREATE TABLE ${process.env.DB_NOTES_TABLE}(
          id SERIAL PRIMARY KEY,
          content VARCHAR(2500) NOT NULL,
          is_active BOOLEAN NOT NULL,
          user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE
          )`
  };
  await runQuery(createNotesTableQuery);
  // Issue https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/70402 pending response
  const insertNotesQuery: QueryConfig = {
    text: `INSERT INTO ${process.env.DB_NOTES_TABLE} (content, is_active, user_id) VALUES ($1, $2, $3)`,
    values: ["The nth note", true, 1]
  };
  await runQuery(insertNotesQuery);
  // tag character numbers must match maxLength on textarea of Note.tsx
  const createTagsTableQuery: QueryConfig = {
    text: `CREATE TABLE ${process.env.DB_TAGS_TABLE}(
          id SERIAL PRIMARY KEY,
          tag VARCHAR(20) NOT NULL,
          note_id INTEGER NOT NULL REFERENCES ${process.env.DB_NOTES_TABLE} (id) ON DELETE CASCADE
          )`
  };
  await runQuery(createTagsTableQuery);
  const insertTagsQuery: QueryConfig = {
    text: `INSERT INTO ${process.env.DB_TAGS_TABLE} (tag, note_id) VALUES ($1, $2), ($3, $4)`,
    values: ["tag1", 1, "tag2", 1]
  };
  await runQuery(insertTagsQuery);
}

async function main() {
  await deleteAndCreateDatabase();
  await runSeedingQueries();
}

main();

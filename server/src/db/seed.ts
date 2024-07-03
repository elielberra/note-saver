import { Client, QueryConfig } from "pg";
import { getDBClient, connectToDB } from "./utils";
import dotenv from "dotenv";

dotenv.config();

async function dropAndCreateDatabase(client: Client) {
  const dropBDIfExists = `DROP DATABASE IF EXISTS ${process.env.DB_NAME};`;
  const createDBQuery = `CREATE DATABASE ${process.env.DB_NAME};`;
  try {
    await client.query(dropBDIfExists);
    await client.query(createDBQuery);
  } catch (error) {
    console.error("Error running the query", error);
  } finally {
    await client.end();
  }
}

async function runQueries(client: Client) {
  // content character numbers must match maxLength on textarea of Note.tsx
  const createNotesTableQuery = `CREATE TABLE ${process.env.DB_NOTES_TABLE}(
        id SERIAL PRIMARY KEY,
        content VARCHAR(2500) NOT NULL,
        is_active BOOLEAN NOT NULL
    )`;
  // Issue not solved https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/69248
  // PR not working https://github.com/DefinitelyTyped/DefinitelyTyped/pull/69053/files
  // I am using @types/pg for the postgresql driver of node. I am trying to set the types of a query using the type `QueryConfig`, but it doesn't allow me to correctly set the types of the values of the query, leaving all of them with the default type `any`. I want to have a more strict control over the types of the query, indicating if they are a string, a number, an array, etc.
  // I think that the distributive conditional of the `QueryConfigValues` type is not being correctly handled. I have added what I think is the solution and a potential pull request on the typescript playground I am leaving at the end. Please let me know if something was not clear enough. Thanks!
  // https://tsplay.dev/WY1y3W
  const insertNotesQuery: QueryConfig = {
    text: `INSERT INTO ${process.env.DB_NOTES_TABLE} (content, is_active) VALUES ($1, $2)`,
    values: ["The nth note", true]
  };
  const deleteTagsTableQuery = `DROP TABLE IF EXISTS ${process.env.DB_TAGS_TABLE} CASCADE`;
  // tag character numbers must match maxLength on textarea of Note.tsx
  const createTagsTableQuery = `CREATE TABLE ${process.env.DB_TAGS_TABLE}(
    id SERIAL PRIMARY KEY,
    tag VARCHAR(20) NOT NULL,
    note_id INTEGER NOT NULL REFERENCES ${process.env.DB_NOTES_TABLE} (id) ON DELETE CASCADE
  )`;
  const inserTagsQuery: QueryConfig = {
    text: `INSERT INTO ${process.env.DB_TAGS_TABLE} (tag, note_id) VALUES ($1, $2), ($3, $4)`,
    values: ["tag1", 1, "tag2", 1]
  };
  const queries = [
    createNotesTableQuery,
    insertNotesQuery,
    deleteTagsTableQuery,
    createTagsTableQuery,
    inserTagsQuery
  ];
  try {
    for (const query of queries) {
      await client.query(query);
    }
    console.log("All queries were successful!");
  } catch (error) {
    console.error(`Error running the query`, error);
  } finally {
    await client.end();
  }
}

async function main() {
  const dbClientWithNoDB = getDBClient(false);
  await connectToDB(dbClientWithNoDB);
  await dropAndCreateDatabase(dbClientWithNoDB);
  const dbClientWithDB = getDBClient();
  await connectToDB(dbClientWithDB);
  await runQueries(dbClientWithDB);
}

main();

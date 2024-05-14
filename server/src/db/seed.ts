import { Client, QueryConfig } from "pg";
import { getDBClient, connectToDB } from "./utils";
import dotenv from "dotenv";

dotenv.config()

async function createDatabase(client: Client) {
  const createDBQuery = `SELECT 'CREATE DATABASE  ${process.env.DB_NAME}' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${process.env.DB_NAME}')`;
  try {
    await client.query(createDBQuery);
  } catch (error) {
    console.log("Error running the query", error);
  } finally {
    await client.end();
  }
}

async function runQueries(client: Client) {
  const deleteTableQuery = `DROP TABLE IF EXISTS ${process.env.DB_TABLE}`;
  const createTableQuery = `CREATE TABLE ${process.env.DB_TABLE}(
        id SERIAL PRIMARY KEY,
        content VARCHAR(500) NOT NULL,
        tags VARCHAR(20)[],
        is_active BOOLEAN NOT NULL
    )`;
  // Ask quesiton on StackOverflow and possible PushRequest on GIT
  const insertNotesQuery: QueryConfig = {
    text: `INSERT INTO ${process.env.DB_TABLE}(content, tags, is_active) VALUES($1, $2, $3)`,
    values: ["The nth note", ["tag1", "tag2"], true]
  };
  const queries = [deleteTableQuery, createTableQuery, insertNotesQuery];
  try {
    for (const query of queries) {
      await client.query(query)
    }
    console.log("All queries were successful!");
  } catch (error) {
    console.log(`Error running the query`, error);
  } finally {
    await client.end();
  }
}

async function main() {
  const dbClientWithNoDB = getDBClient(false);
  await connectToDB(dbClientWithNoDB);
  await createDatabase(dbClientWithNoDB);
  const dbClientWithDB = getDBClient(true);
  await connectToDB(dbClientWithDB);
  await runQueries(dbClientWithDB);
}

main();

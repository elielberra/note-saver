import { Client, QueryConfig } from "pg";
import { getDBClient, connectToDB } from "./utils";
import dotenv from "dotenv";

dotenv.config()

async function runQueries(client: Client) {
  const deleteTableQuery = `DROP TABLE IF EXISTS ${process.env.DB_TABLE}`;
  const createTableQuery = `CREATE TABLE notes(
        id SERIAL PRIMARY KEY,
        content VARCHAR(500) NOT NULL,
        tags VARCHAR(20)[],
        is_active BOOLEAN NOT NULL
    )`;
                          // Ask quesiton on StackOverflow and possible PushRequest on GIT
  const insertNotesQuery: QueryConfig = {
    text: "INSERT INTO notes(content, tags, is_active) VALUES($1, $2, $3)",
    values: ["The nth note", ["tag1", "tag2"], true]
  };
  const queries = [deleteTableQuery, createTableQuery, insertNotesQuery]
  try {
    for (const query of queries) {
      await client.query(query)
    }
    console.log("All queries were successful!");
  } catch (error) {
    console.log("Error running the query", error);
  } finally {
    await client.end()
  }
}

async function main() {
  const dbClient = getDBClient();
  await connectToDB(dbClient);
  await runQueries(dbClient);
}

main();

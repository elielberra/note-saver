import { Client, QueryConfig } from "pg";
import { getDBClient, connectToDB } from "./utils";

async function runQueries(client: Client) {
  const createTableQuery = `CREATE TABLE notes(
        id SERIAL PRIMARY KEY,
        content VARCHAR(500) NOT NULL,
        tags VARCHAR(20)[],
        is_active BOOLEAN NOT NULL
    )`;
                          // Ask quesiton on StackOverflow and possible PushRequest on GIT
  const insertNotesQuery: QueryConfig<any> = {
    text: "INSERT INTO notes(content, tags, is_active) VALUES($1, $2, $3)",
    values: ["The nth note", ["tag1", "tag2"], true]
  };
  try {
    await client.query(createTableQuery);
    await client.query(insertNotesQuery);
    console.log("Query Successful!");
  } catch (error) {
    console.log("Error running the query", error);
  } finally {
    client.end()
  }
}

async function main() {
  const dbClient = getDBClient();
  connectToDB(dbClient);
  await runQueries(dbClient);
}

main();

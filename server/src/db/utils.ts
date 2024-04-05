import { Client } from "pg";

export async function createTable(client: Client) {
  const createTableQuery = `CREATE TABLE notes(
        id SERIAL PRIMARY KEY,
        content VARCHAR(500) NOT NULL,
        tags VARCHAR(20)[]
    )`;
  try {
    await client.query(createTableQuery);
    console.log("Create Table Query Successful!")
  } catch (error) {
    console.log("Error creating the table", error);
  }
}

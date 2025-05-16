import { Client } from "pg";
import { ServiceError } from "./errors.js";

async function query(queryObject) {
  let client;
  try {
    client = await getDBClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    const publicErrorObject = new ServiceError({
      message: "Database Error: connection/query",
      cause: error,
    });
    throw publicErrorObject;
  } finally {
    await client?.end();
  }
}

async function getDBClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "production" ? true : false,
  });
  await client.connect();
  return client;
}

const database = {
  query,
  getDBClient,
};

export default database;

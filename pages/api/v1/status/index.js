import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  //Data Struture - DS
  const dateISO8601 = new Date().toISOString();

  const dbVersionQueryResult = await database.query("SHOW server_version");
  const dbVersionQueryResultValue = dbVersionQueryResult.rows[0].server_version;

  const maxConnQueryResult = await database.query("SHOW max_connections");
  const maxConnQueryResultValue = maxConnQueryResult.rows[0].max_connections;

  const dbName = process.env.POSTGRES_DB;
  const openedConnQueryResult = await database.query(
    //SQL Injection Prevention
    //Prepared Statements
    {
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [dbName],
    },
  );
  const openedConnQueryResultValue = openedConnQueryResult.rows[0].count;

  //Response JSON Algorithm
  response.status(200).json({
    updated_at: dateISO8601,
    dependencies: {
      database: {
        version: dbVersionQueryResultValue,
        max_connections: parseInt(maxConnQueryResultValue),
        opened_connections: openedConnQueryResultValue,
      },
    },
  });
}

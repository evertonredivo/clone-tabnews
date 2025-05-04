// Endpoint: /api/v1/migrations
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  if (request.method !== "GET" && request.method !== "POST") {
    return response.status(405).json({
      error: `Method *${request.method}* Not Allowed`,
    });
  }

  let dbCLient;
  try {
    dbCLient = await database.getNewConnectedClient();
    const defaultMigrationOptions = {
      dbClient: dbCLient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbCLient.end();
  }
}

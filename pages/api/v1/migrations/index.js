import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  let dbCLient;

  try {
    dbCLient = await database.getDBClient();
    const defaultMigrationOptions = {
      dbClient: dbCLient,
      dryRun: false,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    const migratedMigrations = await migrationRunner(defaultMigrationOptions);

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  } finally {
    await dbCLient.end();
  }
}

async function getHandler(request, response) {
  let dbCLient;

  try {
    dbCLient = await database.getDBClient();
    const defaultMigrationOptions = {
      dbClient: dbCLient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    return response.status(200).json(pendingMigrations);
  } finally {
    await dbCLient.end();
  }
}

import retry from "async-retry";
import database from "infra/database.js";
import migrator from "models/migrator.js";

async function waitForAllServices() {
  await waitForWebServer();
  //... other services
}

async function waitForWebServer() {
  return retry(fetchStatusEndpoint, {
    retries: 100,
    maxTimeout: 1000,
  });
}

async function fetchStatusEndpoint() {
  const response = await fetch("http://localhost:3000/api/v1/status");
  if (response.status !== 200) {
    throw Error();
  }
}

async function clearDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
};

export default orchestrator;

import retry from "async-retry";
import database from "infra/database.js";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(feetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function feetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;

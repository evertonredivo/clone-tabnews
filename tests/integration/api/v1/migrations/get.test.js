import database from "infra/database.js";
import orquestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
});

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Running pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");

      const responseBody = await response.json();
      expect(response.status).toBe(200);
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});

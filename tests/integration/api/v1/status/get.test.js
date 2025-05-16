import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody).toBeDefined();

      /*
   / Date Time ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ 
   / Z: Military time zone, (Z)ulu Time Zone, UTC+00:00
  */
      const updatedAt = responseBody.updated_at;
      const parsedUpdatedAt = new Date(updatedAt).toISOString();
      expect(updatedAt).toEqual(parsedUpdatedAt);

      /*
   / Database Version Hard coded
   / See version in compose.yaml
  */
      const dbVersion = "16.8";
      expect(responseBody.dependencies.database.version).toBe(dbVersion);

      /*
   / Database Max Connections
  */
      const dbMaxConnections = 100;
      expect(responseBody.dependencies.database.max_connections).toBe(
        dbMaxConnections,
      );

      /*
   / Database Max Connections
  */
      const openedConnections = 1;
      expect(responseBody.dependencies.database.opened_connections).toBe(
        openedConnections,
      );
    });
  });
});

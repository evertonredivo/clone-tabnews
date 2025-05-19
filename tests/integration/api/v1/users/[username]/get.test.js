import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case sensitive match", async () => {
      const responseCreateUser = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "EvertonRedivo",
            email: "redivo@hotmail.com",
            password: "123abc",
          }),
        },
      );
      expect(responseCreateUser.status).toBe(201);

      const responseGetUserExactCase = await fetch(
        "http://localhost:3000/api/v1/users/EvertonRedivo",
        {
          method: "GET",
        },
      );
      expect(responseGetUserExactCase.status).toBe(200);

      const responseBodyGetUserExactCase =
        await responseGetUserExactCase.json();
      expect(responseBodyGetUserExactCase).toEqual({
        id: responseBodyGetUserExactCase.id,
        username: "EvertonRedivo",
        email: "redivo@hotmail.com",
        password: "123abc",
        created_at: responseBodyGetUserExactCase.created_at,
        updated_at: responseBodyGetUserExactCase.updated_at,
      });
      expect(uuidVersion(responseBodyGetUserExactCase.id)).toBe(4);
      expect(Date.parse(responseBodyGetUserExactCase.created_at)).not.toBeNaN();
      expect(Date.parse(responseBodyGetUserExactCase.updated_at)).not.toBeNaN();
    });

    test("With case sensitive mismatch", async () => {
      const responseGetUserMismatch = await fetch(
        "http://localhost:3000/api/v1/users/evertonredivo",
        {
          method: "GET",
        },
      );
      //console.log(await responseGetUserMismatch.json());
      expect(responseGetUserMismatch.status).toBe(200);

      const responseBodyGetUserMismatch = await responseGetUserMismatch.json();
      expect(responseBodyGetUserMismatch).toEqual({
        id: responseBodyGetUserMismatch.id,
        username: "EvertonRedivo",
        email: "redivo@hotmail.com",
        password: "123abc",
        created_at: responseBodyGetUserMismatch.created_at,
        updated_at: responseBodyGetUserMismatch.updated_at,
      });
      expect(uuidVersion(responseBodyGetUserMismatch.id)).toBe(4);
      expect(Date.parse(responseBodyGetUserMismatch.created_at)).not.toBeNaN();
      expect(Date.parse(responseBodyGetUserMismatch.updated_at)).not.toBeNaN();
    });

    test("With username not found", async () => {
      const responseGetNotFoundUser = await fetch(
        "http://localhost:3000/api/v1/users/Redivo",
        {
          method: "GET",
        },
      );
      expect(responseGetNotFoundUser.status).toBe(404);

      const responseBodyGetNotFoundUser = await responseGetNotFoundUser.json();
      console.log(responseBodyGetNotFoundUser);
      expect(responseBodyGetNotFoundUser).toEqual({
        name: "NotFoundError",
        message: "User not found",
        action: "Check username and try again",
        status_code: 404,
      });
    });
  });
});

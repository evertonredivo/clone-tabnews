import database from "infra/database.js";
import { ValidationError } from "infra/errors.js";

async function create(userInputValues) {
  await validateUniqueUsename(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  const newUser = await runInsertUserQuery(userInputValues);
  return newUser;

  async function validateUniqueUsename(username) {
    const results = await database.query({
      text: `
        SELECT
          username
        FROM
            users
        WHERE
          LOWER(username) = LOWER($1)
        ;`,
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "Invalid username. Try again.",
        action: "Insert other usename.",
      });
    }
  }

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
        SELECT
          email
        FROM
            users
        WHERE
          LOWER(email) = LOWER($1)
        ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "Invalid e-mail address. Try again.",
        action: "Insert other e-mail.",
      });
    }
  }

  async function runInsertUserQuery(userInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO 
          users (username, email, password)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
        ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0];
  }
}

const user = {
  create,
};

export default user;

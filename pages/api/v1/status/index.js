import database from "../../../../infra/database.js";

async function status(request, response) {
  const endpoint_name = "Status";
  const result = await database.query("SELECT current_database();");
  const current_database = result.rows[0].current_database;
  response.status(200).json({
    "API Endpoint": endpoint_name,
    "Current Database": current_database,
  });
}

export default status;

import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseInfo />
    </>
  );
}

function DatabaseInfo() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseInfoText = "Carregando...";

  if (!isLoading && data) {
    databaseInfoText = (
      <>
        <div>Version: {data.dependencies.database.version}</div>
        <div>Max Connections: {data.dependencies.database.max_connections}</div>
        <div>
          Opened Connections: {data.dependencies.database.opened_connections}
        </div>
      </>
    );
  }
  return (
    <>
      <h2>Database</h2>
      <div>{databaseInfoText}</div>
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return <div>Última atualização: {updatedAtText}</div>;
}

/* "database": {
      "version": "16.8",
      "max_connections": 100,
      "opened_connections": 1 */

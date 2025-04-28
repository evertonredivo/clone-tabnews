test("GET to /api/v1/status should return HTTP status code = 200;", async () => {
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

//console.log(await response.json()); Só pode chamar .json() uma vez no mesmo response, porque o body é um stream: depois que lê uma vez, acabou.
//Usar Expressões Regulares (Regex) para Validar o Formato ISO
//Estudar as tabelas internas do PostgreSQL
//SQL Injection é um ataque que tenta manipular o banco de dados através de comandos SQL maliciosos.
//O SQL Injection pode ser evitado usando Prepared Statements ou ORM (Object Relational Mapping).
//Prepared Statements são consultas SQL pré-compiladas que podem ser reutilizadas com diferentes parâmetros.
//Isso ajuda a evitar SQL Injection, pois os parâmetros são tratados como dados e não como parte da consulta SQL.
//O que é um Prepared Statement?
//Um Prepared Statement é uma consulta SQL que é pré-compilada e armazenada no banco de dados.
//O que é um ORM? Object Relational Mapping
//ORM é uma técnica de programação que permite mapear objetos em código para tabelas em um banco de dados relacional.
//Isso facilita a interação com o banco de dados, permitindo que os desenvolvedores trabalhem com objetos em vez de escrever consultas SQL diretamente.
//O que é um banco de dados relacional?
//Um banco de dados relacional é um tipo de banco de dados que organiza os dados em tabelas, onde cada tabela tem colunas e linhas.
//As tabelas podem se relacionar entre si através de chaves primárias e estrangeiras, permitindo consultas complexas e integridade referencial
//O método json() do objeto response é usado para enviar uma resposta JSON ao cliente.
//Ele converte o objeto JavaScript passado como argumento em uma string JSON e define o cabeçalho Content-Type como application/json.
//Isso é útil para APIs que retornam dados em formato JSON, permitindo que o cliente interprete a resposta corretamente.
//O método json() também pode ser encadeado com outros métodos, como status(), para definir o código de status HTTP da resposta.
//O método json() é uma maneira conveniente de enviar dados estruturados em resposta a uma solicitação HTTP, facilitando a comunicação entre o servidor e o cliente.
// tecla de atalho para delete linha: Ctrl + D
// Queries parametrizadas são uma maneira de evitar SQL Injection, pois os parâmetros são tratados como dados e não como parte da consulta SQL.
// Isso significa que os parâmetros são escapados e não podem ser interpretados como comandos SQL.
// Isso ajuda a proteger o banco de dados contra ataques de injeção de SQL, onde um invasor tenta manipular a consulta SQL para executar comandos maliciosos.
// Além disso, as consultas parametrizadas podem melhorar o desempenho, pois o banco de dados pode reutilizar planos de execução para consultas semelhantes.
// Isso reduz a sobrecarga de processamento e melhora a eficiência geral do banco de dados.

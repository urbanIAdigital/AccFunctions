import sql from "mssql";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { saveToJsonFile } from "./saveFile.js";

// Obtener la ruta del directorio actual en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parámetros de conexión
const config = {
  user: "consulta",
  password: "seven7.8",
  server: "10.158.23.231",
  database: "seven",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  requestTimeout: 60000, // Establece el timeout a 60 segundos
};
const queryFileName = "CONTRATOS_DERIVADOS.sql";
// const queryFileName = "CONTRATOS_INTERADMINISTRATIVOS.sql";

// Ruta al archivo SQL
const queryFilePath = path.join(__dirname, "..", "sqlQueries", queryFileName);

async function executeQuery() {
  try {
    // Leer el archivo SQL
    const query = fs.readFileSync(queryFilePath, "utf-8");

    // Conectar al servidor SQL
    await sql.connect(config);

    // Ejecutar la consulta SQL
    const result = await sql.query(query);
    saveToJsonFile(
      "contratosDerivados",
      result.recordset.map((rec) => rec)
    );
    // Mostrar los resultados en consola
    // console.log(result.recordset.map((rec) => rec));s

    // Cerrar la conexión
    sql.close();
  } catch (err) {
    console.error("Error ejecutando la consulta:", err);
  }
}

// Ejecutar la consulta
executeQuery();

import sql from "mssql";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createObjectCsvWriter } from "csv-writer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  user: "consulta",
  password: "seven7.8",
  server: "10.158.23.231",
  database: "seven",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  requestTimeout: 1000000,
};
// const queryFileName = "CONTRATOS_INTERADMINISTRATIVOS.sql";
// const queryFileName = "CONTRATOS_DERIVADOS.sql";
// const queryFileName = "CONTRATOS_DERIVADOS_SIN_RUBRO.sql";
// const queryFileName = "CONTRATOS_INTERADMINISTRATIVOS_SIN_RUBRO.sql";
const queryFileName = "CONTRATOS_DERIVADOS1.sql";

const queryFilePath = path.join(__dirname, "..", "sqlQueries", queryFileName);

async function saveToCsvFile(fileName, data) {
  const csvWriter = createObjectCsvWriter({
    path: path.join(__dirname, "..", "exports", `${fileName}.csv`),
    header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
  });

  try {
    await csvWriter.writeRecords(data);
    console.log(`Archivo CSV guardado en: ${fileName}.csv`);
  } catch (err) {
    console.error("Error guardando el archivo CSV:", err);
  }
}

async function executeQuery() {
  try {
    const query = fs.readFileSync(queryFilePath, "utf-8");

    await sql.connect(config);

    const result = await sql.query(query);

    if (result.recordset.length > 0) {
      await saveToCsvFile(
        "contratosDerivados",
        result.recordset.map((rec) => rec)
      );
    } else {
      console.log("No se encontraron datos para exportar.");
    }
    sql.close();
  } catch (err) {
    console.error("Error ejecutando la consulta:", err);
  }
}

executeQuery();

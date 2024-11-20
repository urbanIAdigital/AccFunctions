import pkg from "pg";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { localCliendDb } from "../constants.js";
const { Client } = pkg;

// Configuración de conexión a la base de datos
const client = new Client({...localCliendDb, requestTimeout: 1000000,});


// Rutas de los archivos CSV
const csvInteradministrativos = path.resolve(
  "../exports/contratosInteradministrativos.csv"
);
console.log(csvInteradministrativos);

const csvDerivados = path.resolve("../exports/contratosDerivados.csv");

// Función para crear las tablas
async function createTables() {
  try {
    await client.connect();

    // Query para crear la tabla contratos_interadministrativos
    const createInteradministrativosTable = `
      CREATE TABLE IF NOT EXISTS contratos_interadministrativos (
        contrato_interadministrativo VARCHAR(255),
        cliente VARCHAR(255),
        estado VARCHAR(50),
        objeto TEXT,
        fecha_suscripcion DATE,
        fecha_acta_de_inicio DATE,
        fecha_minuta DATE,
        fecha_terminacion DATE,
        plazo INTEGER,
        valor_honorarios NUMERIC,
        valor NUMERIC,
        porcentaje_honorarios NUMERIC,
        porc_honorarios_predios NUMERIC,
        doc_coordinador VARCHAR(50),
        coordinador VARCHAR(255),
        doc_pmp VARCHAR(50),
        pmp VARCHAR(255),
        doc_administrativo VARCHAR(50),
        administrativo VARCHAR(255),
        centro_de_costos VARCHAR(50),
        rubro VARCHAR(50),
        nombre_rubro VARCHAR(255),
        proyecto VARCHAR(50),
        nombre_de_proyecto VARCHAR(255),
        componente VARCHAR(50),
        nombre_componente VARCHAR(255),
        fuente VARCHAR(50),
        nombre_fuente VARCHAR(255),
        apropiado NUMERIC,
        cdp NUMERIC,
        disponible NUMERIC,
        comprometido NUMERIC,
        pagos NUMERIC,
        por_comprometer NUMERIC,
        por_pagar NUMERIC
      );
    `;

    // Query para crear la tabla contratos_derivados
    const createDerivadosTable = `
      CREATE TABLE IF NOT EXISTS contratos_derivados (
        tipo VARCHAR(50),
        num_contrato VARCHAR(50),
        codigo VARCHAR(50),
        rubro VARCHAR(50),
        nombre VARCHAR(255),
        cliente VARCHAR(255),
        con_interadministrativo VARCHAR(255),
        nombre_interadministrativo VARCHAR(255),
        tipologia VARCHAR(50),
        ano INTEGER,
        estado VARCHAR(50),
        fecha_contrato DATE,
        plazo INTEGER,
        tipo_plazo VARCHAR(50),
        prorroga_dias INTEGER,
        total_dias INTEGER,
        supervisor VARCHAR(255),
        proy_codi VARCHAR(50),
        proyecto VARCHAR(255),
        porcentaje_proyecto NUMERIC,
        fecha_ini_contrato DATE,
        fecha_final_contrato DATE,
        fecha_real_fini DATE,
        fecha_competencia DATE,
        tipo_contrato VARCHAR(50),
        valtotal NUMERIC,
        pago_total NUMERIC,
        activo BOOLEAN,
        convenio VARCHAR(50),
        nombre_convenio VARCHAR(255),
        ct_estado VARCHAR(50),
        subgerencia VARCHAR(255)
      );
    `;

    // Crear las tablas
    console.log("Creando tabla contratos_interadministrativos...");
    await client.query(createInteradministrativosTable);
    console.log("Tabla contratos_interadministrativos creada.");

    console.log("Creando tabla contratos_derivados...");
    await client.query(createDerivadosTable);
    console.log("Tabla contratos_derivados creada.");
  } catch (err) {
    console.error("Error al crear las tablas:", err);
  }
}

// Función para cargar datos desde un archivo CSV a PostgreSQL
async function loadDataFromCSV(filePath, tableName, columns) {
  try {
    const stream = fs.createReadStream(filePath);
    const records = [];

    // Procesar el archivo CSV
    stream
      .pipe(csv())
      .on("data", (row) => {
        const values = columns.map((col) => row[col]); // Mapear los valores según las columnas
        records.push(values);
      })
      .on("end", async () => {
        console.log(
          `Archivo ${filePath} procesado. Cargando datos en ${tableName}...`
        );

        // Insertar datos en la tabla
        for (const record of records) {
          const placeholders = record.map((_, idx) => `$${idx + 1}`).join(", ");
          const query = `INSERT INTO ${tableName} (${columns.join(
            ", "
          )}) VALUES (${placeholders})`;
          await client.query(query, record);
        }

        console.log(`Datos cargados en ${tableName}.`);
      });
  } catch (err) {
    console.error(`Error al cargar datos desde ${filePath}:`, err);
  }
}

// Función principal para crear tablas y cargar datos
async function main() {
  try {
    await createTables();

    // Cargar datos en contratos_interadministrativos
    const interadministrativosColumns = [
      "contrato_interadministrativo",
      "cliente",
      "estado",
      "objeto",
      "fecha_suscripcion",
      "fecha_acta_de_inicio",
      "fecha_minuta",
      "fecha_terminacion",
      "plazo",
      "valor_honorarios",
      "valor",
      "porcentaje_honorarios",
      "porc_honorarios_predios",
      "doc_coordinador",
      "coordinador",
      "doc_pmp",
      "pmp",
      "doc_administrativo",
      "administrativo",
      "centro_de_costos",
      "rubro",
      "nombre_rubro",
      "proyecto",
      "nombre_de_proyecto",
      "componente",
      "nombre_componente",
      "fuente",
      "nombre_fuente",
      "apropiado",
      "cdp",
      "disponible",
      "comprometido",
      "pagos",
      "por_comprometer",
      "por_pagar",
    ];
    await loadDataFromCSV(
      csvInteradministrativos,
      "contratos_interadministrativos",
      interadministrativosColumns
    );

    // Cargar datos en contratos_derivados
    const derivadosColumns = [
      "tipo",
      "num_contrato",
      "codigo",
      "rubro",
      "nombre",
      "cliente",
      "con_interadministrativo",
      "nombre_interadministrativo",
      "tipologia",
      "ano",
      "estado",
      "fecha_contrato",
      "plazo",
      "tipo_plazo",
      "prorroga_dias",
      "total_dias",
      "supervisor",
      "proy_codi",
      "proyecto",
      "porcentaje_proyecto",
      "fecha_ini_contrato",
      "fecha_final_contrato",
      "fecha_real_fini",
      "fecha_competencia",
      "tipo_contrato",
      "valtotal",
      "pago_total",
      "activo",
      "convenio",
      "nombre_convenio",
      "ct_estado",
      "subgerencia",
    ];
    await loadDataFromCSV(
      csvDerivados,
      "contratos_derivados",
      derivadosColumns
    );
  } catch (err) {
    console.error("Error en la ejecución del script:", err);
  } finally {
    await client.end();
  }
}

// Ejecutar el script
main();

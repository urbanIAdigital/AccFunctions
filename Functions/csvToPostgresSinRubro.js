import pkg from "pg";
import fs from "fs";
import csvParser from "csv-parser";
import { BATCH_SIZE, localCliendDb } from "../constants.js";

const pool = new pkg.Pool(localCliendDb);

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contratosInteradministrativos (
        id SERIAL PRIMARY KEY,
        "CONTRATO_INTERADMINISTRATIVO" VARCHAR(255) UNIQUE NOT NULL,
        "NOMBRE_INTERADMINISTRATIVO" VARCHAR(255),
        "CLIENTE" VARCHAR(255),
        "ESTADO" VARCHAR(50),
        "OBJETO" TEXT,
        "FECHA_SUSCRIPCIÓN" VARCHAR(100),
        "FECHA_ACTA_DE_INICIO" VARCHAR(100),
        "FECHA_MINUTA" VARCHAR(100),
        "FECHA_TERMINACION" VARCHAR(100),
        "PLAZO" VARCHAR(100),
        "VALOR_HONORARIOS" NUMERIC,
        "VALOR" NUMERIC,
        "PORCENTAJE_HONORARIOS" NUMERIC,
        "PORC_HONORARIOS_PREDIOS" NUMERIC,
        "ADMINISTRATIVO" VARCHAR(255),
        "CENTRO_DE_COSTOS" NUMERIC
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contratoDerivado (
        id SERIAL PRIMARY KEY,
        "CODIGO" VARCHAR(255) UNIQUE NOT NULL,
        "CLIENTE" VARCHAR(100),
        "CON_INTERADMINISTRATIVO" VARCHAR(255) NOT NULL,
        "TIPOLOGIA" VARCHAR(100),
        "ANO" VARCHAR(100),
        "ESTADO" VARCHAR(100),
        "FECHA_CONTRATO" VARCHAR(255),
        "PRORROGA_DIA" NUMERIC,
        "TOTAL_DIAS" NUMERIC,
        "SUPERVISOR" VARCHAR(100),
        "FECHA_INI_CONTRATO" VARCHAR(100),
        "FECHA_FINAL_CONTRATO" VARCHAR(100),
        "FECHA_REAL_FINI" VARCHAR(100),
        "FECHA_COMPETENCIA" VARCHAR(100),
        "TIPO_CONTRATO" VARCHAR(255),
        "VALTOTAL" NUMERIC,
        "PAGO_TOTAL" NUMERIC,
        "CENTRO_DE_COSTOS" NUMERIC,
        "NOMBRE_CENTRO_DE_COSTOS" VARCHAR(255),
        "SUBGERENCIA" VARCHAR(255),
        FOREIGN KEY ("CON_INTERADMINISTRATIVO")
          REFERENCES contratosInteradministrativos("CONTRATO_INTERADMINISTRATIVO")
          ON DELETE CASCADE
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS interRubros (
        id SERIAL PRIMARY KEY,
        "RUBRO" VARCHAR(255) UNIQUE NOT NULL,
        "CON_INTERADMINISTRATIVO" VARCHAR(255) NOT NULL,
        "NOMBRE_RUBRO" VARCHAR(255),
        "PROYECTO" VARCHAR(255),
        "NOMBRE_DE_PROYECTO" VARCHAR(255),
        "COMPONENTE" VARCHAR(255),
        "NOMBRE_COMPONENTE" VARCHAR(255),
        "FUENTE" VARCHAR(255),
        "NOMBRE_FUENTE" VARCHAR(255),
        "APROPIADO" NUMERIC,
        "CDP" NUMERIC,
        "DISPONIBLE" NUMERIC,
        "COMPROMETIDO" NUMERIC,
        "PAGOS" NUMERIC,
        "POR_COMPROMETER" NUMERIC,
        "POR_PAGAR" NUMERIC,
        FOREIGN KEY ("CON_INTERADMINISTRATIVO")
          REFERENCES contratosInteradministrativos("CONTRATO_INTERADMINISTRATIVO")
          ON DELETE CASCADE
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS interRubros2 (
    id SERIAL PRIMARY KEY,
    "RUBRO_ID" VARCHAR(255) NOT NULL,
    "SRS_ANOP" VARCHAR(255) DEFAULT '0', -- Valor por defecto
    "RUBRO" VARCHAR(255) NOT NULL,
    "CONTRATO_INTERADMINISTRATIVO" VARCHAR(255) NOT NULL,
    "NOMBRE_RUBRO" VARCHAR(255),
    "PROYECTO" VARCHAR(255),
    "NOMBRE_DE_PROYECTO" VARCHAR(255),
    "COMPONENTE" VARCHAR(255),
    "NOMBRE_COMPONENTE" VARCHAR(255),
    "FUENTE" VARCHAR(255),
    "NOMBRE_FUENTE" VARCHAR(255),
    "APROPIACION_INICIAL" NUMERIC,
    "APROPIACION_DEFINITIVA" NUMERIC,
    "CDP" NUMERIC,
    "DISPONIBLE" NUMERIC,
    "COMPROMETIDO" NUMERIC,
    "PAGOS" NUMERIC,
    "POR_COMPROMETER" NUMERIC,
    "POR_PAGAR" NUMERIC,
    UNIQUE ("RUBRO_ID", "SRS_ANOP"),
    FOREIGN KEY ("CONTRATO_INTERADMINISTRATIVO")
      REFERENCES contratosInteradministrativos("CONTRATO_INTERADMINISTRATIVO")
      ON DELETE CASCADE
);


    `);

    console.log("Tablas creadas exitosamente.");
  } catch (err) {
    console.error("Error al crear las tablas:", err);
  }
};

const insertDataFromCSV = async (
  tableName,
  filePath,
  columns,
  foreignKeyCheck = null
) => {
  try {
    const rows = [];
    const stream = fs.createReadStream(filePath).pipe(csvParser());

    // Leer y validar datos del CSV
    for await (const row of stream) {
      const values = columns.map((col) => row[col] || null);
      if (foreignKeyCheck) {
        const exists = await pool.query(
          `SELECT 1 FROM contratosInteradministrativos WHERE "CONTRATO_INTERADMINISTRATIVO" = $1`,
          [row[foreignKeyCheck]]
        );
        if (exists.rowCount === 0) {
          console.warn(
            `Clave foránea no encontrada: ${row[foreignKeyCheck]} para ${tableName} Código asociado: ${row["CODIGO"]}`
          );
          continue;
        }
      }
      rows.push(values);
    }

    if (rows.length === 0) {
      console.log(`No se encontraron datos válidos para ${tableName}`);
      return;
    }

    const totalBatches = Math.ceil(rows.length / BATCH_SIZE);
    console.log(`Total de lotes: ${totalBatches}`);

    for (let i = 0; i < totalBatches; i++) {
      const start = i * BATCH_SIZE;
      const end = start + BATCH_SIZE;
      const batch = rows.slice(start, end);

      const placeholders = batch
        .map(
          (_, rowIndex) =>
            `(${columns
              .map(
                (_, colIndex) => `$${rowIndex * columns.length + colIndex + 1}`
              )
              .join(", ")})`
        )
        .join(", ");

      const query = `
        INSERT INTO "${tableName}" (${columns
        .map((col) => `"${col}"`)
        .join(", ")})
        VALUES ${placeholders}
        ON CONFLICT DO NOTHING;
      `;

      const flatValues = batch.flat();
      try {
        await pool.query(query, flatValues);
        console.log(`Lote ${i + 1}/${totalBatches} insertado exitosamente.`);
      } catch (error) {
        console.error(
          `Error al insertar el lote ${i + 1}/${totalBatches}:`,
          error
        );
        throw error;
      }
    }
  } catch (err) {
    console.error(
      `Error al insertar datos en la tabla ${tableName} desde ${filePath}:`,
      err
    );
  }
};
const main = async () => {
  try {
    await createTables();
    await insertDataFromCSV(
      "contratosInteradministrativos",
      "./exports/contratosInteradministrativosSinRubro.csv",
      [
        "CONTRATO_INTERADMINISTRATIVO",
        "NOMBRE_INTERADMINISTRATIVO",
        "CLIENTE",
        "ESTADO",
        "OBJETO",
        "FECHA_SUSCRIPCIÓN",
        "FECHA_ACTA_DE_INICIO",
        "FECHA_MINUTA",
        "FECHA_TERMINACION",
        "PLAZO",
        "VALOR_HONORARIOS",
        "VALOR",
        "PORCENTAJE_HONORARIOS",
        "PORC_HONORARIOS_PREDIOS",
        "ADMINISTRATIVO",
        "CENTRO_DE_COSTOS",
      ]
    );

    await insertDataFromCSV(
      "contratoderivado",
      "./exports/contratosDerivadosSinRubro.csv",
      [
        "CODIGO",
        "CLIENTE",
        "CON_INTERADMINISTRATIVO",
        "TIPOLOGIA",
        "ANO",
        "ESTADO",
        "FECHA_CONTRATO",
        "PRORROGA_DIA",
        "TOTAL_DIAS",
        "SUPERVISOR",
        "FECHA_INI_CONTRATO",
        "FECHA_FINAL_CONTRATO",
        "FECHA_REAL_FINI",
        "FECHA_COMPETENCIA",
        "TIPO_CONTRATO",
        "VALTOTAL",
        "PAGO_TOTAL",
        "CENTRO_DE_COSTOS",
        "NOMBRE_CENTRO_DE_COSTOS",
        "SUBGERENCIA",
      ],
      "CON_INTERADMINISTRATIVO" // Verificar la clave foránea
    );

    await insertDataFromCSV(
      "interrubros",
      "./exports/contratosInteradministrativosRubro.csv",
      [
        "CON_INTERADMINISTRATIVO",
        "NOMBRE_RUBRO",
        "RUBRO",
        "PROYECTO",
        "NOMBRE_DE_PROYECTO",
        "COMPONENTE",
        "NOMBRE_COMPONENTE",
        "FUENTE",
        "NOMBRE_FUENTE",
        "APROPIADO",
        "CDP",
        "DISPONIBLE",
        "COMPROMETIDO",
        "PAGOS",
        "POR_COMPROMETER",
        "POR_PAGAR",
      ],
      "CON_INTERADMINISTRATIVO"
    );
    await insertDataFromCSV(
      "interrubros2",
      "./exports/contratosInteradministrativosv2.csv",
      [
        "RUBRO_ID",
        "RUBRO",
        "CONTRATO_INTERADMINISTRATIVO",
        "NOMBRE_RUBRO",
        "PROYECTO",
        "NOMBRE_DE_PROYECTO",
        "COMPONENTE",
        "NOMBRE_COMPONENTE",
        "FUENTE",
        "NOMBRE_FUENTE",
        "APROPIACION_INICIAL",
        "APROPIACION_DEFINITIVA",
        "CDP",
        "DISPONIBLE",
        "COMPROMETIDO",
        "PAGOS",
        "POR_COMPROMETER",
        "POR_PAGAR",
        "SRS_ANOP",
      ],
      "CONTRATO_INTERADMINISTRATIVO"
    );

    console.log("Proceso completo.");
  } catch (err) {
    console.error("Error en el proceso:", err);
  } finally {
    pool.end();
  }
};

main();

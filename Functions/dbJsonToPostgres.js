import pkg from "pg";
import fs from "fs";
import path from "path";
import { cliendDb } from "../constants.js";
const { Client } = pkg;

// Configuración de conexión a la base de datos
const client = new Client(cliendDb);

// Función para cargar los datos JSON y guardar en las tablas CI y CD
async function updateDatabaseWithContracts() {
  try {
    // Conectar a la base de datos
    await client.connect();
    console.log("Conectado a PostgreSQL");

    // Crear la tabla de contratos interadministrativos (CI)
    const createCITableQuery = `
      CREATE TABLE IF NOT EXISTS contratos_interadministrativos (
        contrato_id SERIAL PRIMARY KEY,
        contrato_interadministrativo VARCHAR(50),
        cliente VARCHAR(255),
        estado VARCHAR(50),
        objeto TEXT,
        fecha_suscripcion TIMESTAMP,
        fecha_acta_inicio TIMESTAMP,
        fecha_minuta TIMESTAMP,
        fecha_terminacion TIMESTAMP,
        plazo INTEGER,
        valor_honorarios NUMERIC,
        valor NUMERIC,
        porcentaje_honorarios DECIMAL,
        honorarios_predios INTEGER,
        doc_coordinador VARCHAR(255),
        coordinador VARCHAR(255),
        doc_pmp VARCHAR(255),
        pmp VARCHAR(255),
        doc_administrativo VARCHAR(255),
        administrativo VARCHAR(255),
        centro_de_costos VARCHAR(50),
        rubro VARCHAR(50) UNIQUE,
        nombre_rubro VARCHAR(255),
        proyecto VARCHAR(50),
        nombre_proyecto VARCHAR(255),
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
    await client.query(createCITableQuery);
    console.log('Tabla "contratos_interadministrativos" creada o ya existe.');

    // Crear la tabla de contratos derivados (CD)
    const createCDTableQuery = `
      CREATE TABLE IF NOT EXISTS contratos_derivados (
        contrato_id SERIAL PRIMARY KEY,
        tipo INTEGER,
        num_contrato INTEGER,
        codigo VARCHAR(100),
        rubro VARCHAR(100),
        nombre VARCHAR(255),
        cliente VARCHAR(255),
        con_interadministrativo VARCHAR(100),
        nombre_interadministrativo VARCHAR(255),
        tipologia VARCHAR(100),
        anio INTEGER,
        estado VARCHAR(100),
        fecha_contrato TIMESTAMP,
        plazo INTEGER[],
        tipo_plazo TEXT[],
        prorroga_dias INTEGER,
        total_dias INTEGER,
        supervisor VARCHAR(255),
        proy_codi VARCHAR(100),
        proyecto VARCHAR(255),
        porcentaje_proyecto DECIMAL,
        fecha_ini_contrato TIMESTAMP,
        fecha_final_contrato TIMESTAMP,
        fecha_real_fini TIMESTAMP,
        fecha_competencia TIMESTAMP,
        tipo_contrato TEXT[],
        valtotal NUMERIC,
        pago_total NUMERIC,
        activo VARCHAR(10),
        convenio VARCHAR(100),
        nombre_convenio VARCHAR(255),
        ct_estado VARCHAR(100),
        subgerencia VARCHAR(100)
      );
    `;
    await client.query(createCDTableQuery);
    console.log('Tabla "contratos_derivados" creada o ya existe.');

    // Cargar el JSON desde el archivo
    const dataCDPath = path.join(process.cwd(), "contratosDerivados.json");
    const dataCD = JSON.parse(fs.readFileSync(dataCDPath, "utf-8"));
    // Cargar el JSON desde el archivo
    const dataCIPath = path.join(process.cwd(), "contratosInteradministrativos.json");
    const dataCI = JSON.parse(fs.readFileSync(dataCIPath, "utf-8"));

    // Insertar contratos interadministrativos (CIs)
    for (const contrato of dataCI) {
      const insertCIQuery = `
        INSERT INTO contratos_interadministrativos (
          contrato_interadministrativo, cliente, estado, objeto, fecha_suscripcion, fecha_acta_inicio,
          fecha_minuta, fecha_terminacion, plazo, valor_honorarios, valor, porcentaje_honorarios, 
          honorarios_predios, doc_coordinador, coordinador, doc_pmp, pmp, doc_administrativo, administrativo, 
          centro_de_costos, rubro, nombre_rubro, proyecto, nombre_proyecto, componente, nombre_componente, 
          fuente, nombre_fuente, apropiado, cdp, disponible, comprometido, pagos, por_comprometer, por_pagar
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 
          $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35
        ) ON CONFLICT (rubro) DO NOTHING;
      `;
      const values = [
        contrato.CONTRATO_INTERADMINISTRATIVO,
        contrato.CLIENTE,
        contrato.ESTADO,
        contrato.OBJETO,
        contrato.FECHA_SUSCRIPCION,
        contrato.FECHA_ACTA_DE_INICIO,
        contrato.FECHA_MINUTA,
        contrato.FECHA_TERMINACION,
        contrato.PLAZO,
        contrato.VALOR_HONORARIOS,
        contrato.VALOR,
        contrato.PORCENTAJE_HONORARIOS,
        contrato.PORC_HONORARIOS_PREDIOS,
        contrato.DOC_COORDINADOR,
        contrato.COORDINADOR,
        contrato.DOC_PMP,
        contrato.PMP,
        contrato.DOC_ADMINISTRATIVO,
        contrato.ADMINISTRATIVO,
        contrato.CENTRO_DE_COSTOS,
        contrato.RUBRO,
        contrato.NOMBRE_RUBRO,
        contrato.PROYECTO,
        contrato.NOMBRE_DE_PROYECTO,
        contrato.COMPONENTE,
        contrato.NOMBRE_COMPONENTE,
        contrato.FUENTE,
        contrato.NOMBRE_FUENTE,
        contrato.APROPIADO,
        contrato.CDP,
        contrato.DISPONIBLE,
        contrato.COMPROMETIDO,
        contrato.PAGOS,
        contrato.POR_COMPROMETER,
        contrato.POR_PAGAR,
      ];
      await client.query(insertCIQuery, values);
    }
    console.log("Contratos interadministrativos insertados.");

    // Insertar contratos derivados (CDs)
    for (const contrato of dataCD) {
      const insertCDQuery = `
        INSERT INTO contratos_derivados (
          tipo, num_contrato, codigo, rubro, nombre, cliente, con_interadministrativo, 
          nombre_interadministrativo, tipologia, anio, estado, fecha_contrato, plazo, tipo_plazo, 
          prorroga_dias, total_dias, supervisor, proy_codi, proyecto, porcentaje_proyecto, 
          fecha_ini_contrato, fecha_final_contrato, fecha_real_fini, fecha_competencia, tipo_contrato, 
          valtotal, pago_total, activo, convenio, nombre_convenio, ct_estado, subgerencia
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 
          $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32
        ) ON CONFLICT DO NOTHING;
      `;
      const values = [
        contrato.TIPO,
        contrato.NUM_CONTRATO,
        contrato.CODIGO,
        contrato.RUBRO,
        contrato.NOMBRE,
        contrato.CLIENTE,
        contrato.CON_INTERADMINISTRATIVO,
        contrato.NOMBRE_INTERADMINISTRATIVO,
        contrato.TIPOLOGIA,
        contrato.ANO,
        contrato.ESTADO,
        contrato.FECHA_CONTRATO,
        contrato.PLAZO,
        contrato.TIPO_PLAZO,
        contrato.PRORROGA_DIAS,
        contrato.TOTAL_DIAS,
        contrato.SUPERVISOR,
        contrato.PROY_CODI,
        contrato.PROYECTO,
        contrato.PORCENTAJE_PROYECTO,
        contrato.FECHA_INI_CONTRATO,
        contrato.FECHA_FINAL_CONTRATO,
        contrato.FECHA_REAL_FINI,
        contrato.FECHA_COMPETENCIA,
        contrato.TIPO_CONTRATO,
        contrato.VALTOTAL,
        contrato.PAGO_TOTAL,
        contrato.ACTIVO,
        contrato.CONVENIO,
        contrato.NOMBRE_CONVENIO,
        contrato.CT_ESTADO,
        contrato.SUBGERENCIA,
      ];
      await client.query(insertCDQuery, values);
    }
    console.log("Contratos derivados insertados.");
  } catch (err) {
    console.error("Error ejecutando consultas:", err);
  } finally {
    await client.end();
    console.log("Conexión cerrada.");
  }
}

// Ejecutar la función para actualizar la base de datos
updateDatabaseWithContracts();

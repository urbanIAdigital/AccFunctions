import xlsx from "xlsx";
import pkg from "pg";
import { cliendDb } from "../constants.js";
const { Client } = pkg;

// Configuración de conexión a PostgreSQL
const client = new Client(cliendDb);

async function cargarExcelEnPostgres(rutaArchivoExcel, nombreTabla) {
  try {
    // Conectar a PostgreSQL
    await client.connect();

    // Leer el archivo Excel
    const workbook = xlsx.readFile(rutaArchivoExcel);
    const sheetName = workbook.SheetNames[0]; // Nombre de la primera hoja
    const worksheet = workbook.Sheets[sheetName];

    // Convertir la hoja de cálculo a un arreglo de objetos JSON
    const datos = xlsx.utils.sheet_to_json(worksheet);

    // Obtener los nombres de las columnas
    const columnas = Object.keys(datos[0]);

    // Crear una tabla si no existe
    let crearTablaQuery = `CREATE TABLE IF NOT EXISTS ${nombreTabla} (`;
    crearTablaQuery += columnas.map((col) => `${col} TEXT`).join(", ");
    crearTablaQuery += ");";

    await client.query(crearTablaQuery);

    // Insertar los datos en la tabla
    for (const fila of datos) {
      const valores = columnas.map((col) => fila[col] || null);
      const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");
      const insertarFilaQuery = `INSERT INTO ${nombreTabla} (${columnas.join(
        ", "
      )}) VALUES (${placeholders})`;

      await client.query(insertarFilaQuery, valores);
    }

    console.log(`Datos insertados en la tabla ${nombreTabla} exitosamente.`);
  } catch (error) {
    console.error("Error al cargar el archivo Excel en PostgreSQL:", error);
  } finally {
    await client.end();
  }
}

// Ruta al archivo Excel y nombre de la tabla
const rutaArchivoExcel =
  "C:/Users/juan.carrasquilla/OneDrive - EDU/Descargas/IE_Base_20240930.xlsx";
const nombreTabla = "IE_Base_20240930";

// Llamar a la función
cargarExcelEnPostgres(rutaArchivoExcel, nombreTabla);

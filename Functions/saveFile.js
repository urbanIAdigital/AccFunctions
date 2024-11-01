import fs from "fs";
import path from "path";

/**
 * Función genérica para guardar datos en un archivo JSON en la raíz del proyecto
 * @param {string} fileName - El nombre del archivo (sin extensión .json)
 * @param {Object} data - Los datos que se guardarán en el archivo JSON
 */
export function saveToJsonFile(fileName, data) {
  // Ruta al archivo en la raíz del proyecto
  const filePath = path.join(process.cwd(), `${fileName}.json`);
  
  // Convertir los datos a JSON
  const jsonData = JSON.stringify(data, null, 2); // Formato con indentación de 2 espacios

  // Guardar el archivo JSON
  fs.writeFileSync(filePath, jsonData, "utf-8");

  console.log(`Archivo guardado en: ${filePath}`);
}


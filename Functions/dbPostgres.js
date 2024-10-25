import pkg from "pg";
import getProjectList from "./getProjectList.js";
const { Client } = pkg;

// Configuración de la conexión a la base de datos PostgreSQL
const client = new Client({
  user: "juan.carrasquilla", // Reemplaza con tu usuario
  host: "10.158.23.249", // O la IP si usas otra máquina
  database: "soui_prueba", // Reemplaza con el nombre de tu base de datos
  password: "1037629710", // Reemplaza con tu contraseña
  port: 5432, // Puerto por defecto de PostgreSQL
});

// Función asíncrona para conectarse y realizar queries
// async function executeQueries() {
//   try {
//     // Conectarse a la base de datos
//     await client.connect();
//     console.log('Conexión exitosa a PostgreSQL');

//     // Ejemplo 1: Crear una tabla
//     const createTableQuery = `
//       CREATE TABLE IF NOT EXISTS usuarios (
//         id SERIAL PRIMARY KEY,
//         nombre VARCHAR(100),
//         edad INTEGER
//       );
//     `;
//     await client.query(createTableQuery);
//     console.log('Tabla creada o ya existe.');

//     // Ejemplo 2: Insertar datos en la tabla
//     const insertQuery = `
//       INSERT INTO usuarios (nombre, edad)
//       VALUES ('Juan', 30), ('Ana', 25), ('Carlos', 35);
//     `;
//     await client.query(insertQuery);
//     console.log('Datos insertados en la tabla.');

//     // Ejemplo 3: Consultar datos
//     const selectQuery = `SELECT * FROM usuarios;`;
//     const res = await client.query(selectQuery);
//     console.log('Datos obtenidos:', res.rows);

//   } catch (err) {
//     console.error('Error ejecutando la consulta:', err);
//   } finally {
//     // Cerrar la conexión
//     await client.end();
//     console.log('Conexión cerrada');
//   }
// }

async function updateDatabaseWithProjects() {
  try {
    // Conectarse a la base de datos
    await client.connect();
    console.log("Conectado a la base de datos PostgreSQL");

    // Crear la tabla "proyectos" si no existe
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS proyectos (
          id VARCHAR(255) PRIMARY KEY,
          nombre VARCHAR(255)
        );
      `;
    await client.query(createTableQuery);
    console.log('Tabla "proyectos" creada o ya existe.');

    // Realizar la solicitud HTTP GET para obtener los datos
    const proyectos = await getProjectList();

    // Insertar los datos en la tabla "proyectos"
    for (const proyecto of proyectos) {
      const {
        id,
        attributes: { name },
      } = proyecto;

      const insertQuery = `
          INSERT INTO proyectos (id, nombre)
          VALUES ($1, $2)
          ON CONFLICT (id) DO NOTHING; -- Esto evita errores si el ID ya existe
        `;
      await client.query(insertQuery, [id, name]);
      console.log(`Proyecto con ID ${id} y nombre "${name}" insertado.`);
    }

    console.log('Datos insertados exitosamente en la tabla "proyectos".');
  } catch (err) {
    console.error("Error ejecutando las consultas o solicitando datos:", err);
  } finally {
    // Cerrar la conexión a la base de datos
    await client.end();
    console.log("Conexión cerrada.");
  }
}

updateDatabaseWithProjects();

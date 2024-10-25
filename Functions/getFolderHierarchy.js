import { getContentFolder } from "./getContentFolder.js";
import fs from "fs"; // Importamos el módulo fs para manejar archivos

let apiRequestCount = 0;
async function getFolderHierarchy(projectId, folderId, accessToken) {
  try {
    const data = await getContentFolder(projectId, folderId);
    let hierarchy = {};
    apiRequestCount++;
    for (let item of data) {
      if (item.type === "folders") {
        // Si el item es una carpeta, llamamos recursivamente para obtener su contenido
        hierarchy[item.attributes.displayName] = (await getFolderHierarchy(
          projectId,
          item.id,
          accessToken
        )).hierarchy;
      } else if (item.type === "items") {
        // Si el item es un archivo, asignamos su id
        hierarchy[item.attributes.displayName] = item.id;
      }
    }
    // Guardamos el JSON resultante en un archivo
    await fs.promises.writeFile(
      "./folderHierarchy2.json", // Ruta del archivo en el root del proyecto
      JSON.stringify(hierarchy, null, 2) // Formateamos el JSON
    );

    return { hierarchy, apiRequestCount };
  } catch (error) {
    console.error(`Error en getFolderHierarchy: ${error.message}`);
    return {};
  }
}

// async function getFolderHierarchy(projectId, folderId) {
//   try {
//     const data = await getContentFolder(projectId, folderId);
//     let hierarchy = {};

//     const folderPromises = data.map(async (item) => {
//       if (item.type === "folders") {
//         hierarchy[item.attributes.displayName] = await getFolderHierarchy(
//           projectId,
//           item.id
//         );
//       } else {
//         hierarchy[item.attributes.displayName] = "file";
//       }
//     });
//     await Promise.all(folderPromises); // Ejecuta todas las promesas concurrentemente
//     return hierarchy;
//   } catch (error) {
//     console.error(`Error en getFolderHierarchy: ${error.message}`);
//     return {};
//   }
// }
const startTime = Date.now();

getFolderHierarchy(
  "b.bec75a5b-0859-434c-8782-9b6afe650235",
  "urn:adsk.wipprod:fs.folder:co.IvgvnbtrQqGcb8QIfu3xCA"
).then((hierarchy) => {
  console.log(hierarchy.apiRequestCount);
  console.log("Archivo guardado exitosamente como folderHierarchy.json");

  const endTime = Date.now();
  console.log(`Tiempo para obtener la informacion: ${endTime - startTime}ms`);
});

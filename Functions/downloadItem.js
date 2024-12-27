import axios from "axios";
import { baseUrl, clientId, clientSecret } from "../constants.js";
import { getToken } from "./getToken.js";
import fs from "fs";
import path from "path";

const accessToken = async () => {
  return await getToken(clientId, clientSecret);
};

async function getVersionToDownload(projectId, itemId) {
  const token = await accessToken();
  const tipUrl = `${baseUrl}data/v1/projects/${projectId}/items/${itemId}/tip`; // get lastest version
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const response = await axios.get(tipUrl, {
    headers,
  });

  const tipDataId = response.data.data.id;

  const encodedVersionId = encodeURIComponent(tipDataId);

  const versionUrl = `${baseUrl}data/v1/projects/${projectId}/versions/${encodedVersionId}`;
  const versionResponse = await axios.get(versionUrl, {
    headers,
  });
  if (versionResponse.status !== 200) {
    console.error(
      `Error al obtener los detalles de la versión. Código de estado: ${versionResponse.status}`
    );
  } else {
    const versionData = versionResponse.data.data;
    if (versionData.relationships && versionData.relationships.storage) {
      const downloadUrl = versionData.relationships.storage.meta.link.href;
      console.log(downloadUrl);
      return;
      downloadAndSaveFile(downloadUrl);
    }
  }
}

export async function downloadAndSaveFile(downloadUrl, filename = null) {
  try {
    const rootDir = path.resolve(
      "C:/Users/juan.carrasquilla/Documents/repos/acc_functions/mppFolderMovilidad"
    );
    console.log(rootDir);

    const token = await accessToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await axios({
      url: downloadUrl,
      responseType: "stream",
      headers,
    });

    if (!filename) {
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch.length > 1) {
          filename = fileNameMatch[1];
        }
      }

      if (!filename) {
        filename = "archivo-descargado";
      }
    }

    const filePath = path.join(rootDir, filename);

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log(`El archivo se ha guardado exitosamente en: ${filePath}`);
        resolve();
      });
      writer.on("error", (err) => {
        console.error("Error al escribir el archivo", err);
        reject(err);
      });
    });
  } catch (error) {
    console.error("Error al descargar el archivo", error);
    throw error; // Rechazar la promesa en caso de error
  }
}
getVersionToDownload(
  "b.07de680e-32d8-4411-acaa-3ab60c0b1a02",
  // "urn:adsk.wipprod:dm.lineage:7Vmj1aF7RniLgiwv357NRw" //geojson
  "urn:adsk.wipprod:dm.lineage:jFajsjt_RKqBMOIizvTaqA" // project .mpp
)
  .then((res) => console.log(res))
  .catch((err) => console.log(err.status));

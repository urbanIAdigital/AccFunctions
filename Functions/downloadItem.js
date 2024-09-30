import axios from "axios";
import { baseUrl, clientId, clientSecret } from "../constants.js";
import { getToken } from "./getToken.js";

const accessToken = async () => {
  return await getToken(clientId, clientSecret);
};

async function downloadItem(projectId, itemId) {
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
      
      const fileResponse = await axios.get(downloadUrl, {
        responseType: "blob",
        headers
      });

      if (fileResponse.status === 200) {
        const filename = "proyect1.mpp";
        const blob = new Blob([fileResponse.data]);
        console.log(blob);
        
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log(`Archivo '${filename}' descargado con éxito.`);
      } else {
        console.error(
          `Error al descargar el archivo. Código de estado: ${fileResponse.status}`
        );
        console.error(fileResponse.data);
      }
    } else {
      console.error(
        "No se pudo encontrar el enlace de descarga en los datos de la versión."
      );
      console.error(versionData);
    }
  }
}
downloadItem(
  "b.07de680e-32d8-4411-acaa-3ab60c0b1a02",
  "urn:adsk.wipprod:dm.lineage:7Vmj1aF7RniLgiwv357NRw"
)
  .then((res) => console.log(res))
  .catch((err) => console.log(err.status));

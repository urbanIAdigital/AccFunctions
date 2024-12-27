import axios from "axios";
import { getToken } from "./getToken.js";
import { baseUrl, clientId, clientSecret } from "../constants.js";
import { getHubId } from "./getHubId.js";
import { saveToJsonFile } from "./saveFile.js";

const accessToken = async () => {
  return await getToken(clientId, clientSecret);
};

export const getFolderByProject = async (projectId) => {
  const token = await accessToken();
  const hubId = await getHubId();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const url = `${baseUrl}project/v1/hubs/${hubId}/projects/${projectId}/topFolders`;
  const { data } = await axios.get(url, {
    headers,
  });
  return data.data;
};
getFolderByProject("b.84243b4e-3047-444b-8ddb-b57aaf402211").then((res) => {
  saveToJsonFile("movilidad-folders", res);
  console.log(res);
});

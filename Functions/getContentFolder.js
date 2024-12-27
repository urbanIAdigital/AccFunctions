import axios from "axios";
import { getToken } from "./getToken.js";
import { baseUrl, clientId, clientSecret } from "../constants.js";

const accessToken = async () => {
  return await getToken(clientId, clientSecret);
};

export const getContentFolder = async (projectId, folderId) => {
  const token = await accessToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const url = `${baseUrl}data/v1/projects/${projectId}/folders/${folderId}/contents`;
  const { data } = await axios.get(url, {
    headers,
  });
  return data.data;
};
getContentFolder(
  "b.84243b4e-3047-444b-8ddb-b57aaf402211",
  "urn:adsk.wipprod:fs.folder:co.7iJNMTVJQvGug9-Q5ln6Tw"
).then((res) => console.log(res));

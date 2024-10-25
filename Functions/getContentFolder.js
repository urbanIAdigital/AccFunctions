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
  "b.bec75a5b-0859-434c-8782-9b6afe650235",
  "urn:adsk.wipprod:fs.folder:co.PCsXjatVQtG9XUxZYsMTqA"
).then((res) => console.log(res));

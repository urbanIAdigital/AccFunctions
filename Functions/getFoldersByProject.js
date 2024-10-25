import axios from "axios";
import { getToken } from "./getToken.js";
import { baseUrl, clientId, clientSecret } from "../constants.js";
import { getHubId } from "./getHubId.js";

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
getFolderByProject("b.bec75a5b-0859-434c-8782-9b6afe650235").then((res) =>
  console.log(res)
);

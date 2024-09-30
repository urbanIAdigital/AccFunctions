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
getFolderByProject("b.07de680e-32d8-4411-acaa-3ab60c0b1a02").then((res) =>
  console.log(res)
);

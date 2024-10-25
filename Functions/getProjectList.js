import axios from "axios";
import { getToken } from "./getToken.js";
import { baseUrl, clientId, clientSecret } from "../constants.js";
import { getHubId } from "./getHubId.js";

const accessToken = async () => {
  return await getToken(clientId, clientSecret);
};

const getProjectList = async () => {
  const hubId = await getHubId();
  const token = await accessToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const url = `${baseUrl}project/v1/hubs/${hubId}/projects`;
  const { data } = await axios.get(url, {
    headers,
  });
  return data.data;
};
getProjectList().then((res) => {
  console.log(res.map((r) => r));
});

export default getProjectList;
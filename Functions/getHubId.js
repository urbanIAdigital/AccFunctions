import axios from "axios";
import { getToken } from "./getToken.js";
import { baseUrl, clientId, clientSecret } from "../constants.js";

const accessToken = async () => {
  return await getToken(clientId, clientSecret);
};

export const getHubId = async () => {
  const token = await accessToken();
  const url = `${baseUrl}project/v1/hubs`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const { data } = await axios.get(url, {
      headers,
    });
    if (data.data.length === 0) return null;
    return data.data[0].id;
  } catch (error) {
    console.error(error.status);
  }
};

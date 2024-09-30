import axios from "axios";
import { baseUrl } from "../constants.js";

export const getToken = async (clientId, clientSecret) => {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const url = `${baseUrl}/authentication/v2/token`;
  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope:
      "data:read data:write bucket:read bucket:create viewables:read account:read",
  };
  const { data } = await axios.post(url, body, { headers });
  return data.access_token;
};

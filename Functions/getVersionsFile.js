import axios from "axios";
import { getToken } from "./getToken.js";
import { baseUrl, clientId, clientSecret } from "../constants.js";
import { downloadAndSaveFile } from "./downloadItem.js";

const accessToken = async () => {
  return await getToken(clientId, clientSecret);
};

export const getVersionsFile = async (projectId, itemId) => {
  const token = await accessToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const url = `${baseUrl}data/v1/projects/${projectId}/items/${itemId}/versions`;
  console.log(url);
  try {
    const { data } = await axios.get(url, {
      headers,
    });

    console.log(data);
    
    return data.data;
  } catch (error) {}
};
getVersionsFile(
  "b.84243b4e-3047-444b-8ddb-b57aaf402211",
  "urn:adsk.wipprod:dm.lineage:jFajsjt_RKqBMOIizvTaqA"
)
  .then((res) =>
    res
      .map((v) => ({
        link: v.relationships.storage.meta.link.href,
        version: `${v.id.split("?")[1]}.mpp`.replace("=", ""),
      }))
      .map(async (link) => await downloadAndSaveFile(link.link, link.version))
  )
  .catch((err) => console.log(err));

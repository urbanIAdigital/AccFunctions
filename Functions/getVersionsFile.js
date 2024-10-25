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
  "b.bec75a5b-0859-434c-8782-9b6afe650235",
  "urn:adsk.wipprod:dm.lineage:X4jdQbj6Rc26v4rKTXBcxA"
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

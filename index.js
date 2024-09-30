import { clientId, clientSecret } from "./constants.js";
import { getToken } from "./Functions/getToken.js";
console.log("oe");

getToken(clientId, clientSecret)
  .then((token) => {
    console.log(token);
  })
  .catch((error) => {
    console.error(error);
  });

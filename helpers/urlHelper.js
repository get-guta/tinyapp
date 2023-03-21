const generateRandomString = require("./utils");
const setUrlByEmail = function (email, newUrl, userDB) {
  for (let userKey in userDB) {
    const userData = userDB[userKey];
    if (email === userData.email) {
      const id = generateRandomString();
      const urlDict = userData.url;
      urlDict[id] = newUrl;
      userData.url = urlDict;
      return id;

    }
  }
  return undefined;
}
const getUrlByEmail = function (email, userDB) {
  for (let userKey in userDB) {
    const userData = userDB[userKey];
    if (email === userData.email) {
      return userData.url;

    }
  }
  return {};
}


module.exports = {getUrlByEmail, setUrlByEmail};


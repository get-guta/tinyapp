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


const getUrlbyId = function (urlId, urlDB) {
  if (urlId in urlDB) {
    return urlDB[urlId];
  }

  return null;


}

const urlsForUser = function (uid, urlDB) {
  const urls = {};
  let noUrl = true;
  for (let userKey in urlDB) {
    const urlData = urlDB[userKey];
    if (urlData["userID"] === uid) {
      urls[userKey] = urlData.longURL;
      noUrl = false;
    }

  }
  if (!noUrl) {
    return urls;

  }else{
    return noUrl;
  }



}


module.exports = { urlsForUser, setUrlByEmail, getUrlbyId };


const { generateRandomString } = require("./util/utils");

//Creates new url and associates to user

const createNewUrl = function (userId, newUrl, urlDB) {
  const urlId = generateRandomString();
  const urlDict = {
    "longURL": newUrl,
    "userID": userId
  }
  urlDB[urlId] = urlDict;
  return urlId;

};

//Filters url database by url ID
const getUrlbyId = function (urlId, urlDB) {
  if (urlId in urlDB) {
    return urlDB[urlId];
  }
  return null;
}

//Filters url owned by user ID
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

  } else {
    return noUrl;
  }

}


module.exports = { urlsForUser, createNewUrl, getUrlbyId };


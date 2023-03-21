const { generateRandomString, encryptText } = require("./utils");
const bcrypt = require('bcryptjs');



const isAuthenticated = function ( password, userData) {
  let authenticated = false;

      if(bcrypt.compareSync(password,userData["password"])) {
        authenticated = true;
      }

  return authenticated;

  }

const getUserByEmail = function (email, userDB) {

  for (let userKey in userDB) {
    const userData = userDB[userKey];
    if (email === userData.email) {
      return userData
    }
  }
  return null;
}

const addUser = function (email, password, userDB) {

  const userId = generateRandomString();

  userDB[userId] = {
    "user_id": userId,
    "email": email,
    "password": encryptText(password),
    "urls": {}
  };
  return userId;



}

module.exports = {
  isAuthenticated,
  getUserByEmail,
  addUser
}

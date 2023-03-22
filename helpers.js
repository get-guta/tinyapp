const { generateRandomString, encryptText } = require("./util/utils");
const bcrypt = require('bcryptjs');


// Creates new user
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

//filters user database by email

const getUserByEmail = function (email, userDB) {

  for (let userKey in userDB) {
    const userData = userDB[userKey];
    if (email === userData.email) {
      console.log(userData);
      return userData
    }
  }
  return undefined;
}

//Authenticate login credentials with store user information
const isAuthenticated = function (password, userData) {
  let authenticated = false;

  if (bcrypt.compareSync(password, userData["password"])) {
    authenticated = true;
  }

  return authenticated;

}

module.exports = { getUserByEmail, isAuthenticated, addUser }

const { encryptText } = require("./utils");
const testpassword = encryptText("test123");

/// Global Varialbles

const USERS = {
  "h6dr5f": {
    "id": "h6dr5f", "email": "test@gmail.com", "password": testpassword
  }
};


const URL_DATABASE = {
  "b2xVn2": {
    "longURL": "https://www.lighthouselabs.ca/",
    "userID": "h6dr5f",
  },
  "9sm5xK": {
    "longURL": "https://www.google.ca",
    "userID": "h6dr5f",
  },
};


module.exports = { URL_DATABASE, USERS }

const {encryptText,generateSecret} = require("./utils");

const URL_DATABASE = {
  "b2xVn2": "http://localhost:8080/urls",
  "9sm5xK": "http://www.google.com",
  "8dr9zb": "https://weather.com"
};

const testpassword = encryptText("test123", generateSecret());

const USERS = {
  "h6dr5f": {

    "id": "h6dr5f", "email": "test@gmail.com", "password": testpassword, "url": URL_DATABASE
  }
};

module.exports={URL_DATABASE, USERS}
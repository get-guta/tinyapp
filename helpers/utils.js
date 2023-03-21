const bcrypt = require('bcryptjs');

function generateRandomString() {
  let urlString = (Math.random() + 1).toString(36).substring(6);
  return urlString;
}

function encryptText(text, length=10){
  return bcrypt.hashSync(text, length);
}

function generateSecret(length=10){
  return bcrypt.genSaltSync(length);
}

module.exports = {generateRandomString, encryptText,generateSecret};
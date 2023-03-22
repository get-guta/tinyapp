const bcrypt = require('bcryptjs');

//Generates random ID

function generateRandomString() {
  let urlString = (Math.random() + 1).toString(36).substring(6);
  return urlString;
}

//Encrypts text
function encryptText(text, length = 10) {
  return bcrypt.hashSync(text, length);
}

module.exports = { generateRandomString, encryptText };
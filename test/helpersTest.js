const { assert } = require('chai');
const { generateRandomString, encryptText } = require("../util/utils");
const { getUserByEmail, isAuthenticated, addUser } = require('../helpers.js');

const cipherPassword = encryptText("purple-monkey-dinosaur");
const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: cipherPassword
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.deepEqual(user, {
      id: "userRandomID", 
      email: "user@example.com", 
      password: cipherPassword
    })
    // Write your assert statement here
  });

 it('should return undefined with non existance email', function(){
  const user = getUserByEmail("user@exam.com", testUsers)
  assert.equal(user, undefined);


  })
});

describe('isAuthenticated', function() {
  it('should return true with valid password', function() {
    const res = isAuthenticated("purple-monkey-dinosaur", testUsers["userRandomID"])
    // Write your assert statement here
    assert.strictEqual(res, true)
    
  });

});

const { assert } = require('chai');
const { URL_DATABASE } = require('../util/config')
const { getUrlbyId, urlsForUser } = require("../urlHelper")


describe('getUrlbyId', function () {
  it('should return url with the given id', function () {
    const url = getUrlbyId("b2xVn2", URL_DATABASE)
    assert.deepEqual(url, {
      "longURL": "https://www.lighthouselabs.ca/",
      "userID": "h6dr5f",
    })
    // Write your assert statement here
  });

 
});
describe('urlsForUser', function () {
it('shoud return url object for valid user', function(){
  const userUrl = urlsForUser("h6dr5f",URL_DATABASE)
  assert.deepEqual(userUrl, {
    "9sm5xK": "https://www.google.ca",
    "b2xVn2": "https://www.lighthouselabs.ca/"

  })
})
});
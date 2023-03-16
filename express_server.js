
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const urlDatabase = {
  "b2xVn2": "http://localhost:8080/urls",
  "9sm5xK": "http://www.google.com",
  "8dr9zb": "https://weather.com"
};
function generateRandomString() {
  let urlString = (Math.random() + 1).toString(36).substring(6)
  return urlString;

}
//update url and redirect to main page
app.post("/urls/:id", (req, res) => {
  console.log(req.params.id);
  const newUrl = req.body.longURL;
  console.log("new url", req.body);
  urlDatabase[req.params.id] = newUrl;
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  //console.log(req.body); // Log the POST request body to the console
  //res.send("Ok"); // Respond with 'Ok' (we will replace this)
  const longUrl = req.body.longURL;
  // register new shortUrl to urlDatabase object
  const shortUrl = generateRandomString();
  urlDatabase[shortUrl] = longUrl;
  res.redirect("/urls/:id");
});

app.post("/urls/:id/delete", (req, res) => {
  const shortUrl = req.params.id;
  delete urlDatabase[shortUrl];
  console.log("after deletion:", urlDatabase);
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username).redirect("/urls");
  
})



//Redirect to long url
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  if (longURL) {
    return res.redirect(longURL);
  } else {
    return res.status(404).send('404 Page Not Found');
  }
});
// renders availble urls
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }
  res.render("urls_index", templateVars);
});


app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
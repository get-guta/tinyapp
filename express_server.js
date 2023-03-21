
const express = require("express");
const cookie_parser = require("cookie-parser");
const { isAuthenticated, getUserByEmail, addUser } = require("./helpers/userHelper");
const { setUrlByEmail, getUrlByEmail } = require("./helpers/urlHelper");
const { USERS, URL_DATABASE } = require("./helpers/config");

const app = express();
const PORT = 8080; // default port 8080

//Middleware

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());


//update url and redirect to main page
app.post("/urls/:id", (req, res) => {
  const newUrl = req.body.longURL;
  urlDatabase[req.params.id] = newUrl;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const longUrl = req.body.longURL;
  // register new shortUrl to urlDatabase object
  if (req.cookies["email"]) {
    const urlByEmail = setUrlByEmail(req.cookies["email"], longUrl);
    if (urlByEmail) {
      res.redirect("/urls/" + urlByEmail);

    } else {
      res.redirect("/login");
    }

  }

});

app.post("/urls/:id/delete", (req, res) => {
  const shortUrl = req.params.id;
  delete urlDatabase[shortUrl];
  console.log("after deletion:", urlDatabase);
  res.redirect("/urls");
});

//login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password

  const userData = getUserByEmail(email, USERS);
  if (userData) {

    const auth = isAuthenticated(password, userData);
    if (auth) {
      res.cookie('user_id', userData.id);
      res.redirect("/urls");
    } else {

      res.status(403).send('Status: Unauthorized');
    }
  } else {
    res.status(403).send('Status: Unauthorized');


  }


});

//POST: register
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email && password) {
    const existingUser = getUserByEmail(email, USERS);
    if (existingUser) {
      res.status(400).send('Status: Bad Request. Existing User!')
    } else {
      const user = addUser(email, password, USERS)
      res.cookie("user_id", user);
      res.redirect("/urls");
    }
  } else {
    res.status(400).send('Satus: Bad request. Email and Passwoed are Required Fields!')
  };
});


//GET: register
app.get("/register", (req, res) => {
  if (req.cookies["user_id"]) {
    res.redirect("/urls");
  } else {

    res.render("register_new", {user : undefined });
  }

});

//GET: login
app.get("/login", (req, res) => {

  res.render("login_page", { user: undefined });

});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/login");
})

app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"];
  if (user_id) {
    const templateVars = USERS[user_id];
    res.render("urls_new", { user: templateVars });
  } else {
    res.redirect("/login")
  }

});

//Redirect to long url
app.get("/u/:id", (req, res) => {
  const longURL = getUrlByID(req.cookies["email"])[req.params.id];
  if (longURL) {
    return res.redirect(longURL);
  } else {
    return res.status(404).send('404 Page Not Found');
  }
});
// renders availble urls
app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  if (userID) {
    const templateVars = USERS[userID];
    res.render("urls_index", { user: templateVars });
  } else {
    res.render("login_page", { unauthorized: "Unauthorized Access, Please login" });
  }

});


app.get("/urls/:id", (req, res) => {
  if (req.cookies["email"]) {
    const urlDB = getUrlByEmail(req.cookies["user_id"]);
    const templateVars = {
      id: req.params.id,
      longURL: urlDB[req.params.id],
      email: req.cookies["user_id"]
    };
    res.render("urls_show", { user: templateVars });
  } else {
    res.render("login_page", { unauthorized: "Unauthorized Access, Please login" });

  }

});

app.get("/", (req, res) => {
  if (req.cookies["user_id"]) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");

  }

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



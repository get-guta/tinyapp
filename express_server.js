
const express = require("express");
const cookieSession = require('cookie-session');
const { isAuthenticated, addUser ,getUserByEmail} = require("./helpers/userHelper");
const { setUrlByEmail, urlsForUser, getUrlbyId } = require("./helpers/urlHelper");
const { USERS, URL_DATABASE } = require("./helpers/config");

const app = express();
const PORT = 8080; // default port 8080

//Middleware

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['tiny', 'fafi' ],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


//update url and redirect to main page
app.post("/urls/:id", (req, res) => {
  
  if (req.cookies["user_id"]) {
    const newUrl = req.body.longURL;
    if (req.params.id in URL_DATABASE) {
      const urlDB = urlsForUser(req.cookies["user_id"], URL_DATABASE);
      const userUrl = urlDB[req.params.id];
      if (userUrl) {
        const shortUrl = req.body.shortUrl;
        URL_DATABASE[shortUrl].longURL = newUrl;
        res.redirect("/urls");

      }else{
        res.status(403).send('Status: Forbidden Access');
      }

    }else{
      res.status(404).send('Status: URL Not Found');

    }
  }else{
    res.status(403).send('Status: Unauthorized Access')

  }

});

app.post("/urls", (req, res) => {
  const longUrl = req.body.longURL;
  // register new shortUrl to urlDatabase object
  if (req.cookies["user_id"]) {
    const urlByEmail = setUrlByEmail(req.cookies["user_id"], longUrl);
    if (urlByEmail) {
      res.redirect("/urls/" + urlByEmail);

    } else {
      res.redirect("/login");
    }

  } else {
    res.status(403).send('Status: Unauthorized Access')
  }

});

app.post("/urls/:id/delete", (req, res) => {
  if (req.cookies["user_id"]) {
    if (req.params.id in URL_DATABASE) {
      const urlDB = urlsForUser(req.cookies["user_id"], URL_DATABASE);
      const userUrl = urlDB[req.params.id];
      if (userUrl) {
        const shortUrl = req.params.id;
        delete URL_DATABASE[shortUrl];
        res.redirect("/urls");

      }else{
        res.status(403).send('Status: Forbidden Access');
      }

    }else{
      res.status(404).send('Status: URL Not Found');

    }
  }else{
    res.status(403).send('Status: Unauthorized Access')

  }



});


app.get("/urls/:id", (req, res) => {
  if (req.cookies["user_id"]) {
    if (req.params.id in URL_DATABASE) {
      const urlDB = urlsForUser(req.cookies["user_id"], URL_DATABASE);
      const userUrl = urlDB[req.params.id];
      if (userUrl) {
        const templateVars = {
          id: req.params.id,
          longURL: urlDB[req.params.id],
          user: USERS[req.cookies["user_id"]]
        };

        res.render("urls_show", templateVars);

      } else {
        res.status(403).send('Status: Forbidden Access');
      }

    } else {
      res.status(404).send('Status: URL Not Found')

    }

  } else {
    res.status(403).send('Status: Unauthorized Access')

  }

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

    res.render("register_new", { user: undefined });
  }

});

//GET: login
app.get("/login", (req, res) => {
  if (req.cookies["user_id"]) {
    res.redirect("/urls")
  }

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
  const uid = req.params.id;
  const longUrl = getUrlbyId(uid, URL_DATABASE);
  if (longUrl) {
    console.log(longUrl);
    return res.redirect(longUrl["longURL"]);

  } else {
    return res.status(404).send('Status: Unknown Url ID');
  }
});
// renders availble urls
app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  if (userID) {
    const urlDB = urlsForUser(userID, URL_DATABASE);
    const templateVars = {url: urlDB, user: USERS[req.cookies["user_id"]]};
    console.log(templateVars)
    res.render("urls_index", templateVars);
  } else {
    return res.status(403).send('Status: Unauthorized Access');

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



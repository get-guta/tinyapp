
const express = require("express");
const cookieSession = require('cookie-session');
const { getUserByEmail, isAuthenticated, addUser } = require("./helpers");
const { createNewUrl, urlsForUser, getUrlbyId } = require("./urlHelper");
const { USERS, URL_DATABASE } = require("./util/config");

const app = express();
const PORT = 8080; // default port 8080

//Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['tinyapp'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

//GET: register
app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {

    res.render("register_new", { user: undefined });
  }

});

//GET: login
app.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls")
  }

  res.render("login_page", { user: undefined });

});

// Renders url creation page for authenticated user  
app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  if (user_id) {
    const templateVars = USERS[user_id];
    res.render("urls_new", { user: templateVars });
  } else {
    res.redirect("/login");
  }

});

//Renders url update page of the given ID if the user authenticated and owns it
app.get("/urls/:id", (req, res) => {
  if (req.session.user_id) {
    if (req.params.id in URL_DATABASE) {
      const urlDB = urlsForUser(req.session.user_id, URL_DATABASE);
      const userUrl = urlDB[req.params.id];
      if (userUrl) {
        const templateVars = {
          id: req.params.id,
          longURL: urlDB[req.params.id],
          user: USERS[req.session.user_id]
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
// Renders availble urls owned by authenticated user
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (userID) {
    const urlDB = urlsForUser(userID, URL_DATABASE);
    const templateVars = { url: urlDB, user: USERS[req.session.user_id] };
    console.log(templateVars)
    res.render("urls_index", templateVars);
  } else {
    return res.status(403).send('Status: Unauthorized Access');

  }

});

//Redirects to user's index page if logged in otherwise redirects to login 
app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");

  }

});

//updates url and redirect user's index page
app.post("/urls/:id", (req, res) => {

  if (req.session.user_id) {
    const newUrl = req.body.longURL;
    if (req.params.id in URL_DATABASE) {
      const urlDB = urlsForUser(req.session.user_id, URL_DATABASE);
      const userUrl = urlDB[req.params.id];
      if (userUrl) {
        const shortUrl = req.body.shortUrl;
        URL_DATABASE[shortUrl].longURL = newUrl;
        res.redirect("/urls");

      } else {
        res.status(403).send('Status: Forbidden Access');
      }

    } else {
      res.status(404).send('Status: URL Not Found');

    }
  } else {
    res.status(403).send('Status: Unauthorized Access')

  }

});

//Creates new url and associate to authenticated user
app.post("/urls", (req, res) => {
  const longUrl = req.body.longURL;
  // register new shortUrl to urlDatabase object
  if (req.session.user_id) {
    const urlId = createNewUrl(req.session.user_id, longUrl, URL_DATABASE);
    if (urlId) {
      res.redirect("/urls/" + urlId);

    } else {
      res.redirect("/login");
    }

  } else {
    res.status(403).send('Status: Unauthorized Access')
  }

});

//Deletes referenced url from url database

app.post("/urls/:id/delete", (req, res) => {
  if (req.session.user_id) {
    if (req.params.id in URL_DATABASE) {
      const urlDB = urlsForUser(req.session.user_id, URL_DATABASE);
      const userUrl = urlDB[req.params.id];
      if (userUrl) {
        const shortUrl = req.params.id;
        delete URL_DATABASE[shortUrl];
        res.redirect("/urls");

      } else {
        res.status(403).send('Status: Forbidden Access');
      }

    } else {
      res.status(404).send('Status: URL Not Found');

    }
  } else {
    res.status(403).send('Status: Unauthorized Access')

  }

});


//Authenticates user before accessing protected pages
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password

  const userData = getUserByEmail(email, USERS);
  if (userData) {

    const auth = isAuthenticated(password, userData);
    if (auth) {
      req.session.user_id = userData.id;

      res.redirect("/urls");
    } else {

      res.status(403).send('Status: Unauthorized');
    }
  } else {
    res.status(403).send('Status: Unauthorized');

  }


});

//Signing up user
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email && password) {
    const existingUser = getUserByEmail(email, USERS);
    if (existingUser) {
      res.status(400).send('Status: Bad Request. Existing User!')
    } else {
      const user = addUser(email, password, USERS)
      req.session.user_id = user;
      res.redirect("/urls");
    }
  } else {
    res.status(400).send('Satus: Bad request. Email and Passwoed are Required Fields!')
  };
});


//logout
app.post("/logout", (req, res) => {
  req.session.user_id = "";
  res.redirect("/login");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



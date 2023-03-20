
const express = require("express");
const cookie_parser = require("cookie-parser");
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());
const urlDatabase = {
  "b2xVn2": "http://localhost:8080/urls",
  "9sm5xK": "http://www.google.com",
  "8dr9zb": "https://weather.com"
};
const emptyURL = {};
const testpassword = bcrypt.hashSync("test123", salt);


const users = {
  "h6dr5f": {

    "id": "h6dr5f","email": "test@gmail.com", "password": testpassword, "url": urlDatabase
  }
};
function generateRandomString() {
  let urlString = (Math.random() + 1).toString(36).substring(6);
  return urlString;
}

const isEmailExist = function (email) {
  let exist = false;
  for (let userKey in users) {
    const userData = users[userKey];
    if (email === userData.email) {
      exist = true
      break;
    }
  }
  return exist;
}

const isAuthenticated = function (email, password) {
  let isUser = false;
  const hashed = bcrypt.hashSync(password, salt)
  for (let userKey in users) {
    const userData = users[userKey];
    if (email === userData.email) {
      if (hashed == userData.password) {
        isUser = true;
        break;
      }
    }
  }
  return isUser;
}


const setUrlByEmail = function (email, newUrl) {
  for (let userKey in users) {
    const userData = users[userKey];
    if (email === userData.email) {
      const id = generateRandomString();
      const urlDict = userData.url;
      urlDict[id] = newUrl;
      userData.url = urlDict;
      return id;

    }
  }
  return undefined;
}

//update url and redirect to main page
app.post("/urls/:id", (req, res) => {
  const newUrl = req.body.longURL;
  urlDatabase[req.params.id] = newUrl;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  //console.log(req.body); // Log the POST request body to the console
  //res.send("Ok"); // Respond with 'Ok' (we will replace this)
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
  if (isAuthenticated(email, password)) {
    res.cookie('email', email);
    res.redirect("/urls");
  } else {
    res.render("login_page", { unauthorized: "Invalid username or password!" });
  }

});

//POST: register
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password
  const len = users.length;
  if (email && password) {
    if (isEmailExist(email)) {
      res.render("register_new", { emailExist: "Already registed email. Please signin to protected pages.", success: undefined, required: undefined });
    } else {
      const hash = bcrypt.hashSync(password, salt)
      users[generateRandomString()] = {
        "user_id": generateRandomString(),
        "email": email,
        "password": hash,
        "urls": emptyURL
      };
      res.render("register_new", { success: "Successfuly added new user.", emailExist: undefined, required: undefined });
    }
  } else {
    res.render("register_new", { required: "Email and Password are required feilds.", emailExist: undefined, success: undefined });
  };
  res.cookie('user_id', );
  res.redirect("/urls");
  console.log(users);

});


//GET: register
app.get("/register", (req, res) => {
  if (req.cookies["email"]) {
    res.redirect("/urls");
  } else {
    res.render("register_new", { required: undefined, emailExist: undefined, success: undefined });
  }

});




//GET: login
app.get("/login", (req, res) => {
  if (req.cookies["email"]) {
    res.redirect("/urls");
  }

  res.render("login_page", { unauthorized: undefined });

});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie('email');
  res.render("login_page", { unauthorized: undefined });
})

app.get("/urls/new", (req, res) => {
  const templateVars = {
    email: req.cookies["email"]
  }
  if (req.cookies["email"]) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }

});

//Redirect to long url
app.get("/u/:id", (req, res) => {
  const longURL = getUrlByEmail(req.cookies["email"])[req.params.id];
  if (longURL) {
    return res.redirect(longURL);
  } else {
    return res.status(404).send('404 Page Not Found');
  }
});
// renders availble urls
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: getUrlByEmail(req.cookies["email"]),
    email: req.cookies["email"]
  }
  if (req.cookies["email"]) {
    res.render("urls_index", templateVars);
  } else {

    res.render("login_page", { unauthorized: "Unauthorized Access, Please login" });
  }

});
const getUrlByEmail = function (email) {
  for (let userKey in users) {
    const userData = users[userKey];
    if (email === userData.email) {
      return userData.url;

    }
  }
  return emptyURL;
}



app.get("/urls/:id", (req, res) => {
  if (req.cookies["email"]) {
    const urlDB = getUrlByEmail(req.cookies["email"]);
    const templateVars = {
      id: req.params.id,
      longURL: urlDB[req.params.id],
      email: req.cookies["email"]
    };
    res.render("urls_show", templateVars);
  } else {
    res.render("login_page", { unauthorized: "Unauthorized Access, Please login" });

  }

});

app.get("/", (req, res) => {
  if (req.cookies["email"]) {
    res.redirect("/urls");
  }
  res.redirect("/login");
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
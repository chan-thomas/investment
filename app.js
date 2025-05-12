const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const app = express();
const port = process.env.PORT || 3000;
const userEmail = process.env.USER_EMAIL;
const userPassword = process.env.USER_PASSWORD;
const login = require("connect-ensure-login");
const expressSession = require("express-session")({
  secret: "session-secret",
  resave: false,
  saveUninitialized: false,
});
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ urlencoded: false }));

app.use(expressSession);
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      if (email === userEmail && password === userPassword) {
        return done(null, { email });
      } else {
        return done(null, false, { message: "Invalid credentials" });
      }
    }
  )
);

passport.serializeUser((email, cb) => {
  cb(null, email);
});
passport.deserializeUser((email, cb) => {
  cb(null, email);
});

app.use(passport.initialize());
app.use(passport.session());

app.get("/login", (req, res) => {
  //redirect to login page
  res.redirect("/login.html");
});

app.get("/register", (req, res) => {
  //redirect to register page
  res.redirect("/register.html");
});
app.get("/profile", login.ensureLoggedIn(), (req, res) => {
  //redirect to profile page
  res.redirect("/profile.html");
});

app.get("/totalsaving", login.ensureLoggedIn(), (req, res) => {
  res.json({ total: 1500 });
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.json({ status: "Login-success", message: "Welcome Jack" });
  }
);
app.get('/logout', (req, res, cb) => {
    req.logout((err) => {
        if (err) { return cb(err) }
    })
    res.redirect('/')
})
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res
        .status(500)
        .json({ status: "Logout-fail", message: "Error during logout" });
    }
    res.json({
      status: "Logout-success",
      message: "You have been logged out successfully",
    });
  });
});

// app.use((err, req, res, next) => {
//   if (err) {
//     console.log("login fail");
//     res.json({ status: "Login-fail", message: "Try again" });
//   } else {
//     next();
//   }
// });

app.listen(port, () => {
  console.log(`server is up. Listening on port:${port}`);
});

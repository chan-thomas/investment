const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const app = express();
const port = process.env.PORT || 3000;
const userEmail = process.env.USER_EMAIL;
const userPassword = process.env.USER_PASSWORD;

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

app.use(passport.initialize());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ urlencoded: false }));

const authenticate = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    status: "Unauthorized",
    message: "Please log in to access this resource.",
  });
};

app.get("/totalsaving", authenticate, (req, res) => {
  res.json({ total: 1500 });
});

app.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    res.json({ status: "Login-success", message: "Welcome Jack" });
  }
);

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

app.use((err, req, res, next) => {
  if (err) {
    console.log("login fail");
    res.json({ status: "Login-fail", message: "Try again" });
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`server is up. Listening on port:${port}`);
});

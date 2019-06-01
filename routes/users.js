var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecretKey = "randomsecretkey";

/* POST register */
router.post("/register", urlencodedParser, (req, res, next) => {
  const email = req.body.email;
  const pwd = req.body.password;

  if (email.length === 0 || pwd.length === 0) {
    return res.status(400).json({
      message:
        "error creating new user - you need to supply both an email and password"
    });
  }

  req
    .db("users")
    .where({ email: email })
    .then(rows => {
      if (rows.length > 0) {
        res
          .status(400)
          .json({ message: "oops! It looks like that user already exists :(" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(pwd, salt, (err, hash) => {
            req
              .db("users")
              .insert({ email: email, password: hash })
              .then(() => {
                res.status(201).json({
                  message:
                    "yay! you've successfully registered your user account :)"
                });
              });
          });
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: true, message: "Something went wrong." });
    });
});

/* POST login */
router.post("/login", urlencodedParser, (req, res, next) => {
  const email = req.body.email;
  const pwd = req.body.password;

  if (email.length === 0 || pwd.length === 0) {
    return res.status(401).json({
      message: "invalid login - you need to supply both an email and password"
    });
  }

  req
    .db("users")
    .where({ email: email })
    .select("password")
    .then(row => {
      if (row.length === 0) {
        return res.status(401).json({
          message: "oh no! It looks like that user doesn't exist..."
        });
      }
      bcrypt.compare(pwd, row[0].password, (err, resp) => {
        if (resp) {
          const payload = {
            iss: "localhost:443",
            sub: "API Authorization",
            exp: 86400,
            email: email
          };
          jwt.sign({ payload: payload }, jwtSecretKey, (err, token) => {
            res.status(200).json({
              access_token: token,
              token_type: "Bearer",
              expires_in: 86400
            });
          });
        } else {
          res.status(401).json({ message: "invalid login - bad password" });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error in mySQL query" });
    });
});

module.exports = router;

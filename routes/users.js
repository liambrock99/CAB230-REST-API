var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecretKey = "randomsecretkey";

/**
 * /register (POST) route
 * Accepts a x-www-form-urlencoded body with fields 'email' and password'
 */
router.post("/register", urlencodedParser, (req, res, next) => {
  const email = req.body.email;
  const pwd = req.body.password;

  // Check for missing or empty email/password
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
      // Check if a row exists in the database where the email = submitted email
      // If a record exists, the user has already been registered
      if (rows.length > 0) {
        res
          .status(400)
          .json({ message: "oops! It looks like that user already exists :(" });
      } else {
        // If the user does not exist, salt and hash the password -> insert into the database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(pwd, salt, (err, hash) => {
            req
              .db("users")
              .insert({ email: email, password: hash })
              .then(() => {
                // Return success message
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

/**
 * /register (POST) route
 * Accepts a x-www-form-urlencoded body with fields 'email' and password'
 */
router.post("/login", urlencodedParser, (req, res, next) => {
  const email = req.body.email;
  const pwd = req.body.password;

  // Check for missing or empty email/password
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
      // Check for a row in the database where the email = submitted email
      // If no records exist, the user does not exist
      if (row.length === 0) {
        return res.status(401).json({
          message: "oh no! It looks like that user doesn't exist..."
        });
      }

      // Compare the submitted password to the password in the database
      bcrypt.compare(pwd, row[0].password, (err, resp) => {
        // If they match, create and sign a JSON Web Token
        if (resp) {
          const payload = {
            iss: "localhost:443",
            sub: "API Authorization",
            exp: 86400,
            email: email
          };
          jwt.sign({ payload: payload }, jwtSecretKey, (err, token) => {
            // Send the client the JWT via a JSON response
            res.status(200).json({
              access_token: token,
              token_type: "Bearer",
              expires_in: 86400
            });
          });
        } else {
          // If the passwords do not match send an error
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

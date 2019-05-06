var express = require("express");
var router = express.Router();
const mysql = require('mysql');

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Queensland Crime Statistics API" });
});

module.exports = router;

/* GET API */
router.get("/api", (req, res, next) => {
  res.render("index", { title: "API Routes" });
});

/* GET offences */
router.get("/api/offences", (req, res, next) => {
  let query = "SELECT pretty FROM ??";
  const table = ["offence_columns"];
  query = mysql.format(query, table);

  req.db.query(query, (err, rows) => {
    if (err) {
      res.json({"Error": true, "Message": "Error executing MySQL query"})
    } else {
      res.json({"Error": false, "Message":  "Success", "Offences": rows})
    }
  })
});

/* GET areas */
router.get("/api/areas", (req, res, next) => {
  let query = "SELECT area FROM ??";
  const table = ["areas"];
  query = mysql.format(query, table);

  req.db.query(query, (err, rows) => {
    if (err) {
      res.json({"Error": true, "Message": "Error executing MySQL query"})
    } else {
      res.json({"Error": false, "Message":  "Success", "Areas": rows})
    }
  })
});

/* GET ages */
router.get("/api/ages", (req, res, next) => {
  let query = "SELECT DISTINCT age FROM ??";
  const table = ["offences"];
  query = mysql.format(query, table);

  req.db.query(query, (err, rows) => {
    if (err) {
      res.json({"Error": true, "Message": "Error executing MySQL query"})
    } else {
      res.json({"Error": false, "Message":  "Success", "Ages": rows})
    }
  })
});

/* GET genders */
router.get("/api/genders", (req, res, next) => {
  let query = "SELECT DISTINCT gender FROM ??";
  const table = ["offences"];
  query = mysql.format(query, table);

  req.db.query(query, (err, rows) => {
    if (err) {
      res.json({"Error": true, "Message": "Error executing MySQL query"})
    } else {
      res.json({"Error": false, "Message":  "Success", "Genders": rows})
    }
  })
});

/* GET years */
router.get("/api/years", (req, res, next) => {
  let query = "SELECT DISTINCT year FROM ??";
  const table = ["offences"];
  query = mysql.format(query, table);

  req.db.query(query, (err, rows) => {
    if (err) {
      res.json({"Error": true, "Message": "Error executing MySQL query"})
    } else {
      res.json({"Error": false, "Message":  "Success", "Years": rows})
    }
  })
});

/* GET months */
router.get("/api/months", (req, res, next) => {
  let query = "SELECT DISTINCT month FROM ??";
  const table = ["offences"];
  query = mysql.format(query, table);

  req.db.query(query, (err, rows) => {
    if (err) {
      res.json({"Error": true, "Message": "Error executing MySQL query"})
    } else {
      res.json({"Error": false, "Message":  "Success", "Months": rows})
    }
  })
});
var express = require("express");
var router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Queensland Crime Statistics API" });
});

/* POST register */
router.get("/register", urlencodedParser, (req, res, next) => {
  res.send(req.body.email);
  res.send(req.body.password);
})

/* GET offences */
router.get("/offences", (req, res, next) => {
  req.db
    .from("offence_columns")
    .select("pretty")
    .then(rows => {
      res.json({ offences: rows.map(e => e.pretty) });
    })
    .catch(err => {
      console.log(err);
      res.json({ Error: true, Message: "Error in mySQL query" });
    });
});

/* GET areas */
router.get("/areas", (req, res, next) => {
  req.db
    .from("areas")
    .select("area")
    .then(rows => {
      res.json({ areas: rows.map(e => e.area) });
    })
    .catch(err => {
      console.log(err);
      res.json({ Error: true, Message: "Error in mySQL query" });
    });
});

/* GET ages */
router.get("/ages", (req, res, next) => {
  req.db
    .from("offences")
    .distinct("age")
    .then(rows => {
      res.json({ ages: rows.map(e => e.age) });
    })
    .catch(err => {
      console.log(err);
      res.json({ Error: true, Message: "Error in mySQL query" });
    });
});

/* GET genders */
router.get("/genders", (req, res, next) => {
  req.db
    .from("offences")
    .distinct("gender")
    .then(rows => {
      res.json({ genders: rows.map(e => e.gender) });
    })
    .catch(err => {
      console.log(err);
      res.json({ Error: true, Message: "Error in mySQL query" });
    });
});

/* GET years */
router.get("/years", (req, res, next) => {
  req.db
    .from("offences")
    .distinct("year")
    .then(rows => {
      res.json({ years: rows.map(e => e.year) });
    })
    .catch(err => {
      console.log(err);
      res.json({ Error: true, Message: "Error in mySQL query" });
    });
});

/* GET months */
router.get("/months", (req, res, next) => {
  req.db
    .from("offences")
    .distinct("month")
    .then(rows => {
      res.json({ months: rows.map(e => e.month) });
    })
    .catch(err => {
      console.log(err);
      res.json({ Error: true, Message: "Error in mySQL query" });
    });
});

module.exports = router;

/* POST register */
router.post("/register", (req, res, next) => {
  
})
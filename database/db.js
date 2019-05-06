const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "web_computing"
});

connection.connect(function(err) {
  if (err) throw err;
});

module.exports = (req, res, next) => {
  req.db = connection;
  next();
};

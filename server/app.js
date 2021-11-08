require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const mysql = require('mysql');

app.use(cors());
app.use(express.json()); // middleware for parsing application/json
app.use(express.urlencoded({ extended: false })); // middleware for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // middleware for parsing cookie

app.use(morgan("dev")); // middleware for logging HTTP request

const connection = mysql.createConnection({
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME
});

// GET test
app.get("/api/test", (req, res) => {
  connection.query('SELECT * FROM topic', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    res.status(200).json({
      msg: "(API TEST GET) Hello, Alien!",
      body: Math.random(),
      data: results,
    });
  });
});

// PUT test with params
app.put("/api/test/:dummy_id", (req, res) => {
  res.status(200).json({
    msg: `(API TEST PUT) You sent params '${JSON.stringify(
      req.params
    )}' and body '${JSON.stringify(req.body)}'`,
    params: req.params,
    body: req.body,
  });
});

// POST test
app.post("/api/test", (req, res) => {
  res.status(200).json({
    msg: `(API TEST POST) You sent post data '${JSON.stringify(req.body)}'`,
    body: req.body,
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`** Raising Alien Creatures Web Server **`);
  console.log(`App listening on port ${port}`);
});

require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(express.json()); // middleware for parsing application/json
app.use(express.urlencoded({ extended: false })); // middleware for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // middleware for parsing cookie

app.use(morgan("dev")); // middleware for logging HTTP request

// GET test
app.get("/api/test", (req, res) => {
  res.status(200).json({
    msg: "(API TEST GET) Hello, Alien!",
    body: Math.random(),
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

require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const app = express();

app.use(express.json()); // middleware for parsing application/json
app.use(express.urlencoded({ extended: false })); // middleware for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // middleware for parsing cookie

app.use(morgan("dev")); // middleware for logging HTTP request

// GET test
app.get("/api/test", (req, res) => {
  res.status(200).json({
    data: "Hello, Alien!",
  });
});

// POST test
app.post("/api/test", (req, res) => {
  res.status(200).json({
    msg: `You sent data '${JSON.stringify(req.body)}'`,
    data: req.body,
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`** Raising Alien Creatures Web Server **`);
  console.log(`App listening on port ${port}`);
});

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();

// using HTTP request logger middleware
app.use(morgan("dev"));

// api for test
app.get("/api/test", (req, res) => {
  res.status(200).json({
    data: "Hello, Alien!",
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`** Raising Alien Creatures Web Server **`);
  console.log(`App listening on port ${port}`);
});

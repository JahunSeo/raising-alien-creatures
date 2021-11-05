require("dotenv").config();
const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

app.get("/api/test", (req, res) => {
  res.status(200).json({
    data: "Hello, Alien!",
  });
});

app.listen(port, () => {
  console.log(`** Raising Alien Creatures Web Server **`);
  console.log(`App listening on port ${port}`);
});

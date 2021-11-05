const express = require("express");
const app = express();

const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello, Alien!");
});

app.listen(port, () => {
  console.log(`** Raising Alien Creatures Web Server **`);
  console.log(`App listening on port ${port}`);
});

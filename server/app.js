const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const mysql = require("mysql");
const { createClient } = require("redis");
const { notiSchedule, deadSchedule, deleteKeysSchedule } = require("./routes/scheduler"); // TODO
/* log in middleware */
const compression = require("compression");
const helmet = require("helmet");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const fs = require("fs");
// const flash = require("connect-flash");
// const schedule = require("./routes/scheduler");

/* redis */
// const rdsClient = createClient();
const rdsClient = createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: 0,
});
rdsClient.on("error", (err) => {
  // console.log("Redis Client Error", err);
  rdsClient.connected = false;
});
rdsClient.on("connect", async () => {
  console.log("REDIS in API SERVER connected");
  rdsClient.connected = true;
});
rdsClient.connect();

/* mysql */
const pool = mysql.createPool({
  connectionLimit: 10,
  timezone: "Z",
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
  charset: "utf8mb4",
});

app.use(compression());
app.use(helmet());
app.use(express.json()); // middleware for parsing application/json
app.use(express.urlencoded({ extended: false })); // middleware for parsing application/x-www-form-urlencoded
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // https://fierycoding.tistory.com/36
    saveUninitialized: false,
    store: new FileStore(),
  })
);
app.use(cookieParser(process.env.SESSION_SECRET)); // middleware for parsing cookie
app.use(morgan("dev")); // middleware for logging HTTP request
// app.use(flash()); // 반드시 session 다음에

const passport = require("./lib/passport")(app, pool);
const userRouter = require("./routes/user.js")(passport, pool);
const mainRouter = require("./routes/main.js")(pool, rdsClient);
const challengeRouter = require("./routes/challenge.js")(pool, rdsClient);
const alienRouter = require("./routes/alien.js")(pool);
const chatRouter = require("./routes/chat.js")(pool);
const testRouter = require("./routes/test.js")(pool);
app.use("/api/user", userRouter);
app.use("/api/main", mainRouter);
app.use("/api/challenge", challengeRouter);
app.use("/api/alien", alienRouter);
app.use("/api/chat", chatRouter);
app.use("/api/test", testRouter);

// init scheduler
notiSchedule(rdsClient);
deadSchedule(rdsClient);
deleteKeysSchedule(rdsClient);
// TODO

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`** Raising Alien Creatures Web Server **`);
  console.log(`App listening on port ${port}`);
  console.log(`DB_NAME: ${process.env.DB_NAME}`);
});

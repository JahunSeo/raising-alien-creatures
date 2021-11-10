// const path = require('path');
// const dotenv = require("dotenv");
// dotenv.config({ path: path.join(__dirname, "../.env") });
//미들웨어 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
app.use(helmet());
var session = require('express-session');
var cookieParser = require('cookie-parser');
var FileStore = require('session-file-store')(session);
var fs = require('fs');
var flash = require('connect-flash');
var bcrypt = require('bcrypt');
const port = 3001


var isOwner = (req,res) => {
  if (req.user){ return true;}
  else { return false;}
}

// var statusUI = (req, res) => { 
//   var authstatusUI = ; 
//   if (isOwner(req,res)){
//     authstatusUI = `로그인시 변경될 내용`
//   }
//   return authstatusUI;
// }
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'database-1.cx5rraglozur.ap-northeast-2.rds.amazonaws.com',
  user     : 'admin',
  password : 'wpdk1111',
  database : 'testlogin'
});
connection.connect();


app.use(bodyParser.urlencoded({
    extended: false
  }));

app.use(compression());
app.use(session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
  }));
app.use(flash()); // 반드시 session 다음에
var passport = require('./lib/passport')(app, connection);
var userRouter =require('./routes/user.js')(passport);
app.use('/api/user', userRouter);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    console.log('연결성공');
  });
  
  
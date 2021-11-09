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
const port = 3001

// /* MYSQL */ 
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // host     : 'database-1.cx5rraglozur.ap-northeast-2.rds.amazonaws.com',
  // user     : 'admin',
  // password : 'wpdk1111',
  // database : ''
});
 
connection.connect();
connection.query('SELECT * FROM topic', function (error, results, fields) {
  if (error) {
      console.error(error);
    }
  console.log(results);
});
 
connection.end();

/**/

app.use(bodyParser.urlencoded({
    extended: false
  }));

app.use(compression());
app.use(session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
  }))
app.use(flash());   //세션 다음에 할 것 미들웨어는 실행순서가 중요하다.


var authData = {
    email: 'egoing777@gmail.com',
    password: '111111',
    nickname: 'egoing'
  };


/******* Passport init *****/
var passport = require('passport')    // passport 모듈 include 
const LocalStrategy = require('passport-local').Strategy;  // local 에서 Id / 비밀번호로 로그인

app.use(passport.initialize());  // passport 미들웨어 설치.
app.use(passport.session()); 


app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
})

passport.serializeUser(function (user, done) { // 로그인이 성공햇다는 사실을 session store에 저장함 / 로그인 성공시 한번 호출된다.
    done(null, user.email); //두번째 인자로 사용자의 식별자를 넣으라고 되어있음. 그러면 session data안에 들어간다.
});

passport.deserializeUser(function (id, done) { //페이지에 접근할 때마다 deserializeUser함수가 실행됨
    done(null, authData);  // request.user 라는 데이터로 authdata 가 전달된다 (약속)
});


passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'pwd'
    },
    function (username, password, done) {
        console.log('LocalStrategy',username, password);
        }
    ));



app.get('/', function(req, res){
    res.sendFile(__dirname+'/login.html');
});
        

app.post('/login_process', 
passport.authenticate('local', {
    successRedirect: '/',         
    failureRedirect: '/'
}));




    // if (username === authData.email) {
    //     if (password === authData.password) {
    //         return done(null, authData, {   //login 성공시 serializeUser의 callback의 user인자로 authData전달
    //             message: 'Welcome.'
    //         });
    //     } else {
    //         return done(null, false, {
    //             message: 'Incorrect password.'
    //         });
    //     }
    // } else {
    //     return done(null, false, {
    //         message: 'Incorrect username.'
    //     });
    // }


/*Passport init end*/



app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
  });
  
  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  });



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    console.log('연결성공');
  });
  
  
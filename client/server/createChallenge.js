const path = require('path');
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "./.env") });
//미들웨어 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
app.use(helmet());
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var flash = require('connect-flash');
const schedule = require('node-schedule');
const port = 3001
const querystring = require('querystring');


app.use(bodyParser.urlencoded({ extended: false }));
var mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

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

// 생명체 사망 api and 졸업 api
const j = schedule.scheduleJob({hour: 00, minute: 00}, function(){
    let today = new Date();
    let day = today.getDay();
    console.log(day);
    connection.query('INSERT INTO Alien_dead SELECT * FROM Alien where week_auth_cnt < total_auth_cnt AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results){
        if (err) {
            console.error(err);
        }
        console.log('success insert dead_alien!!!!!!!!!', results);
    });
    connection.query('INSERT INTO dead_authentification SELECT Authentification.id, Authentification.user_info_id, Alien_id, Authentification.Challenge_id, requestDate, responseDate, requestUserNickname, responseUserNickname, isAuth, imgURL FROM Authentification LEFT JOIN Alien ON Alien.id = Authentification.Alien_id where week_auth_cnt < total_auth_cnt AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results){
        if (err) {
            console.error(err);
        }
        console.log('success insert dead_authentification!!!!!!!!!', results);
    });
    connection.query('DELETE FROM Authentification USING Alien LEFT JOIN Authentification ON Alien.id = Authentification.Alien_id where week_auth_cnt < total_auth_cnt AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results){
        if (err) {
            console.error(err);
        }
        console.log('success delete authentification!!!!!!!!!', results);
    });
    connection.query('DELETE FROM Alien where week_auth_cnt < total_auth_cnt AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results){
        if (err) {
            console.error(err);
        }
        console.log('success delete Alien!!!!!!!!!', results);
    });
    connection.query('UPDATE Alien SET week_auth_cnt = 0 where auth_day = 7 OR auth_day = ?', [day], function(err, results){
        if (err) {
            console.error(err);
        }
        console.log('success update Alien!!!!!!!!!', results);
    });
    
    // 졸업 API
    connection.query('INSERT INTO Alien_graduated SELECT * FROM Alien where graduate_toggle = 1 AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results) {
        if (err) {
            console.error(err);
        }
        console.log('success insert graduated_alien!!!!!!!!!', results);
    });
    connection.query('INSERT INTO graduated_authentification SELECT Authentification.id, Authentification.user_info_id, Alien_id, Authentification.Challenge_id, requestDate, responseDate, requestUserNickname, responseUserNickname, isAuth, imgURL FROM Authentification LEFT JOIN Alien ON Alien.id = Authentification.Alien_id where graduate_toggle = 1 AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results)  {
        if (err) {
            console.error(err);
        }
        console.log('success insert graduated_authentification!!!!!!!!!', results);
    });
    connection.query('DELETE FROM Authentification USING Alien LEFT JOIN Authentification ON Alien.id = Authentification.Alien_id where graduate_toggle = 1 AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results){
        if (err) {
            console.error(err);
        }
        console.log('success delete authentification!!!!!!!!!', results);
    });
    connection.query('DELETE FROM Alien where graduate_toggle = 1 AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results) {
        if (err) {
            console.error(err);
        }
        console.log('success delete Alien!!!!!!!!!', results);
    });
});

// 졸업 토글 변경 API
app.get('/change_toggle', function(req, res){
    if (req.params.toggle == 1) {
    connection.query('UPDATE Alien SET graduate_toogle = 1 where id = ?', [res.user.id], function(err, results){
        if (err) {
            console.error(err);
        }
        console.log('success update Alien graduate_toogle!!!!!!!!!', results);
    });
    } else {
        connection.query('UPDATE Alien SET graduate_toogle = 0 where id = ?', [res.user.id], function(err, results){
            if (err) {
                console.error(err);
            }
            console.log('success update Alien graduate_toogle!!!!!!!!!', results);
        });
    }
});

// 메인화면 랜덤 생명체 보내기
app.get('/main', function(req, res) {
    connection.query('select * from Alien inner join Challenge on Alien.Challenge_id = Challenge.id order by accuredAuthCnt desc limit 50', function(err, results) {
        if (err) {
            console.error(err);
        }
        console.log('success random alien!!!!!!!!!!!!1', results);
    });
});


// 챌린지 생성 api
app.post('/challenge_process', function(req, res){

    console.log(req.body);
    const max_user = parseInt(req.body.max_user);
    const cnt_of_week = parseInt(req.body.cnt_of_week);
    const life = parseInt(req.body.life);

    connection.query('INSERT INTO Challenge (challengeName, challengeContent, createUserNickName, maxUserNumber, cntOfWeek, life) VALUES (?, ?, ?, ?, ?, ?)', [req.body.challenge_name, req.body.challenge_content, req.user.nickname, max_user, cnt_of_week, life], function(error, results){
        console.log(req.user.id, results);
        connection.query('INSERT INTO user_info_has_Challenge (user_info_id, Challenge_id) VALUES (?, ?)', [req.user.id, results.insertId])
        res.redirect(`/challenge/?id=${results.insertId}`)
    })
});

// 생명체 생성 api
app.post('/create_alien', function(req, res){
    connection.query('INSERT INTO Alien (user_info_id, Challenge_id, alienName, Alien_image_url, auth_day) VALUES (?, ?, ?, ?, ?)', [req.user.id, req.challenge_id, 'aa', 'url1']);
    connection.query('UPDATE Challenge set participantNumber = participantNumber + 1 where id = ?', [req.parms.id]);
    //challenge table과 join해서 total_auth_cnt(주 몇회인지) 업데이트하거나 front에서 받아오기

})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    console.log('연결성공');
    
  });
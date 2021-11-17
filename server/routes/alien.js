const express = require('express');
const router = express.Router();

module.exports = function (connection) { 

    router.post('/create', function(req, res){
         // challenge table과 join해서 total_auth_cnt(주 몇회인지) front에서 주 몇회인지 받아오기-> total_auth_cnt insert(매일이면 1, 주 n회이면 n)
         // auth day도 매일하는 challenge이면 어떠한 값이 오는지, 주 n회이면 생명체 생성 시 넘어오는 값 넣기(매일이면 7, n이면 0~6)
        if (req.user) {
            //body 변수 추가하기
            const sql1 = `INSERT INTO Alien (user_info_id, Challenge_id, alienName, Alien_image_url, total_auth_cnt, auth_day) VALUES (${req.user.id}, ${req.params.challenge_id}, ${req.body.alienName}, ${req.body.Alien_image_url}, ${req.body.total_auth_cnt}, ${req.body.auth_day});`;
            // challenge id 받아오기
            const sql2 = `UPDATE Challenge set participantNumber = participantNumber + 1 where id = ${req.params.challenge_id};`;
            // user_info_has_challenge 테이블 row 추가
            const sql3 = `INSERT INTO user_info_has_Challenge (user_info_id, Challenge_id VALUES (${req.user.id}, ${req.params.challenge_id});`;
                connection.query(
                    sql1 + sql2 + sql3,
                    function (error, results) {
                        if (error) {
                            console.log(error);
                            res.status(200).json({
                                result: "fail",
                                msg: "cant select"
                            });
                        }
                        res.status(200).json({
                        result: "success",
                        msg: "do insert"
                        });
                });
                
            
        } else {
            res.status(401).json({
                result: "fail",
                msg: 'Unauthorized',
            });
        }
    });

    router.use(function (req, res, next) {
        res.status(404).json({
            result: "fail",
            msg: 'Sorry cant post that!',
        });
    });
    router.use(function (err, req, res, next) {
        console.error(err.stack)
        res.status(500).json({
            result: "fail",
            msg: 'Something broke!',
          });
    });
    
    return router;
}
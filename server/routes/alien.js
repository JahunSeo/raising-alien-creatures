const { ConnectContactLens } = require('aws-sdk');
const express = require('express');
const router = express.Router();

module.exports = function (pool) { 

    router.post('/create', function(req, res){
         // challenge table과 join해서 total_auth_cnt(주 몇회인지) front에서 주 몇회인지 받아오기-> total_auth_cnt insert(매일이면 1, 주 n회이면 n)
         // auth day도 매일하는 challenge이면 어떠한 값이 오는지, 주 n회이면 생명체 생성 시 넘어오는 값 넣기(매일이면 7, n이면 0~6)
        if (req.user) {
            //body 변수 추가하기
            const sql1 = `INSERT INTO Alien (user_info_id, Challenge_id, alienName, Alien_image_url, time_per_week, sunday, monday, tuesday, wednesday, thursday, friday, saturday) VALUES (${req.user.id}, ${req.body.challenge_id}, ${req.body.alien_name}, ${req.body.alien_image_url}, ${req.body.total_auth_cnt}, ${req.body.sun}, ${req.body.mon}, ${req.body.tue}, ${req.body.wed}, ${req.body.thu}, ${req.body.fri}, ${req.body.sat});`;
            // challenge id 받아오기
            const sql2 = `UPDATE Challenge set participantNumber = participantNumber + 1 where id = ${req.body.challenge_id};`;
            // user_info_has_challenge 테이블 row 추가
            const sql3 = `INSERT INTO user_info_has_Challenge (user_info_id, Challenge_id VALUES (${req.user.id}, ${req.body.challenge_id});`;
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.error(err);
                    res.status(200).json({
                        result: "fail",
                        msg: "cant connection mysql"
                    });
                    return;
                }
                connection.query(
                    sql1 + sql2 + sql3,
                    function (error, results) {
                        if (error) {
                            console.log('at the alien create api', error);
                            res.status(200).json({
                                result: "fail",
                                msg: "cant select"
                            });
                        }
                        res.status(200).json({
                        result: "success",
                        msg: "do insert"
                        });
                    connection.release();
                });
            });
            
                
            
        } else {
            res.status(401).json({
                result: "fail",
                msg: 'Unauthorized',
            });
        }
    });

    //졸업 api
    router.get('/graduation', function(req, res){
        // 필요한 데이터: challenge_id, ailen_id
        // 해야할 일 1: alien 테이블 변경
        const sql1 = 'UPDATE Alien SET status = 1 WHERE id = ?;'
        // 해야할 일 2: user_info_has_challenge row 삭제
        const sql2 = 'DELETE FROM user_info_has_Challenge WHERE user_info_id = ? AND Challenge_id = ?;'
        // 해야할 일 3: participant - 1
        const sql3 = 'UPDATE Challenge set participantNumber = participantNumber - 1 where id = ?;'
        pool.getConnection(function(err, connection) {
            if (err) {
                console.error(err);
                res.status(200).json({
                    result: "fail",
                    msg: "cant connection mysql"
                });
                return;
            }
            connection.query(
                sql1 + sql2 + sql3, [req.body.alien_id, res.user.id, res.body.challenge_id, res.body.challenge_id],
                function (error, results) {
                    if (error) {
                        console.log('at the alien create api', error);
                        res.status(200).json({
                            result: "fail",
                            msg: "cant graduation"
                        });
                    }
                    res.status(200).json({
                    result: "success",
                    msg: "do graduation"
                    });
                connection.release();
            });
        });
        


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
const express = require('express');
const router = express.Router();

module.exports = function (connection) { 

    router.post('/create', function(req, res){
         // challenge table과 join해서 total_auth_cnt(주 몇회인지) front에서 주 몇회인지 받아오기-> total_auth_cnt insert(매일이면 1, 주 n회이면 n)
         // auth day도 매일하는 challenge이면 어떠한 값이 오는지, 주 n회이면 생명체 생성 시 넘어오는 값 넣기(매일이면 7, n이면 0~6)
        if (req.user) {
            connection.query('INSERT INTO Alien (user_info_id, Challenge_id, alienName, Alien_image_url, total_auth_cnt, auth_day) VALUES (?, ?, ?, ?, ?)', [req.user.id, req.challenge_id, 'aa', 'url1', 'total_auth_cnt', 'auth_day'], function(err, results){
                if (err) {
                    console.error(err);
                    res.status(501).json({
                        result: "fail",
                        msg: "cant insert alien infomations"
                    });
                }
            });
            // challenge id 받아오기
            connection.query('UPDATE Challenge set participantNumber = participantNumber + 1 where id = ?', [req.challenge_id], function(err, results){
                if (err) {
                    console.error(err);
                    res.status(501).json({
                        result: "fail",
                        msg: "cant update challenge table"
                    });
                }
            });
        
            res.status(200).json({
                result: "success",
                msg: "do insert"
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
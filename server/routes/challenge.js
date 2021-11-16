const express = require('express');
const router = express.Router();

module.exports = function (connection) {
    // 챌린지 생성 api
    router.post('/create_process', function(req, res) {
    console.log(req.body);
    const max_user = parseInt(req.body.max_user);
    const cnt_of_week = parseInt(req.body.cnt_of_week);
    const life = parseInt(req.body.life);
    if (req.user) {
        connection.query('INSERT INTO Challenge (challengeName, challengeContent, createUserNickName, maxUserNumber, cntOfWeek, life) VALUES (?, ?, ?, ?, ?, ?)', [req.body.challenge_name, req.body.challenge_content, req.user.nickname, max_user, cnt_of_week, life], function(err1, results) {
            if (err1) {
                console.error(err1);
                res.status(501).json({
                    result: "fail",
                    msg: "cant insert challenge infomations"
                });
            }
            console.log('success insert new challenge information', results);
            connection.query('INSERT INTO user_info_has_Challenge (user_info_id, Challenge_id) VALUES (?, ?)', [req.user.id, results.insertId], function(err2, results) {
                if (err2) {
                    console.error(err2);
                    res.status(501).json({
                        result: "fail",
                        msg: "cant insert challenge_id"
                    });
                }
                console.log('success insert user_id and challenge_id', results);
            });
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
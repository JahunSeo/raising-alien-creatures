const express = require('express');
const router = express.Router();

module.exports = function (connection) {
    // 챌린지 생성 api
    router.post('/create', function(req, res) {
    console.log(req.body);
    const max_user = parseInt(req.body.max_user);
    const cnt_of_week = parseInt(req.body.cnt_of_week);
    const life = parseInt(req.body.life);
    if (req.user) {
        try {
        connection.query('INSERT INTO Challenge (challengeName, challengeContent, createUserNickName, maxUserNumber, cntOfWeek, life) VALUES (?, ?, ?, ?, ?, ?)', [req.body.challenge_name, req.body.challenge_content, req.user.nickname, max_user, cnt_of_week, life], function(err1, results1) {
            console.log('success insert new challenge information', results1);

            connection.query('INSERT INTO user_info_has_Challenge (user_info_id, Challenge_id) VALUES (?, ?)', [req.user.id, results1.insertId], function(err2, results2) {
                console.log('success insert user_id and challenge_id', results2);
            });
            res.status(200).json({
                result: "success",
                msg: "do insert",
                data: results1.insertId,
            });
        });
    } catch(err) {
        console.error(err1);
        res.status(501).json({
            result: "fail",
            msg: "cant insert challenge infomations"
        });
    }
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
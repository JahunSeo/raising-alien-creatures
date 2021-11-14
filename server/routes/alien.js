const express = require('express');
const router = express.Router();

module.exports = function (connection) { 

    router.post('/create_process', function(req, res){
        connection.query('INSERT INTO Alien (user_info_id, Challenge_id, alienName, Alien_image_url, auth_day) VALUES (?, ?, ?, ?, ?)', [req.user.id, req.challenge_id, 'aa', 'url1']);
        connection.query('UPDATE Challenge set participantNumber = participantNumber + 1 where id = ?', [req.parms.id]);
        //challenge table과 join해서 total_auth_cnt(주 몇회인지) 업데이트하거나 front에서 주 몇회인지 받아오기
        
        res.status(200).json({
            msg: `You sent post data '${JSON.stringify(req.body)}'`,
            body: req.body,
          });
    });

    router.use(function (req, res, next) {
        res.status(404).json({
            msg: 'Sorry cant post that!',
            body: req.body,
        });
    });
    router.use(function (err, req, res, next) {
        console.error(err.stack)
        res.status(500).json({
            msg: 'Something broke!',
            body: req.body,
          });
    });
    
    return router;
}
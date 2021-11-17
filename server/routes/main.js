const express = require("express");
const router = express.Router();

module.exports = function (connection) {
    router.get("/", (req, res) => {
        const sql1 = `SELECT * FROM Alien UNION SELECT * FROM Alien_graduated ORDER BY accuredAuthCnt DESC LIMIT 50;`;
        try {
        connection.query(
            sql1,
            function (error, results) {

              res.status(200).json({
                result: "success",
                data: results,
                });
            }
        );
        } catch (err) {
            console.log(err);
            res.status(501).json({
                result: "fail",
                msg: "cant select"
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
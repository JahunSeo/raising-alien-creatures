const express = require("express");
const router = express.Router();

module.exports = function (pool) {
  // add chat message
  router.post("/create", function (req, res) {
    console.log(req.body);
    // login 상태 확인
    if (!req.user) {
      res.status(401).json({
        result: "fail",
        msg: "Unauthorized",
      });
      return;
    }
    // TODO: challenge 참가 중인지 여부 체크

    // TODO: add msg
    res.status(201).json({
      result: "success",
      msg: "do insert",
    });
  });

  // https://davidburgos.blog/how-to-handle-404-and-500-errors-on-expressjs/
  router.use(function (req, res, next) {
    res.status(404).json({
      result: "fail",
      msg: "Sorry cant post that!",
    });
  });

  router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
      result: "fail",
      msg: "Something broken!",
    });
  });

  return router;
};

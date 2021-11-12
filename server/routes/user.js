var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
const passport = require('passport');

module.exports = function (passport, connection) { 

    router.get('/', function(req, res){

        console.log('/', req.user);
        res.sendFile(__dirname+'/login.html');
    });

    router.get('/login', function(req,res){
        res.redirect('/');
      })
      

    router.post('/login_process', 
    passport.authenticate('local', {
        // successRedirect: '/',         cc
        failureRedirect: '/api/user', failureFlash: true }),
        function(req,res){
        req.session.save(function(){
            res.redirect('/api/aquarium/personal');
        })
    });


    router.get('/logout', function (req, res) {
        req.logout();
        req.session.save(function () {
        res.redirect('/api/user/');
            });
        });

    // router.post('/info_change', function (req, res){
    //     var data = req.body;
    //     var id = data.;
    //     var password = data.;
    //     var nickname = data.;
    //     connection.query()
        
    // });

    router.use(function (req, res, next) {
        res.status(404).send('Sorry cant find that!');
    });
    
    router.use(function (err, req, res, next) {
        console.error(err.stack)
        res.status(500).send('Something broke!')
    });

    return router;
}


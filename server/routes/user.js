var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
const passport = require('passport');

module.exports = function (passport) { 

    router.get('/', function(req, res){
        console.log('/', req.user);
        res.sendFile(__dirname+'/login.html');
    });
            


    router.get('/login', function(req,res){
        res.redirect('/');
      })
      
      // app.post('/login_process', 
      // passport.authenticate('local', {
      //     successRedirect: '/',         
      //     failureRedirect: '/',
      //     failureFlash: true 
      // }));

    router.post('/login_process', 
    passport.authenticate('local', {
        // successRedirect: '/',         
        failureRedirect: '/api/user', failureFlash: true }),
        function(req,res){
        req.session.save(function(){
            res.redirect('/api/user');
        })
    });


    router.get('/logout', function (req, res) {
        req.logout();
        req.session.save(function () {
        res.redirect('/');
            });
        });


    router.use(function (req, res, next) {
        res.status(404).send('Sorry cant find that!');
    });
    
    router.use(function (err, req, res, next) {
        console.error(err.stack)
        res.status(500).send('Something broke!')
    });

    return router;
}


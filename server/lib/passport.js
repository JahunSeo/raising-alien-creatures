module.exports = function (app, connection) {

    /* TEST용 deserializeuser에 전달할 data 결정후 삭제예정 */
    var authData = {
        email: 'kjy@kjy.net',
        
        password: '111111',
        nickname: 'kjy'
    };
    /* */
    
    /******* Passport init *****/
    var passport = require('passport')    
    const LocalStrategy = require('passport-local').Strategy;  
    
    app.use(passport.initialize());  
    app.use(passport.session());    
    
    // app.use((req, res, next) => {
    //     console.log(req.session);
    //     console.log(req.user);
    //     next();
    // })

    passport.serializeUser(function (user, done) {
        done(null, user.email); 
    });
    
    passport.deserializeUser(function (id, done) { 
        done(null, authData);  // user에게 authdata 가 전달된다 -> 식별자 기반으로 app에 사용할 데이터
    });
    
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (username, password, done){
            connection.query('select * from usrlist where email=?', [username], function(error,results,fields){
            console.log(results[0].email);
            console.log(username);
            console.log(results[0].pwd);
            console.log(password);
    
            if (username === results[0].email) {
                console.log(1);
                if (password == results[0].pwd) {
                console.log(2);
                    return done(null, results[0], {   
                        message: 'Welcome.'
                    });
                } else {
                console.log(3);
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
            } else {
            console.log(4);
                return done(null, false, {
                    message: 'Incorrect username.'
                });}
            })}
        ));
        return passport;
}
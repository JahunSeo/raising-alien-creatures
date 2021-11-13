module.exports = function (app, connection) {

    /* TEST용 deserializeuser에 전달할 data 결정후 삭제예정 */
    var authData = {
        email: 'kjy@kjy.net',
        
        password: '훔쳐봐',
        nickname: '훔쳐봐'
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
        console.log('로그인');
        done(null, user); 
    });
    
    passport.deserializeUser(function (identifier, done) { 
        // console.log(1212,identifier);
        done(null, identifier);  // user에게 authdata 가 전달된다 -> 식별자 기반으로 app에 사용할 데이터
    });
    
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (username, password, done){
            connection.query('select * from user_info where email=?', [username], function(error,results,fields){
            if (error){
                console.error(error);
            };

            if (username == results[0].email) {
                console.log('username confirmed.');
                if (password == results[0].password) {
                    delete results[0].password;
                    console.log('Log in success');
                    return done(null, results[0], {   
                        message: 'Welcome.'
                    });
                } else {
                console.log('Incorrect password.');
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
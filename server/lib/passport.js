module.exports = function (app, connection) {
  /* TEST용 deserializeuser에 전달할 data 결정후 삭제예정 */
  var authData = {
    email: "kjy@kjy.net",

    password: "훔쳐봐",
    nickname: "훔쳐봐",
  };
  /* */

  /******* Passport init *****/
  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "pwd",
      },
      function (username, password, done) {
        console.log("가자아자아");
        connection.query(
          "select * from user_info where email=?",
          [username],
          function (error, results, fields) {
            console.log(results);
            if (error) {
              console.error(error);
            }

            if (username == results[0].email) {
              console.log("username confirmed.");
              if (password == results[0].password) {
                delete results[0].password;
                console.log("Log in success", results[0]);
                return done(null, results[0], {
                  message: "Welcome.",
                });
              } else {
                console.log("Incorrect password.");
                return done(null, false, {
                  message: "Incorrect password.",
                });
              }
            } else {
              console.log(4);
              return done(null, false, {
                message: "Incorrect username.",
              });
            }
          }
        );
      }
    )
  );

  passport.serializeUser(function (user, done) {
    console.log("serializeUser", user);
    done(null, user.email);
  });

  passport.deserializeUser(function (email, done) {
    console.log("deserializeUser", email);
    // TODO: get user info from DB if needed
    done(null, email); // user에게 authdata 가 전달된다 -> 식별자 기반으로 app에 사용할 데이터
  });

  return passport;
};

const { message } = require("statuses");

module.exports = function (app, connection) {
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
        connection.query(
          "select * from user_info where email=?",
          [username],
          function (error, results, fields) {
            console.log("123", results);
            if (results === []) {
              console.log("넘어오나");
              return;
            }

            if (error) {
              console.error(error);
              return;
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
    done(null, user);
  });

  passport.deserializeUser(function (email, done) {
    console.log("deserializeUser", email);
    // TODO: get user info from DB if needed
    done(null, email); // user에게 authdata 가 전달된다 -> 식별자 기반으로 app에 사용할 데이터
  });

  return passport;
};
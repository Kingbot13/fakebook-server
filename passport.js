const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const passportJWT = require("passport-jwt");
const { ExtractJwt } = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('./models/user');
 
passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
  }, function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({facebookId: profile.id}, {
      first_name: profile._json.first_name,
      last_name: profile._json.last_name,
      profilePicUrl: profile.photos[0].value
    }, function (error, user) {
      return done(error, user);
    });
  }
));
// jwt strategy
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    (jwtPayload, done) => {
      // find user in db
      User.findById(jwtPayload._id, function (err, user) {
        if (err) {
          return done(err);
        }
        return done(null, user);
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          facebookId: profile.id,
          firstName: profile.first_name,
          lastName: profile.last_name,
          profileImage: profile.picture,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

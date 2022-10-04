const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
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

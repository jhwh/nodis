//eksport do osobnej metody
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var CLIENT_ID = '439807633657-clie2lr84ruqd7mg1mr37bnqucp2giir.apps.googleusercontent.com';
var CLIENT_SECRET = 'U5oCdDFCJ7BGNpWoIiUztg1D';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
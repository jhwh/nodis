//eksport do osobnej metody
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var CLIENT_ID = '439807633657-clie2lr84ruqd7mg1mr37bnqucp2giir.apps.googleusercontent.com';
var CLIENT_SECRET = 'U5oCdDFCJ7BGNpWoIiUztg1D';
var CALLBACK_URL = 'http://127.0.0.1:3000/auth/google/callback';

var User = require('./usermodel.js');

module.exports = function(app, passport) {

	    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

	passport.use(new GoogleStrategy({

        clientID        : CLIENT_ID,
        clientSecret    : CLIENT_SECRET,
        callbackURL     : CALLBACK_URL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));

};
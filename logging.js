//na razie nie uzywamy. szablon logowania z OAuthGoogle

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var CLIENT_ID = '439807633657-clie2lr84ruqd7mg1mr37bnqucp2giir.apps.googleusercontent.com';
var CLIENT_SECRET = 'U5oCdDFCJ7BGNpWoIiUztg1D';
//var REDIRECT_URL = ;

var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, '#');

function getAccessToken(oauth2Client, callback) {
  // generate consent page url
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: 'https://www.googleapis.com/auth/plus.me' // can be a space-delimited string or an array of scopes
  });

  console.log('Visit the url: ', url);
  rl.question('Enter the code here:', function(code) {
    // request access token
    oauth2Client.getToken(code, function(err, tokens) {
      // set tokens to the client
      // TODO: tokens should be set by OAuth2 client.
      oauth2Client.setCredentials(tokens);
      callback();
    });
  });
}

// retrieve an access token
getAccessToken(oauth2Client, function() {
  // retrieve user profile
  plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
    if (err) {
      console.log('An error occured', err);
      return;
    }
    console.log(profile.displayName, ':', profile.tagline);
  });
});
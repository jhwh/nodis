var express = require('express'),
    path = require('path');

var app = express();
var mongoose = require('mongoose');
var cors = require('cors');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportGoogle = require('./passport.js');

app.use(express.static(path.join(__dirname, '/')));

//Path to Jade views
//Not required because /views is the default folder for jade view-files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(cors());

//Passport
app.use(expressSession({ secret: process.env.SESSION_SECRET || 'secret', resave: false, saveUninitialized: false }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

require('./passport.js')(app, passport);

//mongoose
mongoose.connect('mongodb://localhost/nodisDB');
var users = require('./usermodel.js');

//Routes
app.get('/login',function(req,res){
	res.render('index',{
		title: "Nodis - Login Page"
	});
});

app.get('/login', passport.authenticate('google'), function(req,res,next){

});

app.get('/users',function(req,res){
	users.find(function(err, doc) {
		res.send(doc);
	});
});

app.get('/dashboard', isLoggedIn, function(req,res,next){
	res.render('dashboard',{
		title: "Nodis - Dashboard",
		user: req.user
	});

});

app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
});

//Google auth
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect : '/dashboard',
        failureRedirect : '/login'
     }));

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}



//Start Server
startServer();
// Start up the server
function startServer(){
	var server = app.listen(3000, function(){
		var port = server.address().port;
		console.log('Listen on port '+ port);
	})
}
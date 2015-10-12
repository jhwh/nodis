var express = require('express'),
    path = require('path');

var app = express();
var mongoose = require('mongoose');
var cors = require('cors');
var bcrypt = require('bcrypt-nodejs');

//var passport = require('./passport');

app.use(express.static(path.join(__dirname, '/')));

//Path to Jade views
//Not required because /views is the default folder for jade view-files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(cors());

//Passport
//app.use(passport.initialize());

//mongoose
mongoose.connect('mongodb://localhost/nodisDB');
var userSchema = mongoose.Schema({
	localy : {
		name : String,
		password : String,
	},
	google : {
		id : String,
		token : String,
		email : String,
		name : String
	}
});
//var user = mongoose.model('user', userSchema, 'users');

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

var users = mongoose.model('User', userSchema);

//Routes
app.get('/login',function(req,res,next){
	res.render('index',{
		title: "Nodis - Login Page"
	});
});

app.get('/users',function(req,res){
	users.find(function(err, doc) {
		res.send(doc);
	});
});

app.get('/dashboard', function(req,res,next){
	res.render('dashboard',{
		title: "Nodis - Dashboard",
		user: req.user
	});

});

app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
});

//Google authenticaton
//app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

//app.get('/auth/google/callback',
//	        passport.authenticate('google', {
//            successRedirect : '/dashboard',
//            failureRedirect : '/login'
//}));

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
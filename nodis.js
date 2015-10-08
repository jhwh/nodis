var express = require('express'),
    path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, '/')));

//Path to Jade views
//Not required because /views is the default folder for jade view-files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');





//Routes
app.get('/login',function(req,res,next){
	res.render('index',{
		title: "Nodis - Login Page"
	});
});


//Start Server
startServer();
// Start up the server
function startServer(){
	var server = app.listen(3000, function(){
		var port = server.address().port;
		console.log('Listen on port '+ port);
	})
}
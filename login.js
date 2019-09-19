var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	// port:'3306',
	password:'',
	database:'nodelogin'
});

 connection.connect(function(err) {
   if (!err)
   		console.log("Connected!");
   	else
   		console.log("Failed to connect to database");
 });


var app = express();

app.use(session({
	secret: 'djfhiu283rydmfrs248e8nf',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/auto', function(request, response) {
	var uname = request.body.yourname;
	var uemail = request.body.youremail;
	var utext = request.body.yourtext;
	if (uname && uemail && utext) {
		connection.query("INSERT INTO `messages` (`name`, `email`, `words`) VALUES ('"+uname+"', '"+uemail+"', '"+utext+"')", function(error, results) {
			if (results > 0) {
				response.redirect('/index.html');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);
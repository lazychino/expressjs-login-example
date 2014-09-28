var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'super secret',
    resave: false,
    saveUninitialized: false
}));


// login stuff


app.get('/login', function(req, res) {   // serve login form
    res.render('login', { message: '' });
});
                                                        
app.post('/login', function(req, res, next) {  
    var username = req.body.username;
    var password = req.body.password;
    
    // inside here you check the login info any way you want
    // use next(err) if a error happens here
    
    if(username !== "user") {
        return res.render('login', { message: "wrong user" });
    }
    
    if(password !== "1234") {
        return res.render('login', { message: "wrong password" });
    }
    
    req.session.loggedIn = true;  // is the user if correctly authenticated
    res.redirect('/');            // set a varible to check is the user is 
});                               // is logged in


app.get('/logout', function(req, res, next) { 
    req.session.destroy(function(err) {     // to logged out destroy the all
        if(err) next(err);                  // session data (or at least remove 
        res.redirect('/login');             // logged flag if you use the session
    });                                     // for other things
});


function isLoggedIn(req, res, next) {            // make a middleware to check if
    if(req.session) {                            // users are logged in
        if(req.session.loggedIn) return next();  
    }                                           
    res.redirect('/login');
}

// the function above can be used in the following ways

// like this
app.get('/hello', isLoggedIn, function(req, res) {  // authenticated a single route or router
    res.send("Hello");
});

// or this
app.use(isLoggedIn);      
// all routes after this middleware are available only to logged users 
// if you comment the middleware you can enter '/' without logging in

app.use('/', function(req, res) {
    res.render('index', { title: 'Express-login example demo' });
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

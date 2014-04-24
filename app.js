
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');

// Connect to the Mongo database, whether locally or on Heroku
var local_database_name = 'ytann';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);

var app = express();
var db = require('./models');

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('ytann secret key'));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(passport.session());
// The below exposes request-level info to the views, needed for authenticated user
// needs to go before app.router
app.use(function(req, res, next){
  res.locals.user = req.user;
  next();
});
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  db.User
    .findOne({_id: id},
    function(err, user) {
      if (err) done(err, null);
      if (user) {
        done(null, user);
      } else {
        done(null, false, {message: "incorrect sign in"});
      }
    });
});

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("accessToken", accessToken);
    db.User
      .findOne({ fb_id: profile.id },
        function(err, user) {
          if (err) done(err);
          if (!user) {
            // create new user
            user = new db.User({
              fb_id: profile._json.id,
              first_name: profile._json.first_name,
              last_name: profile._json.last_name,
              gender: profile._json.gender,
              img_path: 'http://graph.facebook.com/' + profile._json.id + '/picture?height=64&width=64',
              // location: profile._json.location.name,
              email: profile._json.email,
              access_token: accessToken
            });
            console.log('accessToken2', accessToken);
            user.save(function(err) {
              if (err) console.log(err);
              done(null, user);
            });
          } else {
            done(null, user);
          }
        });
  }
));

// Add routes here
app.get('/splash', index.splash);
app.get('/', index.view);
app.get('/users', users.list);
app.get('/user/:id', users.findOne);
// login and logout
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/splash' }),
  function(req, res) {
    // Successful authentication
    res.redirect('/');
  });
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/splash');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

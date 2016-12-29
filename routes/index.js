var express = require('express');
var router = express.Router();
var fs = require("fs");
var child_process = require("child_process");

var constants = require("../constants");
const UPLOAD_PATH = constants.UPLOAD_PATH;
const MAX_AGE_HOURS = constants.MAX_FILE_AGE_HOURS;

var passport = require("passport");

/*
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));
*/

router.get("/", function(req, res, next){
  if(req.isAuthenticated())
  {
    res.redirect("/upload");
    return
  }
  
  res.render("index", {title: "Youtube Uploader - Login"});
});

/* GET home page. */
router.get('/upload', isLoggedIn, function(req, res, next) {
  res.render('upload', {title: 'Youtube Uploader' });
});

router.post("/upload", isLoggedIn, function (req, res, next) {
  //CHANGE THIS TO ACCEPT A SINGLE FILE AT A TIME
  //Handle the process via session if possible, and send back response via 
  var sess = req.session;
  //Delete Old files, not the ones just passed in. DO THIS BY AGE
  fs.readdir(UPLOAD_PATH, function (err, files) {
    var maxAge = new Date();
    maxAge.setHours(maxAge.getHours() - MAX_AGE_HOURS);
    var filesStats = {};
    files.forEach(f => filesStats[f] = fs.statSync(`${UPLOAD_PATH}${f}`));
    var toDelete = files.filter(f => filesStats[f].birthtime < maxAge);
    if (toDelete && toDelete.length)
    {
      toDelete.forEach(f => fs.unlink(`${UPLOAD_PATH}${file}`));
    }
    //Make this work with a single file and assume multiple calls

    if(req.files && req.files[0])
    {
      var fn = req.files[i].filename;
    
    
      var child = child_process.exec(`youtube-upload --title ${titles[i]} ${fn} --privacy private`, {cwd:UPLOAD_PATH});
      child.stdout.on("data",function(data){
        console.log(data);
        var percentageMatch = data.match(/\d+%/g);
        if(percentageMatch && percentageMatch.length)
        {
          sess[fn] = sess[fn] || {};
          sess.uploadPercentage = parseInt(percentageMatch[0].slice(0,-1)); //hopefully find a percentage in there.
        }
      });
      child.stderr.on("data", data => {
        sess[fn] = sess[fn] || {};
        sess.uploadError = data;
      });
      child.on("close", code => {
        sess[fn] = sess[fn] || {};
        sess.uploadProcFinished = true;
      });

      res.send(JSON.stringify(req.files));
    }
  });
});

router.get("/uploadstatus/:id", isLoggedIn, function(req, res, next){
  var id = req.params.id;
  var subject = req.session[id];
  
  if(subject)
  {
    res.send(JSON.stringify({
        progress: subject.uploadPercentage,
        error: Boolean(subject.uploadError),
        errorMessage: subject.uploadError,
        completed: subject.uploadProcFinished
      }));
  }
  else{
    res.send(JSON.stringify({
        progress: 0,
        error: true,
        errorMessage: "subject not found",
        completed: false
      }));
  }
  

});
//Auth

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect("/");
});

//GOOGLE auth

//Get Auth
router.get("/auth/google", passport.authenticate("google", {scope:
  [
    "https://www.googleapis.com/auth/youtube.upload",
    "profile",
    "email"
  ], accessType:"offline"}));

//Google callback
router.get("/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/upload",
    failureRedirect: "/"
  })
);




//MIDDLEWARE
function isLoggedIn(req, res, next){
  if(req.isAuthenticated())
    return next();
  
  res.redirect("/");
}
module.exports = router;

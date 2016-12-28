// config/passport.js

//Create the configs required for the various passport strategies

var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

var User = require("../models/user");

var configAuth = require("./auth");

module.exports = function(passport){
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id,done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    });

    //Google Strat config
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackUrl
    },

    (token, refreshToken, profile, done) => {
        process.nextTick(() => {
            User.findOne({"google.id": profile.id}, (err, user) => {
                if(err)
                    return done(err);
                
                if(user){
                    return done(null, user);
                }
                else{
                    var newUser = new User();

                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.name;
                    newUser.google.email = profile.emails[0].value;

                    newUser.save((err) => {
                        if(err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};
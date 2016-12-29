var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    google:{
        "id":String,
        "token":String,
        "refreshToken":String,
        "email":String,
        "name":{
            familyName: String,
            givenName: String
        }
    }
});

module.exports = mongoose.model( "User", userSchema);
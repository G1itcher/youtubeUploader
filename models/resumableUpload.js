var mongoose = require("mongoose");

var resumableUploadSchema = mongoose.Schema({
    resumableUri: String,
    fileDescriptor: Number,
    video: mongoose.Schema.Types.ObjectId
});
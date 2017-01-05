var mongoose = require("mongoose");
var uploadStates = require("./enums/uploadStates");
var uploadStages = require("./enums/uploadStages");
var fs = require("fs");
var resumableUpload = require("./resumableUpload");

var videoSchema = mongoose.Schema({
    filepath: String,
    uploadState: uploadStates.raw,
    uploadStage: uploadStages.raw,
    failCount: Number,
    currentPercentage: Number,
    creationDate: Date,
    uploadDate: Date,
    youtubeMetaData: {
        name: String,
        description: String
    },
    resumableUpload: resumableUpload
});

videoSchema.methods.getFileStats = () => {
    return fs.statSync(this.filepath);
}

//Upload it like so:
//resumable upload object needs to be turned into a mongoose model
//How do I create a new object within another model?
//Mongoose model should have functions that rehydrate the model into a uploader object
//videoSchema.methods.getResumableUpload
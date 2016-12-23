var express = require('express');
var router = express.Router();
var fs = require("fs");
var child_process = require("child_process");

var uploadPath = "./uploads/";//require("../constants.js").UPLOAD_PATH;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Youtube Uploader' });
});

router.post("/", function (req, res, next) {
  //CHANGE THIS TO ACCEPT A SINGLE FILE AT A TIME
  //Handle the process via session if possible, and send back response via 
  var sess = req.session;
  //Delete Old files, not the ones just passed in. DO THIS BY AGE
  fs.readdir(uploadPath, function (err, files) {
    var toDelete = files.filter(f => !req.files.some(rf => rf.filename == f))
    if (toDelete && toDelete.length)
    {
      toDelete.forEach(function(file){
          fs.unlinkSync(`${uploadPath}${file}`);
      });
    }

    //Make this work with a single file and assume multiple calls

    var fn = req.files[i].filename;
    var child = child_process.exec(`youtube-upload --title ${titles[i]} ${fn} --privacy private`, {cwd:uploadPath});
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
  });
});

router.get("/uploadstatus/:id", function(req, res, next){
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
  

})

module.exports = router;

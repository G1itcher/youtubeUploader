var express = require('express');
var router = express.Router();
var fs = require("fs");
var child_process = require("child_process");

var uploadPath = require("../constants.js").UPLOAD_PATH;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express' });
});

router.post("/", function (req, res, next) {
  //Delete Old files, not the ones just passed in
  fs.readdir(uploadPath, function (err, files) {
    var toDelete = files.filter(f => !req.files.some(rf => rf.filename == f))
    if (toDelete && toDelete.length)
    {
      toDelete.forEach(function(file){
          fs.unlinkSync(`${uploadPath}${file}`);
      });
    }

    var titles = Array.isArray(req.body.title)? req.body.title : [req.body.title];

    for(var i = 0; i < titles.length; i++)
    {
      child_process.exec(`youtube-upload --title ${titles[i]} ${req.files[i].filename} --privacy private`, {cwd:uploadPath},
      function(err, stdout, stderr){
        console.log(err);
        console.log(stdout);
        console.log(stderr);
      });
    }

    res.send("");
  });
});

module.exports = router

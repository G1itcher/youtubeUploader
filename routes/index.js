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
    var toDelete = files.filter(f => !req.files.some(rf => rf.filename == name))
    if (toDelete && toDelete.length)
    {
      files.forEach(function(file){
          fs.unlinkSync(`${uploadPath}${file}`);
      });
    }
  });

  var titles = [...req.body.title]

  for(var i = 0; i < titles.length; i++)
  {
    child_process.exec(`youtube-upload --title ${titles[i]} ${req.files.filename}`, {cwd:uploadPath});
  }

  res.send("");
});

module.exports = router;

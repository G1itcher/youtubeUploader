var express = require('express');
var router = express.Router();
var fs = require("fs");

var uploadPath = require("../constants.js").UPLOAD_PATH;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/", function(req, res, next) {
  //Delete Old files
  fs.readdir(uploadPath,function(err, files){
    if(files && files.length)
    {
      for (var file of files)
      {
        if(file != req.files[0].filename)
        {
          fs.unlinkSync(`${uploadPath}${file}`)
        }
      }
    }
  });
  
  
  
  res.send("");
});

module.exports = router;

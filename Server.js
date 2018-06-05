var express =   require("express");
var multer  =   require('multer');
var path = require('path');
var app         =   express();
app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
      var filename=req.file.originalname;
        if(err) {
            return res.end("Error uploading file.");
        }
        res.send(JSON.stringify({value: '/upload/'+filename}));
    });
});
app.get('/download/:file(*)',(req, res) => {
  var file = req.params.file;
  var fileLocation = path.join('./uploads',file);
  var fs = require('fs');
  if(!fs.existsSync(fileLocation)){
    res.send(JSON.stringify({status: 0}));
  }
  console.log(fileLocation);
  res.download(fileLocation, file);
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});

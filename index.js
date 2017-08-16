var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var Raspistill = require('node-raspistill').Raspistill;
var camera = new Raspistill({
    outputDir: './stream/',
    fileName: 'image_stream',
    encoding: 'jpg',
    time: 1,
    width: 640,
    height: 480
});
var gphoto2 = require('gphoto2');
var GPhoto = new gphoto2.GPhoto2();
var fs = require('fs');
var Gpio = require('onoff').Gpio,
  led = new Gpio(16, 'out'),
  button = new Gpio(21, 'in', 'both');

app.use('/', express.static(path.join(__dirname, 'stream')));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var sockets = {};

io.on('connection', function(socket) {

  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);
  testgPhoto();

  socket.on('disconnect', function() {
    delete sockets[socket.id];
  });

  socket.on('start-takePictures', function() {
    countdown(io, 5); //5 sec countdown
  });

});

http.listen(3000, function() {
  console.log('listening on *:3000');
});

function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
  }
}

function takePicture(io) {
  console.log('taking Picture...');
  camera.takePhoto()
    .then((photo) => {
      console.log('Emit picture');
      io.sockets.emit('picture', 'image_stream.jpg?_t=' + (Math.random() * 100000));
      setTimeout(reset,5000, io);
    })
    .catch((err) => {
        console.log('probably stopped, checking error');
        console.log(err instanceof RaspistillInterruptError); // true, raspistill was interrupted;
    });
}

function reset(io) {
  console.log('emit reset ');
  io.sockets.emit('reset');
}

function countdown(io, count) {
  console.log('emit countDown ' + count);
  io.sockets.emit('countDown', count);
  if (count == 0) {
    takePicture(io);
  } else {
    setTimeout(countdown,1000, io, count -1);
  }
}

button.watch(function(err, value) {
  led.writeSync(value);
});

function testgPhoto() {
console.log('testing gPhoto');
// List cameras / assign list item to variable to use below options
GPhoto.list(function (list) {
  console.log('list length ' + list.length);
  if (list.length === 0) return;
  var camera = list[0];
  console.log('Found', camera.model);

  // get configuration tree
  camera.getConfig(function (er, settings) {
    console.log(settings);
  });

  // Set configuration values
  camera.setConfigValue('capturetarget', 1, function (er) {
    //...
  });

  // Take picture with camera object obtained from list()
  camera.takePicture({download: true}, function (er, data) {
    fs.writeFileSync(__dirname + '/picture.jpg', data);
  });

  // Take picture without downloading immediately
  camera.takePicture({download: false}, function (er, path) {
    console.log(path);
  });

  // Take picture and download it to filesystem
  camera.takePicture({
    targetPath: '/tmp/foo.XXXXXX'
  }, function (er, tmpname) {
    fs.renameSync(tmpname, __dirname + '/picture.jpg');
  });

  // Download a picture from camera
  camera.downloadPicture({
    cameraPath: '/store_00020001/DCIM/100CANON/IMG_1231.JPG',
    targetPath: '/tmp/foo.XXXXXX'
  }, function (er, tmpname) {
    fs.renameSync(tmpname, __dirname + '/picture.jpg');
  });

  // Get preview picture (from AF Sensor, fails silently if unsupported)
  camera.takePicture({
    preview: true,
    targetPath: '/tmp/foo.XXXXXX'
  }, function (er, tmpname) {
    fs.renameSync(tmpname, __dirname + '/picture.jpg');
  });
});
}

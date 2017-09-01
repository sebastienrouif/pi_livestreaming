var express = require('express');
var app = express();
var http = require('http').Server(app);

// fb
var FB = require('fb'),
    fb = new FB.Facebook();
FB.setAccessToken('EAACEdEose0cBALwXnESFStSPIrNhZAJL04s19rQiDZCUmveMv80Ah5nQONxzqk9tSu6ZBtSgK2tyEmk3f0ZBPsk7L9bn7JGNsV6GMqxnMywt6z5PTwn96SRH4EFJvEiPqgby2pk0LhDDvl5UZCxlwpeb1i1fpYmNZBrHffZBmZCHyise3g1xixZA757P9rxC8ZCiewZBRmA9GTSi6CPBqJVgIznpJJLIJZCkUDcZD');
var event_wedding_id : 1219917591379215,
    album_wedding_id : 114810819202282,
    group_wedding_id : 114809552535742;

// image resizer
import sharp from 'sharp';

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
console.log('init camera');
var dslr;
GPhoto.list(function (list) {
  console.log('list length ' + list.length);
  if (list.length === 0) return;
  dslr = list[0];
  console.log('Found', dslr.model);
});
var spawn = require('child_process').spawn;
var proc;

app.use('/', express.static(path.join(__dirname, 'stream')));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var sockets = {};
var isTakingPicture = false;

io.on('connection', function(socket) {

  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);

  socket.on('disconnect', function() {
    delete sockets[socket.id];
  });

  socket.on('start-takePictures', function() {
    countdown(io, 3);
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
      emitPicture('image_stream.jpg?_t=' + (Math.random() * 100000));
      setTimeout(reset,5000, io);
    })
    .catch((err) => {
        console.log('probably stopped, checking error');
        console.log(err instanceof RaspistillInterruptError); // true, raspistill was interrupted;
    });
}

function emitPicture(picturePath) {
  console.log('Emit picture');
  io.sockets.emit('picture', picturePath);
}

function reset(io) {
  console.log('emit reset ');
  io.sockets.emit('reset');
}

function countdown(io, count) {
  console.log('emit countDown ' + count);
  io.sockets.emit('countDown', count);
  if (count == 0) {
    takeDslrPhoto2();
  } else {
    setTimeout(countdown,1000, io, count -1);
  }
}

button.watch(function(err, value) {
console.log('button ' + value)
  led.writeSync(value);
  if(value == 0 && !isTakingPicture) {
    isTakingPicture  = true;
    countdown(io, 2); //2 sec countdown
  }
});


// DEPRECATED
function takeDslrPhoto() {
  console.log('taking DSLR Picture...');
  dslr.takePicture({
    targetPath: '/tmp/photoBooth.XXXXXX'
  }, function (er, tmpname) {
    console.log('took DSLR Picture...' + er);
    var newName = __dirname + '/stream/' + createPictureName();
    fs.renameSync(tmpname, newName);
    console.log('wrote Picture...');
    uploadPicToFb(newName);
    isTakingPicture = false;
  });
}


function uploadPicToFb(picPath){
  FB.api(album_wedding_id+'/photos', 'post', { source: fs.createReadStream(picPath), caption: '' }, function (res) {
    if(!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      return;
    }
    console.log('Post Id: ' + res.post_id);
  });
}

function takeDslrPhoto2() {
  console.log('taking DSLR Picture2...');
  // Take picture with camera object obtained from list()
  dslr.takePicture({download: true}, function (er, data) {
    console.log('took DSLR Picture2...' + er);
    var pictureName = createPictureName();
    var picPath = __dirname + '/stream/' + pictureName ;
    var sdPicPath = __dirname + '/stream/sd_' + pictureName
    fs.writeFileSync(picPath, data);
    console.log('wrote Picture2...');


    sharp(data)
      .resize(1054, 703)
      .toFile(sdPicPath, (err, info) => {
        console.log('error while resizing pic');
      });


    emitPicture(sdPicPath);
    uploadPicToFb(__dirname + '/stream/sd_' + pictureName);
    isTakingPicture = false;
  });
}

function createPictureName() {
  return 'picture_' + (new Date()).getTime() + '.jpg';
}

function createPicturePath() {
  return '/stream/picture_' + (new Date()).getTime() + '.jpg';
}

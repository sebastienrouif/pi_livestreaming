var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var Raspistill = require('node-raspistill').Raspistill;
var camera = new Raspistill({
    outputDir: './stream/',
    fileName: 'image_stream.jpg',
    encoding: 'jpg',
    width: 640,
    height: 480
});

app.use('/', express.static(path.join(__dirname, 'stream')));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var sockets = {};

io.on('connection', function(socket) {

  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);

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




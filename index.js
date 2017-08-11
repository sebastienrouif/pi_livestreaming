var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');

var spawn = require('child_process').spawn;
var proc;

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

    // no more sockets, kill the stream
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile('./stream/image_stream.jpg');
    }
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
    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile('./stream/image_stream.jpg');
  }
}

function takePicture(io) {

  if (app.get('watchingFile')) {
    io.sockets.emit('picture', 'image_stream.jpg?_t=' + (Math.random() * 100000));
    return;
  }

  var args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg"];
  proc = spawn('raspistill', args);

  console.log('Watching for changes...');

  app.set('watchingFile', true);

  fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
    console.log('emit picture');
    io.sockets.emit('picture', 'image_stream.jpg?_t=' + (Math.random() * 100000));
    app.set('watchingFile', false);
    setTimeout(reset,5000, io);
  })
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




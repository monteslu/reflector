var io = require('socket.io').listen(11097);

io.sockets.on('connection', function (socket) {
  socket.joinedChannels = [];

  socket.on('getChan',function(obj){
    console.log('hello getChan request', obj);
    var chanId = "" + Math.floor(Math.random() * 10000000);
    socket.emit('chanId', chanId);
    socket.join(chanId);
  });

  socket.on('broadcast', function(obj){
    socket.broadcast.to(obj.id).emit('broadcast', obj); //dont send back to self
    if(this.request){
      this.resultCB('ok');
    }
  });

  socket.on('joinChannel', function(id){
    if(socket.joinedChannels.length < 5){
      socket.join(id);
      socket.joinedChannels.push(id);
      socket.emit('joined', id);
    }
  });
});

var io = require('socket.io').listen(11097);

io.sockets.on('connection', function (socket) {

  socket.on('getChan',function(obj){
    console.log('hello getChan request', obj);
    var chanId = "" + Math.floor(Math.random() * 10000000);
    socket.emit('chanId', chanId);
    socket.join(chanId);
  });

  socket.on('broadcast', function(obj){
    socket.broadcast.to(obj.id).emit('broadcast', obj); //dont send back to self
  });

  socket.on('joinChannel', function(id){
    var roomsJoined = Object.keys(io.sockets.manager.roomClients[socket.id]);
    if(roomsJoined.length < 5){
      socket.join(id);
      socket.emit('joined', id);
    }
  });
});

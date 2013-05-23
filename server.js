
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes');
  
var app = module.exports = express.createServer();

var io = require('socket.io').listen(app);

//Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/control', routes.control);



app.listen(11097);
console.log("Express server listening on http://localhost:%d in %s mode", app.address().port, app.settings.env);





io.sockets.on('connection', function (socket) {

  //console.log('newsocket',socket);
  socket.joinedChannels = [];


  socket.on('getChan',function(obj){
    console.log('hello getChan request', obj);
    var chanId = "" + Math.floor(Math.random() * 10000000);
    socket.emit('chanId', chanId);
    socket.join(chanId);
  });

  socket.on('broadcast', function(obj){
    //console.log('broadcast', obj);
    //io.sockets.in(obj.id).emit('broadcast', obj);
    socket.broadcast.to(obj.id).emit('broadcast', obj); //dont send back to self
    //don't bother with a response if over a websocket
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


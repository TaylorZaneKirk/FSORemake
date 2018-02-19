var express = require('express')
  , app = express(app)
  , server = require('http').createServer(app);
 
 
// serve static files from the current directory
app.use(express.static(__dirname));
 
 
server.listen(8000);

//get EurecaServer class
var Eureca = require('eureca.io');
 
//create an instance of EurecaServer
var eurecaServer = new Eureca.Server();
 
//attach eureca.io to our http server
eurecaServer.attach(server);

//detect client connection
eurecaServer.onConnect(function (conn) {    
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);
});
 
//detect client disconnection
eurecaServer.onDisconnect(function (conn) {    
    console.log('Client disconnected ', conn.id);
});
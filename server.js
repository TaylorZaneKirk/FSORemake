var express = require('express')
    , app = express()
    , server = require('http').createServer(app)

// serve static files from the current directory
app.use(express.static(__dirname));

var Eureca = require('eureca.io');


//create an instance of EurecaServer
var eurecaServer = new Eureca.Server();

//attach eureca.io to our http server
eurecaServer.attach(server);

var PlayerState =
{
    pos = {x, y},
    playerFacing,
    playerName,
    WorldX,
    WorldY,
    lastUpdated,
    readyToUpdate,

    constructor(idString){
        pos = {x: 0, y: 0};
        playerFacing = 'S';
        playerName = idString;
        WorldX = 0;
        WorldY = 0;
        lastUpdated = null;
        readyToUpdate = false;
    },
    
    constructor(other)
    {
        pos = other.pos;
        playerFacing = other.playerFacing;
        playerName = other.playerName;
        WorldX = other.WorldX;
        WorldY = other.WorldY;
        lastUpdated = other.lastUpdated;
        readyToUpdate = other.readyToUpdate;
    }
};

//var worldMap = {floors : [], npcs: []};
var players = {};

/* var npcs = {};
var npcsPerMap = 3; */

// map dimensions
/* var ROWS = 30;
var COLS = 40; */

//detect client connection
eurecaServer.onConnect(function (conn) {
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);

    //the getClient method provide a proxy allowing us to call remote client functions
    var remote = eurecaServer.getClient(conn.id);

    //register the client
    players[conn.id] = {id:conn.id, remote:remote, state: new PlayerState(conn.id)}

    //var spawnLoc = findSpawn(players[conn.id], 0);

    //here we call setId (defined in the client side)
    remote.setId(conn.id);

    //remote.setMap(worldMap.floors[0], spawnLoc, worldMap.npcs[0], worldMap.warps[0]);
    //remote.testMap(worldMap.floors[0], worldMap.warps[0]);
});

//detect client disconnection
eurecaServer.onDisconnect(function (conn) {
    console.log('Client disconnected ', conn.id);

    var removeId = players[conn.id].id;

    delete players[conn.id];

    for (var c in players)
    {
        var remote = players[c].remote;

        //here we call kill() method defined in the client side
        remote.kill(conn.id);
    }
});

/**
* Player logs itself into the array of players (handshake still needs to be called
* to do the update. That's done on the client right after).
*/
eurecaServer.exports.initPlayer(function (id) {

    players[id].state.readyToUpdate = true;
});
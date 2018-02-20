var express = require('express')
    , app = express()
    , server = require('http').createServer(app)

// serve static files from the current directory
app.use(express.static(__dirname));

var Eureca = require('eureca.io');


//create an instance of EurecaServer
var eurecaServer = new Eureca.Server({allow:['setId', 'recieveStateFromServer']});

//attach eureca.io to our http server
eurecaServer.attach(server);

class PlayerState
{
    constructor(idString){
        this.pos = {x: 0, y: 0};
        this.playerFacing = 'S';
        this.playerName = idString;
        this.playerAction = 'idle';
        this.WorldX = 0;
        this.WorldY = 0;
        this.lastUpdated = null;
        this.readyToUpdate = false;
        this.playersVisible = [];
    }
    
    copy(other)
    {
        this.pos = other.pos;
        this.playerFacing = other.playerFacing;
        this.playerName = other.playerName;
        this.playerAction = other.playerAction;
        this.WorldX = other.WorldX;
        this.WorldY = other.WorldY;
        this.lastUpdated = other.lastUpdated;
        this.readyToUpdate = other.readyToUpdate;
        this.playersVisible = other.playersVisible;
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
        //remote.kill(conn.id);
    }
});

app.get('/', function (req, res, next) {
    res.sendFile(__dirname+'/index.html');
});

server.listen(process.env.PORT || 55555, function () {
    console.log('\033[96mlistening on localhost:55555 \033[39m');
    console.log("Beginning Map-generation...");
    //mapData = generateMap();

    /* mapData_1 = generateMap();
    worldMap.floors.push(mapData_1);
    mapWarps_1 = generateWarps(mapData_1, 0);
    worldMap.warps.push(mapWarps_1);
    worldMap.npcs.push(generateNPCs(0));

    mapData_2 = generateMap();
    worldMap.floors.push(mapData_2);
    mapWarps_2 = generateWarps(mapData_2, 1);
    worldMap.warps.push(mapWarps_2);
    worldMap.npcs.push(generateNPCs(1));

    //worldMap.push.npcs
    npcs = generateNPCs(0); */
});

/**
* Player logs itself into the array of players (handshake still needs to be called
* to do the update. That's done on the client right after).
*/
eurecaServer.exports.initPlayer = function (id) {

    var currentTime = new Date().getTime()

    players[id].state.readyToUpdate = true;
    players[id].state.lastUpdated = currentTime;
    //remote.recieveStateFromServer(players[id].state);
    eurecaServer.updateClientsAboutNewPlayer(id);

}

eurecaServer.exports.requestUpdate = function (id) {

    var currentServerTime = new Date().getTime();
    if(players[id].state.lastUpdated + 1250 < currentServerTime){
        console.log("incoming request");
        players[id].state.lastUpdated = currentServerTime;
        var remote = eurecaServer.getClient(id);

        //Fetch users that are on the same page
        remote.recieveStateFromServer(players[id].state);
        //eurecaServer.updateClients();
    } 
}

eurecaServer.exports.message = function(id, message){
    //message represents the action, id is the sender of that action
    //  message will contain info about what action to perform
    //  as well as the target of the action, whether that be
    //  self, another pc, an npc/enemy, or all users
    //  message structure: message = {
    //      action: {
    //          type //move, attack, localBroadcast, globalBroadcast, whisper, etc...
    //          payload //direction for move, what they're saying, etc...
    //      },
    //      target: //None, Self, OtherPC, NPC, ALL, Object
    //  }
    if(message == null || message == undefined ||
        message.action == null || message.action == undefined ||
        message.action.type == null || message.action.type == undefined ||
        message.action.payload == null || message.action.payload == undefined ||
        message.target == null || message.target == undefined){
        console.log("ERROR: Recieved invalid message");
        return;
    }
    
    switch(message.action.type){
        case 'move': {
            //do move
            console.log('Got move');
            break;
        }
        case 'attack': {
            //do attack
            break;
        }
        case 'localBroadcast': 
        case 'globalBroadcast': {
            //do broadcast
            break;
        }
        default: {
            console.log("ERROR: Recieved invalid message");
            return;
        }
    }
}

eurecaServer.updateClientsAboutNewPlayer = function (id) {
    for(var i in players) {
        var remote = players[i].remote;
        remote.recieveStateFromServer(players[id].state);
    }
}

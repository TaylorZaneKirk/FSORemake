var fs = require('fs');
var serverActions = require('./serverActions');

var express = require('express')
    , app = express()
    , server = require('http').createServer(app)

// serve static files from the current directory
app.use(express.static(__dirname));

var Eureca = require('eureca.io');


//create an instance of EurecaServer
var eurecaServer = new Eureca.Server({allow:['setId', 'recieveStateFromServer', 'kill', 'disconnect']});

//attach eureca.io to our http server
eurecaServer.attach(server);


//Player state needs to have Health implemented
class PlayerState
{
    constructor(idString){
        this.pos = {x: 0, y: 0};
        this.playerFacing = 'S';
        this.playerName = idString;
        this.playerAction = 'idle';
        this.worldX = 0;
        this.worldY = 0;
        this.lastUpdated = null;
        this.readyToUpdate = false;
        this.playersVisible = {};
        this.mapData = worldMap[this.worldX + '-' + this.worldY].mapData;
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
        this.mapData = other.mapData;
    }

    changeMapData(worldXNew, worldYNew){ 
        console.log("Changing map for player: " + this.playerName);
        worldMap[worldXNew + '-' + worldYNew].players[this.playerName] = this;

        //Need to Let other players know this guy left
        delete worldMap[this.worldX + '-' + this.worldY].players[this.playerName];

        /* for (var c in worldMap[this.worldX + '-' + this.worldY].players){
            var remote = players[c].remote;

            //here we call kill() method defined in the client side
            remote.kill(this.playerName);
        } */
        this.mapData = worldMap[worldXNew + '-' + worldYNew].mapData;
        this.worldX = worldXNew;
        this.worldY = worldYNew;
        console.log("Changed to: " + this.worldX + "," + this.worldY);
    }
};



var players = {};
//Should add a world map object
var worldMap = {}

//detect client connection
eurecaServer.onConnect(function (conn) {
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);

    //the getClient method provide a proxy allowing us to call remote client functions
    var remote = eurecaServer.getClient(conn.id);

    //register the client
    players[conn.id] = {id:conn.id, remote:remote, state: new PlayerState(conn.id)}

    //here we call setId (defined in the client side)
    remote.setId(conn.id);
});

//detect client disconnection
eurecaServer.onDisconnect(function (conn) {
    console.log('Client disconnected ', conn.id);

    for (var c in players)
    {
        var remote = players[c].remote;

        //here we call kill() method defined in the client side
        remote.kill(conn.id);
    }
    delete worldMap[players[conn.id].state.worldX + '-' + players[conn.id].state.worldY].players[conn.id];
    delete players[conn.id];
});

app.get('/', function (req, res, next) {
    res.sendFile(__dirname+'/index.html');
});

server.listen(process.env.PORT || 55555, function () {
    console.log('\033[96mlistening on localhost:55555 \033[39m');
    loadMapData();
});

/**
* Player logs itself into the array of players (handshake still needs to be called
* to do the update. That's done on the client right after).
*/
eurecaServer.exports.initPlayer = function (id) {

    var currentTime = new Date().getTime()

    players[id].state.readyToUpdate = true;
    players[id].state.lastUpdated = currentTime;
    worldMap[players[id].state.worldX + '-' + players[id].state.worldY].players[id] = players[id].state;
    eurecaServer.updateClients(id);

}

//Recieved state update request from a client
eurecaServer.exports.requestUpdate = function (id) {

    var currentServerTime = new Date().getTime();
    if(players[id] && players[id].state.lastUpdated + 1250 < currentServerTime){
        players[id].state.lastUpdated = currentServerTime;
        
        eurecaServer.updateClients(id);
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
    //      target: //None, Self, OtherPC, NPC, ALL, Object, Visible
    //  }
    if(message == null || message == undefined ||
        message.action == null || message.action == undefined ||
        message.action.type == null || message.action.type == undefined ||
        message.action.payload == null || message.action.payload == undefined ||
        message.target == null || message.target == undefined){
        console.log("ERROR: Recieved invalid message");
        return;
    }

    //Give some thought to still implementing something
    //  to stop players from updating too quickly
    
    switch(message.action.type){
        case 'move': {
            serverActions.movePlayer(players[id].state, message.action.payload);
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

//Update player about all players, and all players about player
eurecaServer.updateClients = function (id) {
    var newRemote = players[id].remote;
    var allPlayerStates = [];

    for(var i in players) {
        if(players[i].id != id){
            var remote = players[i].remote;

            //This is where I should implement something to only
            //  update players on the same map
    
            //players[i].state.playersVisible = worldMap[players[i].state.worldX + '-' + players[i].state.worldY].players;
            players[i].state.playersVisible = Object.filter(worldMap[players[i].state.worldX + '-' + players[i].state.worldY].players, player => player.playerName != players[i].id);
            remote.recieveStateFromServer(players[i].state);
        }
       
    }

    players[id].state.playersVisible = Object.filter(worldMap[players[id].state.worldX + '-' + players[id].state.worldY].players, player => player.playerName != id);
    /* console.log("local:");
    console.log(players[id].state.playersVisible); */
    newRemote.recieveStateFromServer(players[id].state);

    /* for(var i in allPlayerStates){
        if(allPlayerStates[i].playerName != id){
            newRemote.recieveStateFromServer(allPlayerStates[i]);
        }
    } */
}

/* readMapFromFile = function(id, x, y){
    
    var returnString = '';
    var filePath = __dirname + '/maps/' + x + '-' + y + '.txt'
    console.log(filePath);
    fs.readFile(filePath, 'utf8', function(err, contents) {
        returnString = contents;
        console.log(contents);
        
        players[id].state.mapData = contents;
    });
    
} */

loadMapData = function(){
    console.log('Generating World Map...');
    var totalFiles = -1;
    var filesRead = 0;
    fs.readdir(__dirname + '/maps/', function(err, filenames){
        if (err) {
            console.log(err);
            return;
        }
        totalFiles = filenames.length;
        filenames.forEach(function(filename) {

            fs.readFile(__dirname + '/maps/' + filename, 'utf-8', function(err, content) {
                if (err) {
                    console.log(err);
                    return;
                }

                mapName = filename.substring(0, filename.lastIndexOf("."));

                worldMap[mapName] = {
                    mapData: {},
                    players: {},
                    npcs: {},
                    items: {},
                };

                var index = 0;

                for (var x = 0; x < 12; x++){
                    worldMap[mapName].mapData[x] = {};
                    for (var y = 0; y < 17; y++) {
                        if(content[index] == '\n' || content[index] == ';'){
                            y--;
                        }
                        else if(content[index] != '\n' && content[index] != ';'){
                            worldMap[mapName].mapData[x][y] = content[index];
                        }
                        index++;
                    }
                }
                filesRead++;
                
                if(filesRead != 0 && filesRead == totalFiles){
                    console.log("Wold Map Generated");
                }
            });
        });
    });
}

/* Object.filter = (obj, predicate) => 
    Object.keys(obj)
        .filter( key => predicate(obj[key]) )
        .reduce( (res, key) => (res[key] = obj[key], res), {} ); */

Object.filter = (obj, predicate) => 
    Object.keys(obj)
        .filter( key => predicate(obj[key]) )
        .reduce(function(res, key, res){
            props = Object.keys(obj[key])
                .filter(prop => prop != 'playersVisible')
            objCopy = {};
            for(var i in props){
                objCopy[props[i]] = obj[key][props[i]];
            }
            res[key] = objCopy;
            return res;
        },{} );
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

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1VT2yQtVjX",
  database: "FSORemake"
});

con.connect(function(err) {
  if (err) throw err;
  /* con.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  }); */
  console.log("Database Connection Established");
});


//Player state needs to have Health implemented
class PlayerState
{
    constructor(idString, data){
        this.pos = {x: data.localX, y: data.localY};
        this.playerFacing = 'S';
        this.playerName = idString;
        this.playerAction = 'idle';
        this.worldX = data.worldX;
        this.worldY = data.worldY;
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
        worldMap[worldXNew + '-' + worldYNew].players[this.playerName] = this;

        //Need to Let other players know this guy left
        delete worldMap[this.worldX + '-' + this.worldY].players[this.playerName];

        for (var c in worldMap[this.worldX + '-' + this.worldY].players){
            var remote = players[c].remote;

            //here we call kill() method defined in the client side
            remote.kill(this.playerName);
        }
        this.mapData = worldMap[worldXNew + '-' + worldYNew].mapData;
        this.worldX = worldXNew;
        this.worldY = worldYNew;
    }

    takeStep(x, y){
        if((x + 1 == this.pos.x || x - 1 == this.pos.x || x == this.pos.x)
            && (y + 1 == this.pos.y || y - 1 == this.pos.y || y == this.pos.y)){

            return worldMap[this.worldX + '-' + this.worldY].mapData[y][x] == 0; //acceptable tiles
        }
        return false;
    }
};



var players = {};
var worldMap = {}

//detect client connection
eurecaServer.onConnect(function (conn) {
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);

    //the getClient method provide a proxy allowing us to call remote client functions
    var remote = eurecaServer.getClient(conn.id);

    //register the client
    //players[conn.id] = {id:conn.id, remote:remote, state: new PlayerState(conn.id)}
    players[conn.id] = {id:conn.id, remote:remote, state: null}

    //here we call setId (defined in the client side)
    //remote.setId(conn.id);
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

eurecaServer.exports.login = function (username, password){
    var id = this.connection.id;
    var remote = players[id].remote;
    con.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        if(result[0].password == password){
            players[id].state = new PlayerState(id);
            remote.setId(id, result[0]);
        }
        else{
            console.log("Failed");
            console.log(result[0].password + " " + password);
        }
    });
}

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
    if(players[id] && players[id].state.lastUpdated + 750 < currentServerTime){
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

    players[id].state.playersVisible = Object.filter(worldMap[players[id].state.worldX + '-' + players[id].state.worldY].players, player => player.playerName != id);
    newRemote.recieveStateFromServer(players[id].state);

    for(var i in players[id].state.playersVisible) {
        var index = players[id].state.playersVisible[i].playerName;
        var visiblePlayer = players[index];
        if(visiblePlayer.id != id){
            var remote = visiblePlayer.remote;

            visiblePlayer.state.playersVisible = Object.filter(worldMap[visiblePlayer.state.worldX + '-' + visiblePlayer.state.worldY].players, player => player.playerName != visiblePlayer.id);
            remote.recieveStateFromServer(visiblePlayer.state);
        }
       
    }
}

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
                    console.log("World Map Generated");
                }
            });
        });
    });
}

Object.filter = (obj, predicate) => 
    Object.keys(obj)
        .filter( key => predicate(obj[key]) )
        .reduce(function(res, key){
            props = Object.keys(obj[key])
                .filter(prop => prop != 'playersVisible')
            objCopy = {};
            for(var i in props){
                objCopy[props[i]] = obj[key][props[i]];
            }
            res[key] = objCopy;
            return res;
        }, {});
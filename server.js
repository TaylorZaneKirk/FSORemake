var fs = require('fs');
var serverActions = require('./serverActions');

var express = require('express')
    , app = express()
    , server = require('http').createServer(app)

// serve static files from the current directory
app.use(express.static(__dirname));

var Eureca = require('eureca.io');


//create an instance of EurecaServer
var eurecaServer = new Eureca.Server({allow:['setId', 'recieveStateFromServer', 'kill', 'disconnect', 'errorAndDisconnect', 'recieveBroadcast', 'itemUpdate']});

//attach eureca.io to our http server
eurecaServer.attach(server);

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1VT2yQtVjX",
  database: "FSORemake"
});

class Item{
    constructor(data){
        this.itemId = data.itemId;
        this.itemName = data.name;
        this.worldX = data.worldX;
        this.worldY = data.worldY;
        this.pos = {x: data.localX, y: data.localY};
        this.amount = data.amount;
        this.respawnable = data.respawnable;
    }

    pickUp(){
        delete worldMap[this.worldX + '-' + this.worldY].items[this.itemId];
        for(var i in worldMap[this.worldX + '-' + this.worldY].players) {
            var index = worldMap[this.worldX + '-' + this.worldY].players[i].playerId;
            var visiblePlayer = players[index];
            visiblePlayer.remote.updateItem(this.itemId, 'kill');
           
        }
    }
}

//Player state needs to have Health implemented
class PlayerState
{
    constructor(idString, data){
        this.pos = {x: data.localX, y: data.localY};
        this.playerFacing = 'S';
        this.playerId = idString;
        this.username = data.username;
        this.gender = data.gender;
        this.class = data.class;
        this.level = data.level;
        this.gold = data.gold;
        this.maxHealth = data.maxHealth;
        this.health = data.health;
        this.maxFocus = data.maxFocus;
        this.focus = data.focus;
        this.stamina = data.stamina;
        this.strength = data.strength;
        this.dexterity = data.dexterity;
        this.endurance = data.endurance;
        this.agility = data.agility;
        this.arcane = data.arcane;
        this.luck = data.luck;
        this.swordsmanship = data.swordsmanship;
        this.mysticism = data.mysticism;
        this.archery = data.archery;
        this.knifeplay = data.knifeplay;
        this.blocking = data.blocking;
        this.pugilism = data.pugilism;
        this.fireMagic = data.fireMagic;
        this.waterMagic = data.waterMagic;
        this.earthMagic = data.earthMagic;
        this.windMagic = data.windMagic;
        this.whiteMagic = data.whiteMagic;
        this.blackMagic = data.blackMagic;
        this.heavySwords = data.heavySwords;
        this.hammerWielding = data.hammerWielding;
        this.bluntWeapons = data.bluntWeapons;
        this.staffFighting = data.staffFighting;
        this.axeFighting = data.axeFighting;
        this.fencing = data.fencing;
        this.shortBows = data.shortBows;
        this.longBows = data.longBows;
        this.crossbows = data.crossbows;
        this.mining = data.mining;
        this.fishing = data.fishing;
        this.cooking = data.cooking;
        this.alchemy = data.alchemy;
        this.farming = data.farming;
        this.crafting = data.crafting;
        this.blacksmithing = data.blacksmithing;

        this.swordsmanshipCurrent = data.swordsmanshipCurrent;
        this.mysticismCurrent = data.mysticismCurrent;
        this.archeryCurrent = data.archeryCurrent;
        this.knifeplayCurrent = data.knifeplayCurrent;
        this.blockingCurrent = data.blockingCurrent;
        this.pugilismCurrent = data.pugilismCurrent;
        this.fireMagicCurrent = data.fireMagicCurrent;
        this.waterMagicCurrent = data.waterMagicCurrent;
        this.earthMagicCurrent = data.earthMagicCurrent;
        this.windMagicCurrent = data.windMagicCurrent;
        this.whiteMagicCurrent = data.whiteMagicCurrent;
        this.blackMagicCurrent = data.blackMagicCurrent;
        this.heavySwordsCurrent = data.heavySwordsCurrent;
        this.hammerWieldingCurrent = data.hammerWieldingCurrent;
        this.bluntWeaponsCurrent = data.bluntWeaponsCurrent;
        this.staffFightingCurrent = data.staffFightingCurrent;
        this.axeFightingCurrent = data.axeFightingCurrent;
        this.fencingCurrent = data.fencingCurrent;
        this.shortBowsCurrent = data.shortBowsCurrent;
        this.longBowsCurrent = data.longBowsCurrent;
        this.crossbowsCurrent = data.crossbowsCurrent;
        this.miningCurrent = data.miningCurrent;
        this.fishingCurrent = data.fishingCurrent;
        this.cookingCurrent = data.cookingCurrent;
        this.alchemyCurrent = data.alchemyCurrent;
        this.farmingCurrent = data.farmingCurrent;
        this.craftingCurrent = data.craftingCurrent;
        this.blacksmithingCurrent = data.blacksmithingCurrent;

        this.swordsmanshipNext = data.swordsmanshipNext;
        this.mysticismNext = data.mysticismNext;
        this.archeryNext = data.archeryNext;
        this.knifeplayNext = data.knifeplayNext;
        this.blockingNext = data.blockingNext;
        this.pugilismNext = data.pugilismNext;
        this.fireMagicNext = data.fireMagicNext;
        this.waterMagicNext = data.waterMagicNext;
        this.earthMagicNext = data.earthMagicNext;
        this.windMagicNext = data.windMagicNext;
        this.whiteMagicNext = data.whiteMagicNext;
        this.blackMagicNext = data.blackMagicNext;
        this.heavySwordsNext = data.heavySwordsNext;
        this.hammerWieldingNext = data.hammerWieldingNext;
        this.bluntWeaponsNext = data.bluntWeaponsNext;
        this.staffFightingNext = data.staffFightingNext;
        this.axeFightingNext = data.axeFightingNext;
        this.fencingNext = data.fencingNext;
        this.shortBowsNext = data.shortBowsNext;
        this.longBowsNext = data.longBowsNext;
        this.crossbowsNext = data.crossbowsNext;
        this.miningNext = data.miningNext;
        this.fishingNext = data.fishingNext;
        this.cookingNext = data.cookingNext;
        this.alchemyNext = data.alchemyNext;
        this.farmingNext = data.farmingNext;
        this.craftingNext = data.craftingNext;
        this.blacksmithingNext = data.blacksmithingNext;

        this.inventory = [
            data.slot1, data.slot2, data.slot3, data.slot4,
            data.slot5, data.slot6, data.slot7, data.slot8,
            data.slot9, data.slot10, data.slot11, data.slot12, 
            data.slot13, data.slot14, data.slot15, data.slot16,
        ];
        this.equipHead = data.equipHead;
        this.equipTorso = data.equipTorso;
        this.equipRight = data.equipRight;
        this.equipLeft = data.equipLeft;
        this.equipLegs = data.equipLegs;
        this.equipExtra =  data.equipExtra;
        this.playerAction = 'idle';
        this.worldX = data.worldX;
        this.worldY = data.worldY;
        this.lastUpdated = null;
        this.readyToUpdate = false;
        this.playersVisible = {};
        this.mapData = worldMap[this.worldX + '-' + this.worldY];
    }
    /* 
    copy(other)
    {
        this.pos = other.pos;
        this.playerFacing = other.playerFacing;
        this.playerId = other.playerId;
        this.playerAction = other.playerAction;
        this.worldX = other.worldX;
        this.worldY = other.worldY;
        this.lastUpdated = other.lastUpdated;
        this.readyToUpdate = other.readyToUpdate;
        this.playersVisible = other.playersVisible;
        this.mapData = other.mapData;
    } */

    changeMapData(worldXNew, worldYNew){
        worldMap[worldXNew + '-' + worldYNew].players[this.playerId] = this;

        //Need to Let other players know this guy left
        delete worldMap[this.worldX + '-' + this.worldY].players[this.playerId];

        for (var c in worldMap[this.worldX + '-' + this.worldY].players){
            var remote = players[c].remote;

            //here we call kill() method defined in the client side
            remote.kill(this.playerId);
        }
        this.mapData = worldMap[worldXNew + '-' + worldYNew].mapData;
        this.worldX = worldXNew;
        this.worldY = worldYNew;
        con.query("UPDATE users SET worldX='" + this.worldX + "', worldY='" + this.worldY + "' WHERE username = '" + this.username + "'", function (err, result, fields) {});
    }

    takeStep(x, y){
        if((x + 1 == this.pos.x || x - 1 == this.pos.x || x == this.pos.x)
            && (y + 1 == this.pos.y || y - 1 == this.pos.y || y == this.pos.y)){
            
            con.query("UPDATE users SET localX='" + this.pos.x + "', localY='" + this.pos.y + "' WHERE username = '" + this.username + "'", function (err, result, fields) {});
            return worldMap[this.worldX + '-' + this.worldY].mapData[y][x] == 0; //acceptable tiles
        }
        return false;
    }

    takeDamage(damage, attackerId){ //attackerId can be null if player is taking damage from not a player
        this.health -= damage;
        if(this.health > 0){
            con.query("UPDATE users SET health='" + this.health + "' WHERE username = '" + this.username + "'", function (err, result, fields) {});
        }
        else{
            delete worldMap[this.worldX + '-' + this.worldY].players[this.playerId];
            for (var c in worldMap[this.worldX + '-' + this.worldY].players){
                var remote = players[c].remote;
    
                //here we call kill() method defined in the client side
                remote.kill(this.playerId);
            }
            this.health = 100;
            this.worldX = 0;
            this.worldY = 0;
            this.pos = {x: 1, y: 1};
            this.playerFacing = 'S';
            this.playerAction = 'idle';
            this.mapData = worldMap[this.worldX + '-' + this.worldY].mapData;
            worldMap[this.worldX + '-' + this.worldY].players[this.playerId] = this;
            con.query("UPDATE users SET health='" + this.health + 
                "', worldX='" + this.worldX + 
                "', worldY='" + this.worldY + 
                "', localX='" + this.pos.x + 
                "', localY='" + this.pos.y + 
                "' WHERE username='" + this.username + "'", function (err, result, fields) {if (err) throw err; });
            if(attackerId != undefined){
                var winner = players[attackerId].state;
                //winner.getExp(5); //5 experience for killing a player
            }
        }
    }

    /* getExp(expAmount){
        this.exp += expAmount;
        if(this.exp >= 100){
            this.exp -= 100;
            this.gainLevel();

        }
        con.query("UPDATE users SET exp='" + this.exp + "' WHERE username='" + this.username + "'", function (err, result, fields) {if (err) throw err; });
    }

    gainLevel(){
        //Calculate Bonuses here
        this.level++;
        con.query("UPDATE users SET level='" + this.level + "' WHERE username='" + this.username + "'", function (err, result, fields) {if (err) throw err; });
    } */
};



var players = {};
var worldMap = {};
var items = [];

//detect client connection
eurecaServer.onConnect(function (conn) {
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);

    //the getClient method provide a proxy allowing us to call remote client functions
    var remote = eurecaServer.getClient(conn.id);

    //register the client
    players[conn.id] = {id:conn.id, remote:remote, state: null}
});

//detect client disconnection
eurecaServer.onDisconnect(function (conn) {
    console.log('Client disconnected ', conn.id);
    if(players[conn.id].state){
        for (var c in players)
        {
            var remote = players[c].remote;
    
            //here we call kill() method defined in the client side
            remote.kill(conn.id);
        }
        delete worldMap[players[conn.id].state.worldX + '-' + players[conn.id].state.worldY].players[conn.id];
    }

    delete players[conn.id];
});

app.get('/', function (req, res, next) {
    res.sendFile(__dirname+'/index.html');
});

server.listen(process.env.PORT || 55555, function () {
    console.log('\033[96mlistening on localhost:55555 \033[39m');
    con.connect(function(err) {
        if (err) throw err;
        console.log("Database Connection Established");
        con.query("SELECT * FROM worldItems", function (err, result, fields){
            if (err) throw err;

            items = result;
            console.log("Items loaded");
            loadMapData();
        });
    });
});

eurecaServer.exports.login = function (username, password){
    var id = this.connection.id;
    var remote = players[id].remote;
    con.query("SELECT * FROM users INNER JOIN skillLevels ON users.username = skillLevels.username INNER JOIN playerInv on users.username = playerInv.username WHERE users.username = '" + username + "'", function (err, result, fields) {
        if (err){ 
            throw err;
            remote.errorAndDisconnect('An unexpected error occured.');
            return;
        }
        
        if(result[0].password == password){
            console.log(username + " has logged in");
            players[id].state = new PlayerState(id, result[0]);
            remote.setId(id);
        }
        else{
            remote.errorAndDisconnect('Wrong username or password!');
        }
    });
}

eurecaServer.exports.createPlayer = function (username, password, params){
    var id = this.connection.id;
    var remote = players[id].remote;
    var regexUsername = new RegExp('^[a-zA-z][a-zA-Z0-9]{2,16}$'); //Only letters, numbers, or spaces, between 2 and 16 chars
    var regexPassword = new RegExp('^(?=.*[a-zA-Z0-9])(?=.*([-+_!@#$%^&*.,?])).{6,16}$'); //Numbers or letters with atleast 1 symbol between 6 and 16 characters
    var totalPointsUsed = params.strength + params.dexterity + params.endurance + params.agility + params.arcane + params.luck;

    if(totalPointsUsed > 56 || totalPointsUsed < 6){
        remote.errorAndDisconnect('Hacking Detected. Do not do that.');
        return;
    }
    if(!regexUsername.test(username)){
        remote.errorAndDisconnect('The username you have chosen contains invalid characters!');
        return;
    }
    if(!regexPassword.test(password)){
        remote.errorAndDisconnect('The password you choose must container between 6-16 letters OR numbers, and at least 1 symbol.');
        return;
    }

    con.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, result, fields) {
        if (err){ 
            throw err;
            remote.errorAndDisconnect('An unexpected error occured.');
            return;
        }

        if(result.length == 0){

            if(params.class == 'warrior'){
                params.strength += 5;
            }
            else if(params.class == 'archer'){
                params.dexterity += 5;
            }
            else{
                params.arcane += 5;
            }

            con.query("INSERT INTO users(username, password, gender, class, worldX, worldY, localX, localY, level, gold, maxHealth, health, maxFocus, focus, stamina, strength, dexterity, endurance, agility, arcane, luck) VALUES ('" 
                + username + "', '" + password + "', '" + params.gender + "', '" + params.class + "', 0, 0, 1, 1, 1, 0, 100, 100, 25, 25, 100, '" + params.strength + "', '" + params.dexterity + "', '" + params.endurance + "', '" + params.agility + "', '" + params.arcane + "', '" + params.luck + "')", function (err, result, fields) {

                if (err){ 
                    throw err;
                    remote.errorAndDisconnect('An unexpected error occured.');
                    return;
                }

                console.log("New Player Created: " + username);
                //con.query("INSERT INTO skillLevels(username) VALUES('" + username + "')", function (err, result, fields) {if (err) throw err; });

                //con.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, result, fields) 
                con.query("SELECT * FROM users INNER JOIN skillLevels ON users.username = skillLevels.username INNER JOIN playerInv on users.username = playerInv.username WHERE users.username = '" + username + "'", function (err, result, fields) {
                    if (err){ 
                        throw err;
                        remote.errorAndDisconnect('An unexpected error occured.');
                        return;
                    }

                    console.log(result[0]);

                    if(result[0]){
                        players[id].state = new PlayerState(id, result[0]);
                        remote.setId(id);
                    }
                });
            });
        }
        else{
            remote.errorAndDisconnect('This username is already taken! Please choose another and try again.');
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
    if(players[id] && players[id].state.lastUpdated + 250 < currentServerTime){
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
            serverActions.playerAttack(players, id, message.action.payload, message.target);
            break;
        }
        case 'broadcast': {
            serverActions.broadcastMessage(players, id, message.action.payload, message.target);
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

    players[id].state.playersVisible = Object.filter(worldMap[players[id].state.worldX + '-' + players[id].state.worldY].players, player => player.playerId != id);
    console.log(players[id].state);
    newRemote.recieveStateFromServer(players[id].state);

    for(var i in players[id].state.playersVisible) {
        var index = players[id].state.playersVisible[i].playerId;
        var visiblePlayer = players[index];
        if(visiblePlayer.id != id){
            var remote = visiblePlayer.remote;

            visiblePlayer.state.playersVisible = Object.filter(worldMap[visiblePlayer.state.worldX + '-' + visiblePlayer.state.worldY].players, player => player.playerId != visiblePlayer.id);
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
                items.forEach((item) => {
                    if(mapName == (item.worldX + "-" + item.worldY)){
                        worldMap[mapName].items[item.itemId] = new Item(item);
                        console.log(worldMap[mapName].items[item.itemId]);
                    }
                });
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
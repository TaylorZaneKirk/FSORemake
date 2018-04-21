var fs = require('fs');
var serverActions = require('./serverActions');

var express = require('express')
    , app = express()
    , server = require('http').createServer(app)

// serve static files from the current directory
app.use(express.static(__dirname));

var Eureca = require('eureca.io');


//create an instance of EurecaServer
var eurecaServer = new Eureca.Server({allow:['setId', 'recieveStateFromServer', 'kill', 'disconnect', 'errorAndDisconnect', 'recieveBroadcast', 'removeItem', 'placeItem', 'placeNPC', 'removeNPC', 'showDamage', 'showStatus']});

//attach eureca.io to our http server
eurecaServer.attach(server);

var mysql = require('mysql');

var aStar = require('a-star-search');

var PlayerState = require('./playerClass');
var NPC = require('./npcClass');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1VT2yQtVjX",
  database: "FSORemake"
});

class Spell{
    constructor(data){
        this.spellId = data.spellId;
        this.spellName = data.spellName;
        this.spellType = data.spellType;
        this.spellAffinity = data.spellAffinity;
        this.spellTarget = data.spellTarget;
        this.spellPower = data.spellPower;
        this.isBuff = data.isBuff;
        this.effectLength = data.effectLength;
        this.spellCost = data.spellCost;
        this.spellSprite = data.spellSprite;
        this.levelReqArcane = data.levelReqArcane;
        this.levelReqAffinity = data.levelReqAffinity;
    }

    cast(casterId, targetId, casterType, targetType){
        var caster = null;
        var target = null;
        if(casterType == 'npc'){
            caster = npcs[casterId]
        }
        else if(casterType == 'player'){
            caster = players[casterId].state;
        }
        if(targetType == 'npc'){
            target = npcs[targetId];
        }
        else if(targetType == 'player'){
            target = players[targetId].state;
        }

        if(caster.focus - this.spellCost >= 0){
            caster.focus -= this.spellCost;
            if(this.spellType == 2){ //target
                if(this.isBuff){
                    if(this.spellTarget == 'health'){
                        target.health = target.health + this.spellPower <= target.maxHealth ? target.health + this.spellPower : target.maxHealth;
                    }
                    
                }
                else{
                    if(this.spellTarget == 'health'){
                        target.health = target.health - this.spellPower >= 0 ? target.health - this.spellPower : 0;
                    }
                }
            }
            
        }
    }
}

class WorldSpell{
    constructor(spell, caster, target){
        this.locationId = spellLocIdMaxIndex++;
        this.spellId = spell.spellId;
        this.spellData = spellData[spell.spellId];
        this.worldX = caster.worldX;
        this.worldY = caster.worldY;
        this.pos = {x: null, y: null};
        this.target = target;
        this.isActive = true;
    }
}

class WorldItem{
    constructor(data){
        this.locationId = data.locationId;
        this.itemId = data.itemId;
        this.itemName = data.name;
        this.worldX = data.worldX;
        this.worldY = data.worldY;
        this.pos = {x: data.localX, y: data.localY};
        this.amount = data.amount;
        this.respawnable = data.respawnable;
        this.isSpawned = data.isSpawned;
        this.respawnTimer = data.respawnTimer;

        if(this.respawnable && !this.isSpawned){
            setTimeout(() => this.respawn(), this.respawnTimer);
        }
    }

    remove(){
        if(!this.respawnable){
            delete worldMap[this.worldX + '-' + this.worldY].items[this.locationId];
            con.query("DELETE FROM worldItems WHERE locationId = '" + this.locationId + "'", function (err, result, fields) {});
        }
        else{
            //Item is respawnable, need to modify sql table for a isSpawned property and timeToRespawn
            this.isSpawned = false;
            con.query("UPDATE worldItems SET isSpawned = 0 WHERE locationId = '" + this.locationId + "'", function (err, result, fields) {});
            setTimeout(() => this.respawn(), this.respawnTimer);
        }
        for(var i in worldMap[this.worldX + '-' + this.worldY].players) {
            var index = worldMap[this.worldX + '-' + this.worldY].players[i].playerId;
            var visiblePlayer = players[index];
            visiblePlayer.remote.removeItem(this.locationId);
           
        }
    }

    respawn(){
        this.isSpawned = true;
        con.query("UPDATE worldItems SET isSpawned = 1 WHERE locationId = '" + this.locationId + "'", function (err, result, fields) {});
        worldMap[this.worldX + '-' + this.worldY].items[this.locationId] = this;
        for(var i in worldMap[this.worldX + '-' + this.worldY].players) {
            var index = worldMap[this.worldX + '-' + this.worldY].players[i].playerId;
            var visiblePlayer = players[index];
            visiblePlayer.remote.placeItem(this);  
        }
    }

    placeItem(){
        //Register in worldMap
        //Query to place this item into worldItems
        //update players
        for(var i in worldMap[this.worldX + '-' + this.worldY].players) {
            var index = worldMap[this.worldX + '-' + this.worldY].players[i].playerId;
            var visiblePlayer = players[index];
            visiblePlayer.remote.placeItem(this);
           
        }
    }
}

class Item{
    constructor(data){
        this.itemId = data.itemId;
        this.itemName = data.itemName;
        this.canEquip = data.canEquip;
        this.canConsume = data.canConsume;
        this.maxHealthBonus = data.maxHealthBonus;
        this.currentHealthBonus = data.currentHealthBonus;
        this.maxFocusBonus = data.maxFocusBonus;
        this.currentFocusBonus = data.currentFocusBonus;
        this.maxStaminaBonus = data.maxStaminaBonus;
        this.currentStaminaBonus = data.currentStaminaBonus;
        this.strengthBonus = data.strengthBonus;
        this.dexterityBonus = data.dexterityBonus;
        this.enduranceBonus = data.enduranceBonus;
        this.agilityBonus = data.agilityBonus;
        this.arcaneBonus = data.arcaneBonus;
        this.luckBonus = data.luckBonus;
        this.physicalAttack = data.physicalAttack;
        this.physicalDefense = data.physicalDefense;
        this.physicalEvasion = data.physicalEvasion;
        this.magicalAttack = data.magicalAttack;
        this.magicalDefense = data.magicalDefense;
        this.magicalEvasion = data.magicalEvasion;
        this.amount = data.amount;
        this.equipSlot = data.equipSlot;
        this.effectLength = data.effectLength;
        this.itemType = data.itemType;
        this.levelReqStat = data.levelReqStat;
        this.levelReqSkill = data.levelReqSkill;
    }
}

var players = {};
var npcs = {};
var activeNPCs = {};
var manageNPCInterval = null;
var worldMap = {};
var worldGrid = {};
var worldItems = [];
var worldSpells = [];
var itemData = {};
var spellData = {};
var locationIdMaxIndex = 0;
var spellLocIdMaxIndex = 0;

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
            if(players[c].state.worldX == players[conn.id].state.worldX && players[c].state.worldY == players[conn.id].state.worldY){
                remote.kill(conn.id);
            }
            remote.recieveBroadcast(this.username + " has logged out", '#ffff00');
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

            worldItems = result;
            console.log("World Items loaded");

            con.query("SELECT * FROM npcs", function (err, result, fields){
                if (err) throw err;
    
                for(var npc of result){
                    npcs[npc.npcId] = new NPC(npc);
                }
                console.log("NPCs loaded");
                loadMapData();
            });
        });

        con.query("SELECT * FROM itemData", function (err, result, fields){
            if (err) throw err;

            for(var item of result){
                itemData[item.itemId] = new Item(item);
            }
            console.log("Item Data loaded");
        });

        con.query("SELECT * FROM spellData", function (err, result, fields){
            if (err) throw err;

            for(var spell of result){
                spellData[spell.spellId] = new Spell(spell);
            }
            console.log("Spell Data loaded");
        });
    });
});

eurecaServer.exports.login = function (username, password){
    var id = this.connection.id;
    var remote = players[id].remote;

    //make sure that player isn't logged on already
    for(var i in players){
        if(players[i].state && players[i].state.username == username){
            remote.errorAndDisconnect('Sorry, this player is already logged in.');
        }
    }
    con.query("SELECT * FROM users INNER JOIN skillLevels ON users.username = skillLevels.username INNER JOIN playerInv on users.username = playerInv.username INNER JOIN playerSpells on users.username = playerSpells.username WHERE users.username = '" + username + "'", function (err, result, fields) {
        if (err){ 
            throw err;
            remote.errorAndDisconnect('An unexpected error occured.');
            return;
        }
        
        if(result[0] && result[0].password == password){
            console.log(username + " has logged in");
            players[id].state = new PlayerState(id, result[0]);
            worldMap[players[id].state.worldX + '-' + players[id].state.worldY].players[id] = players[id].state;
            remote.setId(id, itemData);
            for(var i in players){
                var player = players[i];
                player.remote.recieveBroadcast(this.username + " has logged in", '#ffff00');
            }
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

            con.query("INSERT INTO users(username, password, gender, headType, class, worldX, worldY, localX, localY, level, gold, maxHealth, health, maxFocus, focus, maxStamina, stamina, strength, dexterity, endurance, agility, arcane, luck) VALUES ('" 
                + username + "', '" + password + "', '" + params.gender + "', '" + params.headType + "', '" + params.class + "', 0, 0, 1, 1, 1, 0, 100, 100, 25, 25, 25, 25, '" + params.strength + "', '" + params.dexterity + "', '" + params.endurance + "', '" + params.agility + "', '" + params.arcane + "', '" + params.luck + "')", function (err, result, fields) {

                if (err){ 
                    throw err;
                    remote.errorAndDisconnect('An unexpected error occured.');
                    return;
                }

                console.log("New Player Created: " + username);
                //con.query("INSERT INTO skillLevels(username) VALUES('" + username + "')", function (err, result, fields) {if (err) throw err; });

                //con.query("SELECT * FROM users WHERE username = '" + username + "'", function (err, result, fields) 
                con.query("SELECT * FROM users INNER JOIN skillLevels ON users.username = skillLevels.username INNER JOIN playerInv on users.username = playerInv.username INNER JOIN playerSpells on users.username = playerSpells.username WHERE users.username = '" + username + "'", function (err, result, fields) {
                    if (err){ 
                        throw err;
                        remote.errorAndDisconnect('An unexpected error occured.');
                        return;
                    }

                    if(result[0]){
                        players[id].state = new PlayerState(id, result[0]);
                        worldMap[players[id].state.worldX + '-' + players[id].state.worldY].players[id] = players[id].state;
                        remote.setId(id);
                        for(var i in players){
                            var player = players[i];
                            player.remote.recieveBroadcast(this.username + " has logged in", '#ffff00');
                        }
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
        players[id].state.stamina = players[id].state.stamina == players[id].state.maxStamina ? players[id].state.stamina : players[id].state.stamina + 1;
        
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
            serverActions.playerAttack(players, itemData, id, message.action.payload, message.target);
            break;
        }
        case 'broadcast': {
            serverActions.broadcastMessage(players, id, message.action.payload, message.target);
            break;
        }
        case 'pickup': {
            serverActions.pickUpItem(players[id].state);
            break;
        }
        case 'equipItem': {
            serverActions.equipItem(players[id].state, message, itemData);
            break;
        }
        case 'unequipItem': {
            serverActions.unequipItem(players[id].state, message.target);
            break;
        }
        case 'dropItem': {
            players[id].state.dropItem(message.target);
            break;
        }
        default: {
            console.log("ERROR: Recieved invalid message");
            console.log(message);
            return;
        }
    }
}

//Update player about all players, and all players about player
eurecaServer.updateClients = function (id) {
    var newRemote = players[id].remote;
    var allPlayerStates = [];
    var origWorldMap = Object.assign({}, worldMap[players[id].state.worldX + '-' + players[id].state.worldY]);

    players[id].state.playersVisible = Object.filter(worldMap[players[id].state.worldX + '-' + players[id].state.worldY].players, player => player.playerId != id);
    players[id].state.mapData.players = players[id].state.playersVisible;
    players[id].state.readyToUpdate = true;

    newRemote.recieveStateFromServer(players[id].state);
    
    for(var i in players[id].state.playersVisible) {
        var index = players[id].state.playersVisible[i].playerId;
        var visiblePlayer = players[index];
        if(visiblePlayer.id != id){
            var remote = visiblePlayer.remote;

            visiblePlayer.state.playersVisible = Object.filter(worldMap[visiblePlayer.state.worldX + '-' + visiblePlayer.state.worldY].players, player => player.playerId != visiblePlayer.id);
            visiblePlayer.state.mapData.players = visiblePlayer.state.playersVisible;
            remote.recieveStateFromServer(visiblePlayer.state);
        }
       
    }
    worldMap[players[id].state.worldX + '-' + players[id].state.worldY] = Object.assign({}, origWorldMap);
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

                worldGrid[mapName] = {blockedLocations: [], worldSize: {xAxis: 17, yAxis: 12}};

                var index = 0;

                for (var x = 0; x < 12; x++){
                    worldMap[mapName].mapData[x] = {};
                    for (var y = 0; y < 17; y++) {
                        if(content[index] == '\n' || content[index] == ';'){
                            y--;
                        }
                        else if(content[index] != '\n' && content[index] != ';'){
                            worldMap[mapName].mapData[x][y] = content[index];
                            if(content[index] == 1){ //blocked tiles
                                worldGrid[mapName].blockedLocations.push({xAxis: y, yAxis: x});
                            }
                        }
                        index++;
                    }
                }

                worldItems.forEach((item) => {
                    if(mapName == (item.worldX + "-" + item.worldY)){
                        worldMap[mapName].items[item.locationId] = new WorldItem(item);
                        if (locationIdMaxIndex < item.locationId){
                            locationIdMaxIndex = item.locationId; //Need the highest index so that we can properly create new worldItems for when players drop items
                        }
                    }
                });

                for(var i in npcs) {
                    var npc = npcs[i];
                    if(mapName == (npc.worldX + "-" + npc.worldY)){
                        worldMap[mapName].npcs[npc.npcId] = npc;
                    }
                }
                filesRead++;
                
                if(filesRead != 0 && filesRead == totalFiles){
                    console.log("World Map Generated");

                    manageNPCInterval = setInterval(() => manageActiveNPCs(), 3500)
                }
            });
        });
    });
}

manageActiveNPCs = function (){
    for(var i in activeNPCs){
        var thisNPC = activeNPCs[i];
        thisNPC.decideAction();
    }
}

Object.filter = (obj, predicate) => 
    Object.keys(obj)
        .filter( key => predicate(obj[key]) )
        .reduce(function(res, key){
            props = Object.keys(obj[key])
                .filter(prop => prop != 'playersVisible' && prop != 'mapData')
            objCopy = {};
            for(var i in props){
                objCopy[props[i]] = obj[key][props[i]];
            }
            res[key] = objCopy;
            return res;
        }, {});
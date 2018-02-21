

///Main Game 'World' script//
////////////////////////////
var client;

// the structure of the map
var mapData;
var map; //first layer tile objects
var layerFirst;
var layer2;

// Reference to our eureca so we can call functions back on the server
var eurecaProxy;

// initialize phaser, call create() once done
var game = new Phaser.Game(800, 600, Phaser.AUTO, null, {
    init: init,
    preload: preload,
    create: create,
    update: update,
    render: render,
});

game.global = {
    player: null, //References for local player state
    playerList: {}, //References for all visible player states
    npcList: {}, //References for all visible NPC states
    ready: false,
    myId: 0, //Id for server
    myMap: null, //Tiles for current screen
    //map: null, 
    walls: null, //Likely to be factored to 2nd or 3rd layer
    easystar: null,
    localPlayerObject: null,
};

function init() {
    //Add the server client for multiplayer

    client = new Eureca.Client();

    game.global.ready = false;

    game.global.player = false;

}

//THIS NEXT!!!
function preload() {
    game.load.image('tileset', 'assets/tiles/FSORemakeMapTileset.png');
    game.load.spritesheet('player', 'assets/PlayerSheet.png', 44, 45);
    //game.load.image('clown', 'assets/images/clown.png');
    //game.load.image('portal', 'assets/images/portal.png');
    //game.global.easystar = new EasyStar.js();   //start the pathfinder
}

function create() {
    initMultiPlayer(game, game.global);

    //game.physics.startSystem(Phaser.Physics.ARCADE);

    //Maps and layers
    map = game.add.tilemap();
    map.addTilesetImage('tileset', null, 32, 32);
    layerFirst = map.create('map', 18, 13, 32, 32);
    //map.putTile(0, 1, 1, layerFirst);
    //layer2 = map.createBlankLayer('collisions', COLS, ROWS, 20, 20);
    //layer2.properties = {'collision' : true};
    //layer.resizeWorld();
}

function initMultiPlayer(game, globals){

    

    /**
        * Fires on initial connection
        */
    client.onConnect(function (connection) {
        console.log('Incoming connection', connection);

    });
    /**
        * When the connection is established and ready
        * we will set a local variable to the "serverProxy"
        * sent back by the server side.
        */
    client.ready(function (serverProxy) {
        // Local reference to the server proxy to be
        // used in other methods within this module.
        eurecaProxy = serverProxy;
    });

    /**
        * This sets the players id that we get from the server
        * It creates the instance of the player, and communicates
        * it's state information to the server.
        */
    client.exports.setId = function(id){
        console.log("Setting Id:" + id);

        // Assign my new connection Id
        globals.myId = id;

        // Put instance of new player into list
        //globals.playerList[id] = globals.player

        //tell server client is ready
        eurecaProxy.initPlayer(id);

    }

    client.exports.recieveStateFromServer = function(state) {
        console.log("Recieved State");
        state.lastUpdated = new Date().getTime();

        if(globals.player != false && globals.player.worldX != state.worldX && globals.player.worldY != state.worldY){
            changeMap(state.mapData, map, layerFirst);
        }

        if(state.playerName == globals.myId){
            console.log("Assigned Player State");
            globals.player = state;
            console.log(globals.player);
        }

        if(game.global.localPlayerObject == null){
            globals.localPlayerObject = new PlayerObject(state.playerName, game);
            game.global.ready = true;
            changeMap(state.mapData, map, layerFirst);
        }
        globals.playerList[state.playerName] = state;
    }
}



function update() {
    if (!game.global.ready || !game.global.player || game.global.localPlayerObject == {}){
        return; //Stuff isn't ready; hold on...
    }

    var currentTime = new Date();
    
    //wait [0.25] seconds before requesting an update from the server
    if (game.global.player.lastUpdated + 250 < currentTime.getTime() ){
        game.global.player.lastUpdated = new Date().getTime();
        eurecaProxy.requestUpdate(game.global.myId);
    }
    


    if(game.global.localPlayerObject != null || game.global.localPlayerObject != {}){
        game.global.localPlayerObject.update();    //update player
    }
    

    /* for (var c in game.global.npcList){ //update NPCs
        game.global.npcList[c].update();
    } */
}

function render() {
    /*for (var c in game.global.npcList){ //update NPCs
        game.global.npcList[c].render();
    }*/
}

sendMessageToServer = function(action, target) {
    if(action == null || action == undefined ||
        action.type == null || action.type == undefined ||
        action.payload == null || action.payload == undefined ||
        target == null || target == undefined){
        console.log("ERROR: Attempted to send invalid message");
        return;
    }

    eurecaProxy.message(game.global.myId, {action: action, target: target});
}

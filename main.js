

///Main Game 'World' script//
////////////////////////////
var client;

// map dimensions
var ROWS = 30; //y
var COLS = 40; //x

// the structure of the map
var mapData;
var map; //first layer tile objects
var layer;
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
    game.load.image('tileset', 'assets/FSORemakeMapTileset.png');
    game.load.spritesheet('player', 'assets/PlayerSheet.png', 46, 45);
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
    //layer = map.create('level1', COLS, ROWS, 20, 20);
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

        //TODO!!!!!!!! Create new player
        //globals.localPlayerObject = new PlayerObject(id, game);

        // Put instance of new player into list
        //globals.playerList[id] = globals.player

        //Send state to server
        eurecaProxy.initPlayer(id);

        //console.log(globals.playerList);

        // Were ready to go
        //globals.ready = true;

        

    }

    client.exports.recieveStateFromServer = function(state) {
        console.log("Recieved State");
        state.lastUpdated = new Date().getTime();

        if(state.playerName == globals.myId){
            console.log("Assigned Player State");
            globals.player = state;
            console.log(globals.player);
        }

        if(game.global.localPlayerObject == null || game.global.localPlayerObject == {}){
            globals.localPlayerObject = new PlayerObject(state.playerName, game);
            game.global.ready = true;
        }
        globals.playerList[state.playerName] = state;
    }
}



function update() {
    if (!game.global.ready || game.global.player == false || game.global.localPlayerObject == {}){
        return; //Stuff isn't ready; hold on...
    }

    var currentTime = new Date();
    
    //wait [1.25] seconds before requesting an update from the server
    if (game.global.player.lastUpdated + 250 < currentTime.getTime() ){
        game.global.player.lastUpdated = new Date().getTime();
        console.log(game.global.player.lastUpdated + 250 + " " + currentTime.getTime())
        console.log("Requesting new state");
        console.log(game.global.localPlayerObject);
        eurecaProxy.requestUpdate(game.global.myId);
    }
    
//Rename this to playerSprites

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

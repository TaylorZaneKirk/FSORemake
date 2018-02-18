///Main Game 'World' script//
////////////////////////////

var client;

// map dimensions
var ROWS = 30; //y
var COLS = 40; //x

// the structure of the map
var mapData;
var map;
var layer;
var layer2;

// initialize phaser, call create() once done
var game = new Phaser.Game(800, 600, Phaser.AUTO, null, {
    init: init,
    preload: preload,
    create: create,
    update: update,
    render: render,
});

game.global = {
    player: null,
    playerList: {},
    npcList: {},
    ready: false,
    myId: 0,
    myMap: null,
    map: null,
    walls: null,
    warps: [],
    easystar: null
};

function init() {
    //Add the server client for multiplayer

    client = new Eureca.Client();

    game.global.ready = false;

    game.global.player = false;

}

function preload() {
    /* game.load.image('tileset', 'assets/tileset.png');
    game.load.image('player', 'assets/images/phaser-dude.png');
    game.load.image('clown', 'assets/images/clown.png');
    game.load.image('portal', 'assets/images/portal.png');
    game.global.easystar = new EasyStar.js();   //start the pathfinder */
}

function create() {
    initMultiPlayer(game, game.global);

    /* game.physics.startSystem(Phaser.Physics.ARCADE);

    //Maps and layers
    map = game.add.tilemap();
    walls = game.add.group();
    tiles = map.addTilesetImage('tileset', null, 20, 20);
    layer = map.create('level1', COLS, ROWS, 20, 20);
    layer2 = map.createBlankLayer('collisions', COLS, ROWS, 20, 20);
    layer2.properties = {'collision' : true};
    layer.resizeWorld(); */
}

function initMultiPlayer(game, globals){

    // Reference to our eureca so we can call functions back on the server
    var eurecaProxy;

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

        // Send a handshake to say hello to other players.
        eurecaProxy.handshake();
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

        // Create new player
        //globals.player = new aPlayer(id, game, eurecaProxy);

        // Put instance of new player into list
        //globals.playerList[id] = globals.player

        //Send state to server
        //eurecaProxy.initPlayer(id, globals.player.state);

        //console.log(globals.playerList);

        // Were ready to go
        globals.ready = true;

        

    }
}